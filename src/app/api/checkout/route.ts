import { auth } from '@/lib/auth';
import { createMidtransTransaction } from '@/lib/midtrans';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { cartItems } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    let totalHarga = 0;
    const orderItems = [];

    // Verifikasi stok dan harga dari database
    for (const item of cartItems) {
      const dbProduct = await prisma.produkMakanan.findUnique({
        where: { id: String(item.id) },
      });

      if (!dbProduct) {
        return NextResponse.json(
          { error: `Produk dengan ID ${item.id} tidak ditemukan` },
          { status: 404 },
        );
      }

      if (dbProduct.stok !== null && dbProduct.stok < item.quantity) {
        return NextResponse.json(
          {
            error: `Stok tidak mencukupi untuk produk ${dbProduct.namaProduk}`,
          },
          { status: 400 },
        );
      }

      const harga = Number(dbProduct.harga || 0);
      totalHarga += harga * item.quantity;

      orderItems.push({
        id: crypto.randomUUID(),
        produkId: dbProduct.id,
        kuantitas: item.quantity,
        harga: harga,
      });
    }

    // Ongkir 15000
    totalHarga += 15000;

    // Buat pesanan baru
    const pesanan = await prisma.pesanan.create({
      data: {
        id: crypto.randomUUID(),
        userId: session.user.id,
        totalHarga: totalHarga,
        statusPesanan: 'TERTUNDA',
        orderItems: {
          create: orderItems,
        },
      },
    });

    // Buat transaksi pembayaran dengan status tertunda
    await prisma.transaksiPembayaran.create({
      data: {
        id: crypto.randomUUID(),
        pesananId: pesanan.id,
        statusPembayaran: 'TERTUNDA',
      },
    });

    // Generate transaksi midtrans
    const midtransRes = await createMidtransTransaction(pesanan.id, totalHarga);

    return NextResponse.json({
      redirectUrl: midtransRes.redirect_url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
