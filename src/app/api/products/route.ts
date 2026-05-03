import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    let targetCalories = 2000;
    const recommendedProductIds = new Set<string>();

    if (session) {
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

      if (profile && profile.riwayatAnalisis.length > 0) {
        const latest = profile.riwayatAnalisis[0];
        const mealPlanDetail = latest.mealPlan?.detailRencanaMakan as Record<
          string,
          unknown
        >;

        targetCalories =
          mealPlanDetail?.target_kalori_harian ||
          profile.anjuranKaloriDokter ||
          2000;

        // Extract recommended products
        if (mealPlanDetail) {
          const sessions = [
            'rekomendasi_pagi',
            'rekomendasi_snack_pagi',
            'rekomendasi_siang',
            'rekomendasi_snack_sore',
            'rekomendasi_malam',
          ];
          sessions.forEach((s) => {
            const foods =
              (mealPlanDetail[s] as Array<{ produk_id?: string }>) || [];
            foods.forEach((food) => {
              if (food.produk_id) {
                recommendedProductIds.add(food.produk_id);
              }
            });
          });
        }
      }
    }

    const products = await prisma.produkMakanan.findMany();
    type ProdukRow = {
      id: string;
      namaProduk: string | null;
      kategori: string | null;
      gambar: string | null;
      harga: unknown;
      nilaiGizi: unknown;
      stok: number | null;
      labelRisiko?: string | null;
    };

    const mappedProducts = (products as ProdukRow[]).map((p) => {
      const gizi = (p.nilaiGizi as Record<string, unknown>) || {};
      const isAiRecommended = recommendedProductIds.has(p.id);

      return {
        id: p.id,
        name: p.namaProduk,
        category: p.kategori,
        image: p.gambar,
        price: Number(p.harga || 0),
        stok: p.stok,
        label_risiko: p.labelRisiko || '',
        badges: {
          healthSafe: Boolean(gizi.healthSafe),
          aiRecommended: isAiRecommended || Boolean(gizi.aiRecommended), // fallback ke seed jika tidak login
        },
        tags: (gizi.tags as string[]) || [],
        calories: Number(gizi.calories) || 0,
        protein: Number(gizi.protein) || 0,
        fat: Number(gizi.fat) || 0,
        carbs: Number(gizi.carbs) || 0,
        sugars: Number(gizi.sugars) || 0,
        sodium: Number(gizi.sodium) || 0,
        cholesterol: Number(gizi.cholesterol) || 0,
      };
    });

    return NextResponse.json({
      targetCalories,
      products: mappedProducts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 },
    );
  }
}
