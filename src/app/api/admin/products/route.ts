import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      namaProduk,
      kategori,
      harga,
      stok,
      labelRisiko,
      gambar,
      nilaiGizi,
    } = body;

    if (!namaProduk || !harga) {
      return NextResponse.json(
        { error: 'Nama dan Harga wajib diisi' },
        { status: 400 },
      );
    }

    const product = await prisma.produkMakanan.create({
      data: {
        id: crypto.randomUUID(),
        namaProduk,
        kategori,
        harga: Number(harga),
        stok: Number(stok || 0),
        labelRisiko,
        gambar,
        nilaiGizi: {
          calories: Number(nilaiGizi?.calories || 0),
          protein: Number(nilaiGizi?.protein || 0),
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('API_ADMIN_PRODUCTS_POST', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
