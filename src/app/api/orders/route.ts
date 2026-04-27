import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pesananList = await prisma.pesanan.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            produk: true,
          },
        },
      },
    });

    const orders = pesananList.map((pesanan) => {
      let totalCalories = 0;

      const items = pesanan.orderItems.map((item) => {
        // Coba ekstrak kalori dari nilaiGizi
        let itemCalories = 0;
        if (
          item.produk.nilaiGizi &&
          typeof item.produk.nilaiGizi === 'object'
        ) {
          const gizi = item.produk.nilaiGizi as { kalori?: number };
          if (gizi.kalori) {
            itemCalories = Number(gizi.kalori) * item.kuantitas;
          }
        }
        totalCalories += itemCalories;

        return {
          name: item.produk.namaProduk || 'Unknown Product',
          price: Number(item.harga),
          qty: item.kuantitas,
        };
      });

      return {
        id: pesanan.id,
        date: pesanan.createdAt.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        totalPrice: Number(pesanan.totalHarga),
        totalCalories,
        status: pesanan.statusPesanan, // TERTUNDA | DIPROSES | DIKIRIM | SELESAI
        items,
      };
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
