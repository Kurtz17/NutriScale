import { GET, PATCH } from '@/app/api/admin/orders/route';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

const SESSION = { user: { id: 'admin-1', role: 'admin' } };

describe('API Admin Orders', () => {
  beforeEach(() => {
    vi.mocked(auth.api.getSession).mockResolvedValue(SESSION as never);
  });

  it('should reject requests without a session', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
  });

  it('should map order, customer, payment, and item data for admin table', async () => {
    vi.mocked(prisma.pesanan.findMany).mockResolvedValue([
      {
        id: 'ORD-001',
        createdAt: new Date('2026-05-01T00:00:00.000Z'),
        totalHarga: 125000,
        statusPesanan: 'DIPROSES',
        alamatKirim: JSON.stringify({
          name: 'Nadia',
          phone: '0812',
          address: 'Jl. Mawar',
        }),
        user: {
          name: 'Fallback Name',
          email: 'nadia@test.local',
          phone: null,
          address: null,
        },
        orderItems: [
          {
            harga: 50000,
            kuantitas: 2,
            produk: { namaProduk: 'Oatmeal' },
          },
        ],
        transaksiPembayaran: { statusPembayaran: 'BERHASIL' },
      },
    ] as never);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.orders[0]).toMatchObject({
      id: 'ORD-001',
      totalPrice: 125000,
      status: 'DIPROSES',
      paymentStatus: 'BERHASIL',
      customer: {
        name: 'Nadia',
        email: 'nadia@test.local',
        phone: '0812',
        address: 'Jl. Mawar',
      },
      items: [{ name: 'Oatmeal', price: 50000, qty: 2 }],
    });
  });

  it('should validate PATCH payload status', async () => {
    const response = await PATCH(
      new Request('http://localhost/api/admin/orders', {
        method: 'PATCH',
        body: JSON.stringify({ orderId: 'ORD-001', status: 'UNKNOWN' }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it('should update pending order status', async () => {
    vi.mocked(prisma.pesanan.findUnique).mockResolvedValue({
      id: 'ORD-001',
      statusPesanan: 'TERTUNDA',
    } as never);
    vi.mocked(prisma.pesanan.update).mockResolvedValue({} as never);

    const response = await PATCH(
      new Request('http://localhost/api/admin/orders', {
        method: 'PATCH',
        body: JSON.stringify({ orderId: 'ORD-001', status: 'DIPROSES' }),
      }),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(prisma.pesanan.update).toHaveBeenCalledWith({
      where: { id: 'ORD-001' },
      data: { statusPesanan: 'DIPROSES' },
    });
  });

  it('should reject changes for completed orders', async () => {
    vi.mocked(prisma.pesanan.findUnique).mockResolvedValue({
      id: 'ORD-001',
      statusPesanan: 'SELESAI',
    } as never);

    const response = await PATCH(
      new Request('http://localhost/api/admin/orders', {
        method: 'PATCH',
        body: JSON.stringify({ orderId: 'ORD-001', status: 'DIPROSES' }),
      }),
    );

    expect(response.status).toBe(400);
    expect(prisma.pesanan.update).not.toHaveBeenCalled();
  });
});
