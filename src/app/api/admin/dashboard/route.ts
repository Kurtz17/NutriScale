import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '7d';

    let daysToFetch = 7;
    if (range === '30d') daysToFetch = 30;
    if (range === '90d') daysToFetch = 90;

    const totalUser = await prisma.user.count({
      where: { role: { not: 'admin' } },
    });

    const totalOrder = await prisma.pesanan.count();

    const activeOrders = await prisma.pesanan.count({
      where: {
        statusPesanan: { in: ['DIPROSES', 'DIKIRIM'] },
      },
    });

    const revenueResult = await prisma.pesanan.aggregate({
      _sum: { totalHarga: true },
      where: {
        statusPesanan: { in: ['DIPROSES', 'DIKIRIM', 'SELESAI'] },
      },
    });
    const totalRevenue = Number(revenueResult._sum.totalHarga || 0);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (daysToFetch - 1));

    const recentOrders = await prisma.pesanan.findMany({
      where: {
        createdAt: { gte: startDate },
        statusPesanan: { not: 'DIBATALKAN' },
      },
      select: {
        totalHarga: true,
        createdAt: true,
        statusPesanan: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const dailyStats: Record<string, { revenue: number; orders: number }> = {};

    // Initialize the requested range
    for (let i = 0; i < daysToFetch; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toLocaleDateString('en-CA');
      dailyStats[dateString] = { revenue: 0, orders: 0 };
    }

    recentOrders.forEach((order) => {
      const dateString = new Date(order.createdAt).toLocaleDateString('en-CA');
      if (dailyStats[dateString]) {
        dailyStats[dateString].orders += 1;
        dailyStats[dateString].revenue += Number(order.totalHarga);
      }
    });

    const weeklySummary = Object.entries(dailyStats).map(([date, stats]) => ({
      date,
      revenue: stats.revenue,
      orders: stats.orders,
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalUser,
        totalOrder,
        activeOrders,
        totalRevenue,
        weeklySummary,
      },
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 },
    );
  }
}
