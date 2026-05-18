import { auth } from '@/lib/auth';
import { cancelMidtransTransaction } from '@/lib/midtrans';
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
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 },
      );
    }

    const pesanan = await prisma.pesanan.findUnique({
      where: { id: orderId, userId: session.user.id },
    });

    if (!pesanan) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (pesanan.statusPesanan !== 'TERTUNDA') {
      return NextResponse.json(
        { error: 'Only pending orders can be cancelled' },
        { status: 400 },
      );
    }

    // Check if within 15 minutes
    const now = new Date();
    const createdAt = new Date(pesanan.createdAt);
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMinutes = diffMs / (1000 * 60);

    if (diffMinutes > 15) {
      return NextResponse.json(
        { error: 'Order can only be cancelled within 15 minutes' },
        { status: 400 },
      );
    }

    await prisma.pesanan.update({
      where: { id: orderId },
      data: { statusPesanan: 'DIBATALKAN' },
    });

    await prisma.transaksiPembayaran.updateMany({
      where: { pesananId: orderId },
      data: { statusPembayaran: 'DIBATALKAN' },
    });

    try {
      await cancelMidtransTransaction(orderId);
    } catch (err) {
      console.error(
        'Peringatan: Gagal membatalkan di Midtrans. Mungkin transaksi belum dibuat di sisi Midtrans (user belum memilih metode pembayaran), sudah kedaluwarsa, atau sudah dibayar.',
        err,
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel order error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
