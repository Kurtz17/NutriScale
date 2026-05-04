import { auth } from '@/lib/auth';
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

    // Check if within 1 hour
    const now = new Date();
    const createdAt = new Date(pesanan.createdAt);
    const diffMs = now.getTime() - createdAt.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours > 1) {
      return NextResponse.json(
        { error: 'Order can only be cancelled within 1 hour' },
        { status: 400 },
      );
    }

    await prisma.pesanan.update({
      where: { id: orderId },
      data: { statusPesanan: 'DIBATALKAN' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel order error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
