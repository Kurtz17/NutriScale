import { saveHealthAssessment } from '@/app/health-assessment/actions';
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

  it('should update existing profile if it already exists', async () => {
    vi.mocked(prisma.profilKesehatan.findFirst).mockResolvedValue({
      id: 'prof_123',
    } as never);
    vi.mocked(fetch).mockResolvedValue({ ok: false } as never); // Simulasi AI Engine down

    const result = await saveHealthAssessment(
      MOCK_FORM_DATA as never,
      'user_123',
    );

    expect(result.success).toBe(true);
    expect(prisma.profilKesehatan.update).toHaveBeenCalled();
  });
});
