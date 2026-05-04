import { DELETE, GET, POST } from '@/app/api/cart/route';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

const MOCK_USER_ID = 'user_123';
const MOCK_SESSION = {
  user: { id: MOCK_USER_ID, name: 'Kurtz' },
};

const MOCK_CART_WITH_ITEMS = {
  id: 'cart_123',
  userId: MOCK_USER_ID,
  items: [
    {
      kuantitas: 2,
      produk: {
        id: 'p1',
        namaProduk: 'Ayam Bakar',
        harga: 20000,
        nilaiGizi: { calories: 300, healthSafe: true },
      },
    },
  ],
};

describe('API Cart', () => {
  describe('GET /api/cart', () => {
    it('should return 401 if user is not logged in', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const response = await GET();
      expect(response.status).toBe(401);
    });

    it('should return empty cart if no cart exists in database', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(MOCK_SESSION as never);
      vi.mocked(prisma.cart.findUnique).mockResolvedValue(null);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.cart).toEqual([]);
    });

    it('should return mapped cart items correctly', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(MOCK_SESSION as never);
      vi.mocked(prisma.cart.findUnique).mockResolvedValue(
        MOCK_CART_WITH_ITEMS as never,
      );

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.cart[0].name).toBe('Ayam Bakar');
      expect(data.cart[0].quantity).toBe(2);
    });
  });

  describe('POST /api/cart', () => {
    it('should create new cart and item if none exists', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(MOCK_SESSION as never);
      vi.mocked(prisma.cart.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.cart.create).mockResolvedValue({
        id: 'new_cart',
      } as never);
      vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(null);

      const req = new Request('http://localhost/api/cart', {
        method: 'POST',
        body: JSON.stringify({ productId: 'p1', quantity: 1 }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.cart.create).toHaveBeenCalled();
    });

    it('should update quantity if product already exists in cart', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(MOCK_SESSION as never);
      vi.mocked(prisma.cart.findUnique).mockResolvedValue({
        id: 'cart_123',
      } as never);
      vi.mocked(prisma.cartItem.findFirst).mockResolvedValue({
        id: 'ci_1',
        kuantitas: 5,
      } as never);

      const req = new Request('http://localhost/api/cart', {
        method: 'POST',
        body: JSON.stringify({ productId: 'p1', quantity: 3 }),
      });

      await POST(req);
      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'ci_1' },
        data: { kuantitas: 8 },
      });
    });

    it('should return 400 if input is invalid', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(MOCK_SESSION as never);

      const req = new Request('http://localhost/api/cart', {
        method: 'POST',
        body: JSON.stringify({ productId: '', quantity: 'not-a-number' }),
      });

      const response = await POST(req);
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/cart', () => {
    it('should delete product from cart', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(MOCK_SESSION as never);
      vi.mocked(prisma.cart.findUnique).mockResolvedValue({
        id: 'cart_123',
      } as never);

      const req = new Request('http://localhost/api/cart', {
        method: 'DELETE',
        body: JSON.stringify({ productId: 'p1' }),
      });

      const response = await DELETE(req);
      expect(response.status).toBe(200);
      expect(prisma.cartItem.deleteMany).toHaveBeenCalled();
    });
  });
});
