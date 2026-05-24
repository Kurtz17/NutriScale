import { POST } from '@/app/api/orders/cancel/route';
import { auth } from '@/lib/auth';
import { cancelMidtransTransaction } from '@/lib/midtrans';
import prisma from '@/lib/prisma';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('@/lib/midtrans', () => ({
  cancelMidtransTransaction: vi.fn(),
}));

const SESSION = { user: { id: 'user-1', role: 'user' } };

describe('API Orders Cancel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-10T12:00:00.000Z'));
    vi.mocked(auth.api.getSession).mockResolvedValue(SESSION as never);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should reject unauthenticated users', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const response = await POST(
      new Request('http://localhost/api/orders/cancel', {
        method: 'POST',
        body: JSON.stringify({ orderId: 'ORD-001' }),
      }),
    );

    expect(response.status).toBe(401);
  });

  it('should require orderId', async () => {
    const response = await POST(
      new Request('http://localhost/api/orders/cancel', {
        method: 'POST',
        body: JSON.stringify({}),
      }),
    );

    expect(response.status).toBe(400);
  });

  it('should reject non-pending orders', async () => {
    vi.mocked(prisma.pesanan.findUnique).mockResolvedValue({
      id: 'ORD-001',
      statusPesanan: 'DIPROSES',
      createdAt: new Date('2026-05-10T11:55:00.000Z'),
    } as never);

    const response = await POST(
      new Request('http://localhost/api/orders/cancel', {
        method: 'POST',
        body: JSON.stringify({ orderId: 'ORD-001' }),
      }),
    );

    expect(response.status).toBe(400);
    expect(prisma.pesanan.update).not.toHaveBeenCalled();
  });

  it('should reject pending orders after the cancellation window', async () => {
    vi.mocked(prisma.pesanan.findUnique).mockResolvedValue({
      id: 'ORD-001',
      statusPesanan: 'TERTUNDA',
      createdAt: new Date('2026-05-10T11:30:00.000Z'),
    } as never);

    const response = await POST(
      new Request('http://localhost/api/orders/cancel', {
        method: 'POST',
        body: JSON.stringify({ orderId: 'ORD-001' }),
      }),
    );

    expect(response.status).toBe(400);
    expect(prisma.pesanan.update).not.toHaveBeenCalled();
  });

  it('should cancel pending order and payment inside the cancellation window', async () => {
    vi.mocked(prisma.pesanan.findUnique).mockResolvedValue({
      id: 'ORD-001',
      statusPesanan: 'TERTUNDA',
      createdAt: new Date('2026-05-10T11:55:00.000Z'),
    } as never);
    vi.mocked(prisma.pesanan.update).mockResolvedValue({} as never);
    vi.mocked(prisma.transaksiPembayaran.updateMany).mockResolvedValue(
      {} as never,
    );
    vi.mocked(cancelMidtransTransaction).mockResolvedValue(undefined);

    const response = await POST(
      new Request('http://localhost/api/orders/cancel', {
        method: 'POST',
        body: JSON.stringify({ orderId: 'ORD-001' }),
      }),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(prisma.pesanan.update).toHaveBeenCalledWith({
      where: { id: 'ORD-001' },
      data: { statusPesanan: 'DIBATALKAN' },
    });
    expect(prisma.transaksiPembayaran.updateMany).toHaveBeenCalledWith({
      where: { pesananId: 'ORD-001' },
      data: { statusPembayaran: 'DIBATALKAN' },
    });
    expect(cancelMidtransTransaction).toHaveBeenCalledWith('ORD-001');
  });
});
