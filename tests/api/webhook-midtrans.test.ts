import { POST } from '@/app/api/webhooks/midtrans/route';
import { verifySignatureKey } from '@/lib/midtrans';
import prisma from '@/lib/prisma';
import { describe, expect, it, vi } from 'vitest';

// Mock Midtrans Utility
vi.mock('@/lib/midtrans', () => ({
  verifySignatureKey: vi.fn(),
}));

describe('API Midtrans Webhook', () => {
  const mockPayload = {
    order_id: 'order_123',
    status_code: '200',
    gross_amount: '35000.00',
    signature_key: 'fake_signature',
    transaction_status: 'settlement',
    payment_type: 'bank_transfer',
  };

  it('should return 400 if signature is invalid', async () => {
    vi.mocked(verifySignatureKey).mockResolvedValue(false);

    const req = new Request('http://localhost/api/webhooks/midtrans', {
      method: 'POST',
      body: JSON.stringify(mockPayload),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Invalid signature');
  });

  it('should update order status, decrement stock, and clear cart on success (settlement)', async () => {
    vi.mocked(verifySignatureKey).mockResolvedValue(true);

    // Mock Pesanan Data yang dibayar
    const mockPesanan = {
      id: 'order_123',
      userId: 'user_abc',
      orderItems: [{ produkId: 'p1', kuantitas: 2 }],
    };

    vi.mocked(prisma.pesanan.update).mockResolvedValue(mockPesanan as never);
    vi.mocked(prisma.cart.findUnique).mockResolvedValue({
      id: 'cart_abc',
    } as never);

    const req = new Request('http://localhost/api/webhooks/midtrans', {
      method: 'POST',
      body: JSON.stringify(mockPayload),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    // Verifikasi Update Status
    expect(prisma.transaksiPembayaran.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { pesananId: 'order_123' },
        data: expect.objectContaining({ statusPembayaran: 'BERHASIL' }),
      }),
    );

    expect(prisma.pesanan.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'order_123' },
        data: { statusPesanan: 'DIPROSES' },
      }),
    );

    // Verifikasi Pengurangan Stok
    expect(prisma.produkMakanan.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'p1' },
        data: { stok: { decrement: 2 } },
      }),
    );

    // Verifikasi Pengosongan Keranjang
    expect(prisma.cartItem.deleteMany).toHaveBeenCalled();
  });

  it('should update status to GAGAL if transaction is cancelled/expired', async () => {
    vi.mocked(verifySignatureKey).mockResolvedValue(true);

    const failPayload = { ...mockPayload, transaction_status: 'expire' };

    const req = new Request('http://localhost/api/webhooks/midtrans', {
      method: 'POST',
      body: JSON.stringify(failPayload),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    expect(prisma.transaksiPembayaran.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ statusPembayaran: 'GAGAL' }),
      }),
    );
  });
});
