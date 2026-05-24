import { GET } from '@/app/api/admin/dashboard/route';
import prisma from '@/lib/prisma';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('API Admin Dashboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-10T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return dashboard summary and requested chart range', async () => {
    vi.mocked(prisma.user.count).mockResolvedValue(8);
    vi.mocked(prisma.pesanan.count)
      .mockResolvedValueOnce(12)
      .mockResolvedValueOnce(3);
    vi.mocked(prisma.pesanan.aggregate).mockResolvedValue({
      _sum: { totalHarga: 250000 },
    } as never);
    vi.mocked(prisma.pesanan.findMany).mockResolvedValue([
      {
        totalHarga: 100000,
        createdAt: new Date('2026-05-10T05:00:00.000Z'),
        statusPesanan: 'SELESAI',
      },
    ] as never);

    const response = await GET(
      new Request('http://localhost/api/admin/dashboard?range=30d'),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toMatchObject({
      totalUser: 8,
      totalOrder: 12,
      activeOrders: 3,
      totalRevenue: 250000,
    });
    expect(data.data.weeklySummary).toHaveLength(30);
    expect(data.data.weeklySummary.at(-1)).toMatchObject({
      revenue: 100000,
      orders: 1,
    });
  });

  it('should return 500 when database query fails', async () => {
    vi.mocked(prisma.user.count).mockRejectedValue(new Error('db down'));

    const response = await GET(
      new Request('http://localhost/api/admin/dashboard'),
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch dashboard statistics');
  });
});
