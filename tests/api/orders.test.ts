import { GET } from '@/app/api/orders/route';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { describe, expect, it, vi } from 'vitest';

// --- SPECIFIC MOCK ---
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

// --- DATA MOCK (Module Level) ---
const MOCK_SESSION = {
  user: { id: 'user_123' },
};

const MOCK_PESANAN_LIST = [
  {
    id: 'ord_1',
    createdAt: new Date('2024-03-20T10:00:00Z'),
    totalHarga: 50000,
    statusPesanan: 'SELESAI',
    orderItems: [
      {
        kuantitas: 2,
        harga: 25000,
        produk: {
          namaProduk: 'Ayam Bakar Madu',
          nilaiGizi: { calories: 350 },
        },
      },
    ],
  },
  {
    id: 'ord_2',
    createdAt: new Date('2024-03-21T15:30:00Z'),
    totalHarga: 15000,
    statusPesanan: 'TERTUNDA',
    orderItems: [
      {
        kuantitas: 3,
        harga: 5000,
        produk: {
          namaProduk: 'Nasi Putih',
          nilaiGizi: { kalori: 200 },
        },
      },
    ],
  },
];

describe('API Orders', () => {
  it('should return 401 if user is not logged in', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const response = await GET();
    expect(response.status).toBe(401);
  });

  it('should return formatted orders with correct calorie calculation', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(MOCK_SESSION as never);
    vi.mocked(prisma.pesanan.findMany).mockResolvedValue(
      MOCK_PESANAN_LIST as never,
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.orders).toHaveLength(2);

    // Verify Data Isolation: Ensure query is filtered by user ID
    expect(prisma.pesanan.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: MOCK_SESSION.user.id },
      }),
    );

    // Cek Order 1 (Format Tanggal & Kalori)
    expect(data.orders[0]).toMatchObject({
      id: 'ord_1',
      totalPrice: 50000,
      totalCalories: 700, // 350 * 2
      status: 'SELESAI',
    });
    expect(data.orders[0].items).toHaveLength(1);
    expect(data.orders[0].items[0].name).toBe('Ayam Bakar Madu');

    // Cek Order 2 (Handling key "kalori" instead of "calories")
    expect(data.orders[1]).toMatchObject({
      id: 'ord_2',
      totalCalories: 600, // 200 * 3
      status: 'TERTUNDA',
    });
  });

  it('should return empty list if no orders found', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(MOCK_SESSION as never);
    vi.mocked(prisma.pesanan.findMany).mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(data.orders).toEqual([]);
  });

  it('should return 500 if database fetch fails', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(MOCK_SESSION as never);
    vi.mocked(prisma.pesanan.findMany).mockRejectedValue(new Error('DB Error'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal Server Error');
  });
});
