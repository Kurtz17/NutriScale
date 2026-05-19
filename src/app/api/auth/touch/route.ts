import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Skip update for admins
    if (session.user.role === 'admin') {
      return NextResponse.json({ success: true, message: 'Skipped for admin' });
    }

    // Update lastOnline
    await prisma.user.update({
      where: { id: session.user.id },
      data: { lastOnline: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating lastOnline:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
