import { verifySignatureKey } from '@/lib/midtrans';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
    } = body;

    const isValid = await verifySignatureKey(
      order_id,
      status_code,
      gross_amount,
      signature_key,
    );

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (
      transaction_status === 'settlement' ||
      transaction_status === 'capture'
    ) {
      // Update TransaksiPembayaran status
      await prisma.transaksiPembayaran.update({
        where: { pesananId: order_id },
        data: {
          statusPembayaran: 'BERHASIL',
          metodePembayaran: payment_type,
        },
      });

      // Update Pesanan status
      const pesanan = await prisma.pesanan.update({
        where: { id: order_id },
        data: {
          statusPesanan: 'DIPROSES', // Pesanan diproses setelah dibayar
        },
        include: { orderItems: true },
      });

      // Update Stok Produk dan Kosongkan Keranjang
      if (pesanan) {
        for (const item of pesanan.orderItems) {
          await prisma.produkMakanan.update({
            where: { id: item.produkId },
            data: {
              stok: { decrement: item.kuantitas },
            },
          });
        }

        // Kosongkan keranjang user
        const cart = await prisma.cart.findUnique({
          where: { userId: pesanan.userId },
        });

        if (cart) {
          await prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
          });
        }
      }
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny' ||
      transaction_status === 'expire'
    ) {
      // Update TransaksiPembayaran status to GAGAL
      await prisma.transaksiPembayaran.update({
        where: { pesananId: order_id },
        data: {
          statusPembayaran: 'GAGAL',
          metodePembayaran: payment_type,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
