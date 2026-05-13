import { formatAddress } from '@/lib/address-utils';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const ORDER_STATUSES = [
  'TERTUNDA',
  'DIPROSES',
  'DIKIRIM',
  'SELESAI',
  'DIBATALKAN',
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

type ShippingAddress = {
  name?: string;
  phone?: string;
  address?: string;
};

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

function isOrderStatus(value: unknown): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}

function parseShippingAddress(payload: string | null): ShippingAddress | null {
  if (!payload) return null;
  try {
    const parsed = JSON.parse(payload) as ShippingAddress;
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function resolveAddress(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;

  try {
    const formatted = formatAddress(
      value as Parameters<typeof formatAddress>[0],
    );
    return formatted || null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.pesanan.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        orderItems: {
          include: {
            produk: true,
          },
        },
        transaksiPembayaran: true,
      },
    });

    const mappedOrders = orders.map((order) => {
      const shippingAddress = parseShippingAddress(order.alamatKirim);
      const fallbackAddress = resolveAddress(order.user.address);

      return {
        id: order.id,
        createdAt: order.createdAt.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        rawDate: order.createdAt.toISOString(),
        totalPrice: Number(order.totalHarga),
        status: order.statusPesanan,
        paymentStatus:
          order.transaksiPembayaran?.statusPembayaran || 'TERTUNDA',
        customer: {
          name: shippingAddress?.name || order.user.name,
          email: order.user.email,
          phone: shippingAddress?.phone || order.user.phone || null,
          address: shippingAddress?.address || fallbackAddress,
        },
        items: order.orderItems.map((item) => ({
          name: item.produk.namaProduk || 'Unknown Product',
          price: Number(item.harga),
          qty: item.kuantitas,
        })),
        note: null,
      };
    });

    return NextResponse.json({ orders: mappedOrders });
  } catch (error) {
    console.error('Fetch admin orders error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, status } = body || {};

    if (typeof orderId !== 'string' || !isOrderStatus(status)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const existingOrder = await prisma.pesanan.findUnique({
      where: { id: orderId },
      select: { id: true, statusPesanan: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (
      existingOrder.statusPesanan === 'SELESAI' ||
      existingOrder.statusPesanan === 'DIBATALKAN'
    ) {
      return NextResponse.json(
        { error: 'Cannot change status of a completed or cancelled order' },
        { status: 400 },
      );
    }

    await prisma.pesanan.update({
      where: { id: orderId },
      data: { statusPesanan: status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
