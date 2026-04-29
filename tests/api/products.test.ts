import { GET } from '@/app/api/products/route';
import prisma from '@/lib/prisma';
import { describe, expect, it, vi } from 'vitest';

const MOCK_DB_PRODUCTS = [
  {
    id: 'p1',
    namaProduk: 'Ayam Bakar Madu',
    kategori: 'Protein',
    gambar: 'ayam-bakar.jpg',
    harga: 25000,
    stok: 50,
    nilaiGizi: {
      calories: 350,
      protein: 25,
      healthSafe: true,
      aiRecommended: true,
      tags: ['High Protein', 'Low Fat'],
    },
  },
  {
    id: 'p2',
    namaProduk: 'Nasi Putih',
    kategori: 'Carbs',
    gambar: 'nasi.jpg',
    harga: 5000,
    stok: 100,
    nilaiGizi: null,
  },
];

describe('GET /api/products', () => {
  it('should return products with correct mapping and nutrient calculation', async () => {
    vi.mocked(prisma.produkMakanan.findMany).mockResolvedValue(
      MOCK_DB_PRODUCTS as never,
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);

    expect(data[0]).toMatchObject({
      id: 'p1',
      name: 'Ayam Bakar Madu',
      price: 25000,
    });

    expect(data[1].calories).toBe(0);
  });

  it('should return empty array if no products found', async () => {
    vi.mocked(prisma.produkMakanan.findMany).mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('should return 500 status when database throws an error', async () => {
    vi.mocked(prisma.produkMakanan.findMany).mockRejectedValue(
      new Error('Database Connection Failed'),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch products');
  });
});
