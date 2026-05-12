import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const totalUser = await prisma.user.count({
      where: {
        role: {
          not: 'admin',
        },
      },
    });

    const totalOrder = await prisma.pesanan.count();

    const revenueResult = await prisma.pesanan.aggregate({
      _sum: {
        totalHarga: true,
      },
      where: {
        statusPesanan: 'SELESAI',
      },
    });
    const totalRevenue = Number(revenueResult._sum.totalHarga || 0);

    // Get orders from the last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentOrders = await prisma.pesanan.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        totalHarga: true,
        createdAt: true,
        statusPesanan: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Grouping recent orders by day
    const dailyStats: Record<string, { revenue: number; orders: number }> = {};

    // Initialize the last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateString = date.toISOString().split('T')[0];
      dailyStats[dateString] = { revenue: 0, orders: 0 };
    }

    recentOrders.forEach((order) => {
      const dateString = order.createdAt.toISOString().split('T')[0];
      if (dailyStats[dateString]) {
        dailyStats[dateString].orders += 1;
        if (order.statusPesanan === 'SELESAI') {
          dailyStats[dateString].revenue += Number(order.totalHarga);
        }
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
