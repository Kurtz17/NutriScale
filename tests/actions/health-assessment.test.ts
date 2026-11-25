import { saveHealthAssessment } from '@/actions/health-assessment';
import prisma from '@/lib/prisma';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// --- DATA MOCK (Module Level) ---
const MOCK_FORM_DATA = {
  gender: 'male',
  category: 'umum',
  age: '25',
  weight: '70',
  height: '175',
  kalori: '2000',
};

// --- GLOBAL MOCKS ---
// Mock fetch global untuk simulasi AI Engine
global.fetch = vi.fn();

describe('Server Action: saveHealthAssessment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return error if userId is missing', async () => {
    const result = await saveHealthAssessment(MOCK_FORM_DATA as never, '');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Unauthorized');
  });

  it('should create a new health profile if none exists', async () => {
    vi.mocked(prisma.profilKesehatan.findFirst).mockResolvedValue(null);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            riwayat_analisis: {
              haz: 0,
              whz: 0,
              bmi: 22,
              statusNutrisi: 'Normal',
              narasiAI: 'Good',
            },
            meal_plan: { detailRencanaMakan: {} },
          },
        }),
    } as never);

    const result = await saveHealthAssessment(
      MOCK_FORM_DATA as never,
      'user_123',
    );

    expect(result.success).toBe(true);
    expect(prisma.profilKesehatan.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user_123',
          beratBadan: 70,
        }),
      }),
    );
  });

  it('should save allergies and restrictions and send them to the AI engine', async () => {
    vi.stubEnv('AI_ENGINE_URL', 'http://ai-engine.test');
    vi.mocked(prisma.profilKesehatan.findFirst).mockResolvedValue(null);
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 503 } as never);

    const result = await saveHealthAssessment(
      {
        ...MOCK_FORM_DATA,
        allergies: ' Udang,  Susu ',
        dietaryRestrictions: 'Pedas',
      } as never,
      'user_123',
    );

    expect(result.success).toBe(true);
    expect(prisma.profilKesehatan.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          alergi: 'Udang, Susu',
          pantangan: 'Pedas',
        }),
      }),
    );
    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string);
    expect(body.alergi).toBe('Udang, Susu');
    expect(body.pantanganMedis).toBe('Pedas');
    vi.unstubAllEnvs();
  });

  it('should send the stored parser result and save the new one from the AI engine', async () => {
    vi.stubEnv('AI_ENGINE_URL', 'http://ai-engine.test');
    const lama = {
      versi: 'parser-llm-v1',
      entri: { 'alergi ayam': { kata_kunci_en: ['chicken'] } },
    };
    const baru = {
      versi: 'parser-llm-v1',
      entri: { 'alergi udang': { grup: ['udang'] } },
    };
    vi.mocked(prisma.profilKesehatan.findFirst).mockResolvedValue({
      id: 'prof_123',
      parserAlergi: lama,
    } as never);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            meal_plan: { detailRencanaMakan: {} },
            _meta: { parser_alergi: { hasil_untuk_disimpan: baru } },
          },
        }),
    } as never);

    const result = await saveHealthAssessment(
      { ...MOCK_FORM_DATA, allergies: 'alergi udang' } as never,
      'user_123',
    );

    expect(result.success).toBe(true);
    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string);
    expect(body.parserAlergiTersimpan).toEqual(lama);
    expect(prisma.profilKesehatan.update).toHaveBeenCalledWith({
      where: { id: 'prof_123' },
      data: { parserAlergi: baru },
    });
    vi.unstubAllEnvs();
  });

  it('should send null as stored parser result for a new profile', async () => {
    vi.stubEnv('AI_ENGINE_URL', 'http://ai-engine.test');
    vi.mocked(prisma.profilKesehatan.findFirst).mockResolvedValue(null);
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 503 } as never);

    await saveHealthAssessment(MOCK_FORM_DATA as never, 'user_123');

    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string);
    expect(body.parserAlergiTersimpan).toBeNull();
    vi.unstubAllEnvs();
  });

  it('should store null when allergies and restrictions are empty', async () => {
    vi.mocked(prisma.profilKesehatan.findFirst).mockResolvedValue({
      id: 'prof_123',
    } as never);
    vi.mocked(fetch).mockRejectedValue(new Error('AI down'));

    await saveHealthAssessment(
      { ...MOCK_FORM_DATA, allergies: '  ', dietaryRestrictions: '' } as never,
      'user_123',
    );

    expect(prisma.profilKesehatan.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ alergi: null, pantangan: null }),
      }),
    );
  });

  it('should update existing profile and save anjuranKaloriDokter even if AI is offline', async () => {
    vi.mocked(prisma.profilKesehatan.findFirst).mockResolvedValue({
      id: 'prof_123',
    } as never);
    vi.mocked(fetch).mockRejectedValue(new Error('Network error AI down')); // Simulasi AI Engine offline total

    const result = await saveHealthAssessment(
      MOCK_FORM_DATA as never,
      'user_123',
    );

    expect(result.success).toBe(true);
    expect(prisma.profilKesehatan.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          anjuranKaloriDokter: 2000,
        }),
      }),
    );

    // Pastikan RiwayatAnalisis dan MealPlan lokal tetap dibuat dengan target 2000 kkal dari nutri-calc
    expect(prisma.riwayatAnalisis.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          profilId: 'prof_123',
          statusNutrisi: expect.any(String),
          kalori: 2000,
          karbohidrat: expect.any(Number),
          protein: expect.any(Number),
          lemak: expect.any(Number),
        }),
      }),
    );
    expect(prisma.mealPlan.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          detailRencanaMakan: expect.objectContaining({
            target_kalori_harian: 2000,
            distribusi: expect.objectContaining({
              carbs_g: expect.any(Number),
              protein_g: expect.any(Number),
              fat_g: expect.any(Number),
            }),
          }),
        }),
      }),
    );
  });
});
