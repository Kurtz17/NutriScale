import { DELETE, PATCH } from '@/app/api/admin/products/[id]/route';
import { POST } from '@/app/api/admin/products/route';
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

const ADMIN_SESSION = {
  user: { id: 'admin-1', role: 'admin' },
};

const productPayload = {
  namaProduk: 'Oatmeal Pisang',
  kategori: 'Sarapan',
  harga: '25000',
  stok: '5',
  labelRisiko: 'LOW',
  gambar: 'OAT',
  nilaiGizi: {
    calories: '320',
    protein: '12',
    fat: '4',
    carbs: '50',
    sugars: '8',
    sodium: '120',
    cholesterol: '0',
    tags: ['Low Sugar'],
    healthSafe: true,
    aiRecommended: false,
  },
};

describe('API Admin Products', () => {
  beforeEach(() => {
    vi.mocked(auth.api.getSession).mockResolvedValue(ADMIN_SESSION as never);
  });

  it('should reject non-admin product creation', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const response = await POST(
      new Request('http://localhost/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(productPayload),
      }),
    );

    expect(response.status).toBe(401);
  });

  it('should validate required product fields', async () => {
    const response = await POST(
      new Request('http://localhost/api/admin/products', {
        method: 'POST',
        body: JSON.stringify({ namaProduk: '', harga: '' }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it('should create product with normalized numeric nutrition values', async () => {
    vi.mocked(prisma.produkMakanan.create).mockResolvedValue({
      id: 'prod-1',
      ...productPayload,
    } as never);

    const response = await POST(
      new Request('http://localhost/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(productPayload),
      }),
    );

    expect(response.status).toBe(200);
    expect(prisma.produkMakanan.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        namaProduk: 'Oatmeal Pisang',
        harga: 25000,
        stok: 5,
        nilaiGizi: expect.objectContaining({
          calories: 320,
          protein: 12,
          tags: ['Low Sugar'],
          healthSafe: true,
          aiRecommended: false,
        }),
      }),
    });
  });

  it('should update a product by id', async () => {
    vi.mocked(prisma.produkMakanan.update).mockResolvedValue({
      id: 'prod-1',
      namaProduk: 'Updated',
    } as never);

    const response = await PATCH(
      new Request('http://localhost/api/admin/products/prod-1', {
        method: 'PATCH',
        body: JSON.stringify({ ...productPayload, namaProduk: 'Updated' }),
      }),
      { params: Promise.resolve({ id: 'prod-1' }) },
    );

    expect(response.status).toBe(200);
    expect(prisma.produkMakanan.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'prod-1' },
        data: expect.objectContaining({ namaProduk: 'Updated', harga: 25000 }),
      }),
    );
  });

  it('should delete a product by id', async () => {
    vi.mocked(prisma.produkMakanan.delete).mockResolvedValue({} as never);

    const response = await DELETE(
      new Request('http://localhost/api/admin/products/prod-1', {
        method: 'DELETE',
      }),
      { params: Promise.resolve({ id: 'prod-1' }) },
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Product deleted');
    expect(prisma.produkMakanan.delete).toHaveBeenCalledWith({
      where: { id: 'prod-1' },
    });
  });
});
