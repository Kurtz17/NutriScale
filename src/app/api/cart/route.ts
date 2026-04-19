import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { produk: true },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ cart: [] });
    }

    type CartItemWithProduk = {
      produk: {
        id: string;
        namaProduk: string | null;
        kategori: string | null;
        gambar: string | null;
        harga: unknown;
        nilaiGizi: unknown;
      };
      kuantitas: number;
    };

    const mappedCart = cart.items.map((item: CartItemWithProduk) => {
      const p = item.produk;
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
        quantity: item.kuantitas,
      };
    });

    return NextResponse.json({ cart: mappedCart });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity, setExact } = await req.json();

    if (!productId || typeof quantity !== 'number') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          id: `cart_${session.user.id}`,
          userId: session.user.id,
        },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, produkId: productId },
    });

    if (existingItem) {
      const newQuantity = setExact
        ? quantity
        : existingItem.kuantitas + quantity;
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { kuantitas: Math.max(1, newQuantity) },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          id: `ci_${Date.now()}_${productId}`,
          cartId: cart.id,
          produkId: productId,
          kuantitas: quantity,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await req.json();

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return NextResponse.json({ success: true });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, produkId: productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 },
    );
  }
}
