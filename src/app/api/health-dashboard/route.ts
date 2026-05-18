import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { FoodItem, Meal, MealPlanDetail, Stat } from '@/types/health-dashboard';
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

    // Get latest health profile
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

    // Default stats
    let stats: Stat[] = [
      { title: 'Body Mass Index (BMI)', value: '0.0', status: 'Normal' },
      { title: 'Daily Calories', value: `0 / 0`, progress: 0 },
      { title: 'Protein Intake', value: `0 / 0g`, progress: 0 },
      { title: 'Health Status', value: 'No Data Yet' },
    ];

    const meals: Meal[] = [];

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

      // Meal sessions config
      const sessions = [
        { key: 'rekomendasi_pagi', label: 'Breakfast', time: '07:00 AM' },
        { key: 'rekomendasi_snack_pagi', label: 'Snack', time: '10:00 AM' },
        { key: 'rekomendasi_siang', label: 'Lunch', time: '01:00 PM' },
        { key: 'rekomendasi_snack_sore', label: 'Snack', time: '04:00 PM' },
        { key: 'rekomendasi_malam', label: 'Dinner', time: '07:00 PM' },
      ] as const;

      // Calculate actual intake from today's successful orders
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
            include: { produk: true },
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

      // Map sessions to recommended meals
      sessions.forEach((s) => {
        const foodItems = (mealPlanDetail?.[s.key] as FoodItem[]) || [];
        if (foodItems.length > 0) {
          const allPurchased = foodItems.every(
            (food) => food.produk_id && purchasedProductIds.has(food.produk_id),
          );

          if (!allPurchased) {
            let sessionCalories = 0;
            let sessionProtein = 0;

            const items = foodItems.map((food) => {
              const qty = food.recommended_quantity || 1;
              sessionCalories += food.calories * qty;
              sessionProtein += food.protein * qty;

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
              type: s.label,
              totalCalories: Math.round(sessionCalories),
              totalProtein: Math.round(sessionProtein),
              items,
            });
          }
        }
      });

      const isAdult = profile.umur && profile.umur > 18;

      stats = [
        isAdult
          ? {
              title: 'Body Mass Index (BMI)',
              value: `${Number(latest.bmi).toFixed(1)}`,
              status: latest.statusNutrisi,
            }
          : {
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
      narasiAI: '',
      targetCalories: 0,
      targetProtein: 0,
    });
  } catch (error) {
    console.error('Health Dashboard Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health data' },
      { status: 500 },
    );
  }
}
