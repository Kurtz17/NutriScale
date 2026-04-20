import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await prisma.produkMakanan.findMany();
    type ProdukRow = {
      id: string;
      namaProduk: string | null;
      kategori: string | null;
      gambar: string | null;
      harga: unknown;
      nilaiGizi: unknown;
    };
    const mappedProducts = (products as ProdukRow[]).map((p) => {
      const gizi = (p.nilaiGizi as Record<string, unknown>) || {};
      return {
        id: p.id,
        name: p.namaProduk,
        category: p.kategori,
        image: p.gambar,
        price: Number(p.harga || 0),
        badges: {
          healthSafe: Boolean(gizi.healthSafe),
          aiRecommended: Boolean(gizi.aiRecommended),
        },
        tags: (gizi.tags as string[]) || [],
        calories: Number(gizi.calories) || 0,
        protein: Number(gizi.protein) || 0,
      };
    });
    return NextResponse.json(mappedProducts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 },
    );
  }
}
