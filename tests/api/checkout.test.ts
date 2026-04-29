import { POST } from '@/app/api/checkout/route';
import { auth } from '@/lib/auth';
import { createMidtransTransaction } from '@/lib/midtrans';
import prisma from '@/lib/prisma';
import { describe, expect, it, vi } from 'vitest';

// Mock Auth
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

// Mock Midtrans Library
vi.mock('@/lib/midtrans', () => ({
  createMidtransTransaction: vi.fn(),
}));

const MOCK_SESSION = {
  user: { id: 'user_123' },
};

describe('API Checkout', () => {
  it('should return 401 if user is not logged in', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ cartItems: [] }),
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('should return 400 if cart is empty', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(MOCK_SESSION as never);

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ cartItems: [] }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Cart is empty');
  });

  it('should return 400 if stock is insufficient', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(MOCK_SESSION as never);

    // Mock produk dengan stok tipis
    vi.mocked(prisma.produkMakanan.findUnique).mockResolvedValue({
      id: 'p1',
      namaProduk: 'Ayam Goreng',
      harga: 20000,
      stok: 2, // Stok cuma 2
    } as never);

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        cartItems: [{ id: 'p1', quantity: 5 }], // Beli 5
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Stok tidak mencukupi');
  });

  it('should create order and return Snap Token on success', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(MOCK_SESSION as never);

    // 1. Mock Database Checks
    vi.mocked(prisma.produkMakanan.findUnique).mockResolvedValue({
      id: 'p1',
      namaProduk: 'Ayam Goreng',
      harga: 20000,
      stok: 10,
    } as never);

    // 2. Mock Order Creation
    const mockPesanan = { id: 'order_abc', totalHarga: 35000 }; // 20rb + 15rb ongkir
    vi.mocked(prisma.pesanan.create).mockResolvedValue(mockPesanan as never);
    vi.mocked(prisma.transaksiPembayaran.create).mockResolvedValue({} as never);

    // 3. Mock Midtrans Call
    vi.mocked(createMidtransTransaction).mockResolvedValue({
      token: 'SNAP-TOKEN-123',
    } as never);

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        cartItems: [{ id: 'p1', quantity: 1 }],
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.snapToken).toBe('SNAP-TOKEN-123');

    // Verifikasi total harga (Produk 20.000 + Ongkir 15.000 = 35.000)
    expect(prisma.pesanan.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          totalHarga: 35000,
        }),
      }),
    );
  });
});
