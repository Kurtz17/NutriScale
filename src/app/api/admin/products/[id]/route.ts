import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
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

    const product = await prisma.produkMakanan.update({
      where: { id },
      data: {
        namaProduk,
        kategori,
        harga: harga ? Number(harga) : undefined,
        stok: stok !== undefined ? Number(stok) : undefined,
        labelRisiko,
        gambar,
        nilaiGizi: nilaiGizi
          ? {
              calories: Number(nilaiGizi.calories || 0),
              protein: Number(nilaiGizi.protein || 0),
              fat: Number(nilaiGizi.fat || 0),
              carbs: Number(nilaiGizi.carbs || 0),
              sugars: Number(nilaiGizi.sugars || 0),
              sodium: Number(nilaiGizi.sodium || 0),
              cholesterol: Number(nilaiGizi.cholesterol || 0),
              tags: nilaiGizi.tags || [],
              healthSafe: Boolean(nilaiGizi.healthSafe),
              aiRecommended: Boolean(nilaiGizi.aiRecommended),
            }
          : undefined,
      },
    });

    // Trigger AI Engine sync background task
    try {
      if (process.env.AI_ENGINE_URL && process.env.AI_ENGINE_API_KEY) {
        fetch(`${process.env.AI_ENGINE_URL}/api/sync`, {
          method: 'POST',
          headers: { 'X-API-Key': process.env.AI_ENGINE_API_KEY },
        }).catch((err) => console.error('Failed to trigger AI sync:', err));
      }
    } catch (e) {
      console.error('Failed to execute AI sync logic', e);
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('API_ADMIN_PRODUCTS_PATCH', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.produkMakanan.delete({
      where: { id },
    });

    // Trigger AI Engine sync background task
    try {
      if (process.env.AI_ENGINE_URL && process.env.AI_ENGINE_API_KEY) {
        fetch(`${process.env.AI_ENGINE_URL}/api/sync`, {
          method: 'POST',
          headers: { 'X-API-Key': process.env.AI_ENGINE_API_KEY },
        }).catch((err) => console.error('Failed to trigger AI sync:', err));
      }
    } catch (e) {
      console.error('Failed to execute AI sync logic', e);
    }

    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('API_ADMIN_PRODUCTS_DELETE', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
