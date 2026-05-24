import { GET } from '@/app/api/health-dashboard/route';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

const SESSION = { user: { id: 'user-1', role: 'user' } };

describe('API Health Dashboard', () => {
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

    const response = await GET();

    expect(response.status).toBe(401);
  });

  it('should return empty defaults when user has no health profile', async () => {
    vi.mocked(prisma.profilKesehatan.findFirst).mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.stats).toHaveLength(4);
    expect(data.meals).toEqual([]);
    expect(data.targetCalories).toBe(0);
  });

  it('should calculate intake and meal recommendations from latest analysis', async () => {
    vi.mocked(prisma.profilKesehatan.findFirst).mockResolvedValue({
      umur: 30,
      anjuranKaloriDokter: 1900,
      riwayatAnalisis: [
        {
          bmi: 22.4,
          haz: 0,
          statusNutrisi: 'Normal',
          mealPlan: {
            detailRencanaMakan: {
              target_kalori_harian: 2000,
              distribusi: { protein_g: 90 },
              narasiAI: 'Pilih protein tanpa lemak.',
              rekomendasi_pagi: [
                {
                  produk_id: 'prod-1',
                  gambar: 'OAT',
                  harga: 25000,
                  recommended_quantity: 1,
                  nama_makanan: 'Oatmeal',
                  calories: 320,
                  protein: 12,
                  match_score: 95,
                },
              ],
            },
          },
        },
      ],
    } as never);
    vi.mocked(prisma.pesanan.findMany).mockResolvedValue([
      {
        orderItems: [
          {
            kuantitas: 2,
            produk: {
              id: 'prod-x',
              nilaiGizi: { calories: 250, protein: 20 },
            },
          },
        ],
      },
    ] as never);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.narasiAI).toBe('Pilih protein tanpa lemak.');
    expect(data.stats[0]).toMatchObject({
      title: 'Body Mass Index (BMI)',
      value: '22.4',
      status: 'Normal',
    });
    expect(data.stats[1]).toMatchObject({
      title: 'Daily Calories',
      value: '500 / 2000',
      progress: 25,
    });
    expect(data.stats[2]).toMatchObject({
      title: 'Protein Intake',
      value: '40g / 90g',
    });
    expect(data.meals[0]).toMatchObject({
      type: 'Breakfast',
      totalCalories: 320,
      totalProtein: 12,
    });
  });
});
