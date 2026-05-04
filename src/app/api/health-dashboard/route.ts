import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to get latest health profile for user
    const profile = await prisma.profilKesehatan.findFirst({
      where: { userId: session.user.id },
      include: {
        riwayatAnalisis: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { mealPlan: true },
        },
      },
    });

    // If we have actual DB data, map it. Otherwise provide safe defaults/empty
    let stats = [
      { title: 'WHO Z-Score (HAZ)', value: '+0.0 SD', status: 'Normal' },
      { title: 'Daily Calories', value: `0 / 0`, progress: 0 },
      { title: 'Protein Intake', value: `0 / 0g`, progress: 0 },
      { title: 'Health Status', value: 'No Data Yet' },
    ];

    type MealEntry = {
      time: string;
      type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
      totalCalories: number;
      totalProtein: number;
      items: {
        productId?: string;
        image?: string;
        price?: number;
        recommended_quantity?: number;
        title: string;
        calories: number;
        protein: number;
        tags: string[];
      }[];
    };
    let meals: MealEntry[] = [];

    interface FoodItem {
      produk_id?: string;
      gambar?: string;
      harga?: number;
      nama_makanan: string;
      calories: number;
      protein: number;
      fat: number;
      carbs: number;
      match_score: number;
      recommended_quantity?: number;
    }

    interface MealPlanDetail {
      target_kalori_harian?: number;
      distribusi?: {
        protein_g?: number;
        fat_g?: number;
        carbs_g?: number;
      };
      narasiAI?: string;
      [key: string]: unknown; // For dynamic meal session keys
    }

    if (profile && profile.riwayatAnalisis.length > 0) {
      const latest = profile.riwayatAnalisis[0];
      const mealPlanDetail = latest.mealPlan
        ?.detailRencanaMakan as unknown as MealPlanDetail;

      const targetCalories =
        mealPlanDetail?.target_kalori_harian ||
        profile.anjuranKaloriDokter ||
        0;
      const targetProtein = mealPlanDetail?.distribusi?.protein_g || 0;
      const narasiAI = mealPlanDetail?.narasiAI || '';

      // Map sessions to meals
      const sessions = [
        { key: 'rekomendasi_pagi', label: 'Breakfast', time: '07:00 AM' },
        { key: 'rekomendasi_snack_pagi', label: 'Snack', time: '10:00 AM' },
        { key: 'rekomendasi_siang', label: 'Lunch', time: '01:00 PM' },
        { key: 'rekomendasi_snack_sore', label: 'Snack', time: '04:00 PM' },
        { key: 'rekomendasi_malam', label: 'Dinner', time: '07:00 PM' },
      ];

      // Calculate actual intake from today's orders
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const pesananHariIni = await prisma.pesanan.findMany({
        where: {
          userId: session.user.id,
          createdAt: { gte: startOfDay },
          statusPesanan: { in: ['DIPROSES', 'DIKIRIM', 'SELESAI'] },
        },
        include: {
          orderItems: {
            include: {
              produk: true,
            },
          },
        },
      });

      let currentCalorieIntake = 0;
      let currentProteinIntake = 0;
      const purchasedProductIds = new Set<string>();

      pesananHariIni.forEach((pesanan) => {
        pesanan.orderItems.forEach((item) => {
          purchasedProductIds.add(item.produk.id);
          const gizi = (item.produk.nilaiGizi as Record<string, unknown>) || {};
          const cals = Number(gizi.calories) || 0;
          const prot = Number(gizi.protein) || 0;
          currentCalorieIntake += cals * item.kuantitas;
          currentProteinIntake += prot * item.kuantitas;
        });
      });

      meals = [];

      sessions.forEach((s) => {
        const foodItems = (mealPlanDetail?.[s.key] as FoodItem[]) || [];
        if (foodItems.length > 0) {
          // Check if all items in this session have been purchased today
          const allPurchased = foodItems.every(
            (food) => food.produk_id && purchasedProductIds.has(food.produk_id),
          );

          if (!allPurchased) {
            let totalCalories = 0;
            let totalProtein = 0;

            const items = foodItems.map((food) => {
              const qty = food.recommended_quantity || 1;
              totalCalories += food.calories * qty;
              totalProtein += food.protein * qty;

              return {
                productId: food.produk_id,
                image: food.gambar,
                price: food.harga,
                recommended_quantity: qty,
                title: food.nama_makanan,
                calories: food.calories,
                protein: food.protein,
                tags: [s.label, `Match: ${food.match_score}%`],
              };
            });

            meals.push({
              time: s.time,
              type: s.label as 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack',
              totalCalories: Math.round(totalCalories),
              totalProtein: Math.round(totalProtein),
              items,
            });
          }
        }
      });

      stats = [
        {
          title: 'WHO Z-Score (HAZ)',
          value: `${Number(latest.haz) > 0 ? '+' : ''}${latest.haz} SD`,
          status: latest.statusNutrisi,
        },
        {
          title: 'Daily Calories',
          value: `${Math.round(currentCalorieIntake)} / ${Math.round(targetCalories)}`,
          progress:
            targetCalories > 0
              ? (currentCalorieIntake / targetCalories) * 100
              : 0,
        },
        {
          title: 'Protein Intake',
          value: `${Math.round(currentProteinIntake)}g / ${Math.round(targetProtein)}g`,
          progress:
            targetProtein > 0
              ? (currentProteinIntake / targetProtein) * 100
              : 0,
        },
        { title: 'Health Status', value: latest.statusNutrisi },
      ];

      return NextResponse.json({
        stats,
        meals,
        narasiAI,
        targetCalories: Math.round(targetCalories),
        targetProtein: Math.round(targetProtein),
      });
    }

    return NextResponse.json({
      stats,
      meals,
      targetCalories: 0,
      targetProtein: 0,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch health data' },
      { status: 500 },
    );
  }
}
