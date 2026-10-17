import {
  assessNutritionalStatus,
  computeTargetNutrition,
  resolveActivityLevel,
} from '@/lib/nutrition/compute-target';
import { describe, expect, it } from 'vitest';

describe('computeTargetNutrition Service', () => {
  it('prioritizes doctor prescription (anjuranKaloriDokter) when provided', () => {
    const result = computeTargetNutrition({
      sex: 'male',
      ageYears: 30,
      weightKg: 75,
      heightCm: 175,
      anjuranKaloriDokter: 1800,
    });

    expect(result.isDoctorPrescription).toBe(true);
    expect(result.calories).toBe(1800);
    expect(result.status).toBe('estimated');
    expect(result.method).toBe('Anjuran Kalori Dokter');
    // adult19Plus default macros: carbs 50%, protein 20%, fat 30%
    expect(result.carbohydrates.percent).toBe(50);
    expect(result.carbohydrates.grams).toBe(225);
    expect(result.protein.percent).toBe(20);
    expect(result.protein.grams).toBe(90);
    expect(result.fat.percent).toBe(30);
    expect(result.fat.grams).toBe(60);
  });

  it('computes adult healthy calories using Harris-Benedict', () => {
    const result = computeTargetNutrition({
      sex: 'male',
      ageYears: 30,
      weightKg: 70,
      heightCm: 175,
      activityFactor: 1.55,
    });

    expect(result.status).toBe('estimated');
    expect(result.isDoctorPrescription).toBe(false);
    expect(result.calories).toBe(2628);
    expect(result.method).toContain('Harris-Benedict');
    expect(result.carbohydrates.grams).toBeGreaterThan(0);
    expect(result.protein.grams).toBeGreaterThan(0);
    expect(result.fat.grams).toBeGreaterThan(0);
    expect(result.statusNutrisi).toBe('Normal');
  });

  it('handles child under 3 years', () => {
    const result = computeTargetNutrition({
      sex: 'female',
      ageMonths: 18,
      weightKg: 11,
      heightCm: 82,
      category: 'balita',
    });

    expect(result.status).toBe('estimated');
    expect(result.method).toContain('DRI 2023 EER usia 0–<3 tahun');
    expect(result.calories).toBeGreaterThan(0);
    expect(result.lifeStage).toBe('toddler1to3');
  });

  it('handles child 3 to 18 years', () => {
    const result = computeTargetNutrition({
      sex: 'male',
      ageYears: 10,
      weightKg: 32,
      heightCm: 138,
      activityLevel: 'active',
      category: 'balita',
    });

    expect(result.status).toBe('estimated');
    expect(result.method).toContain('DRI 2023 EER anak dan remaja');
    expect(result.lifeStage).toBe('child4to18');
  });

  it('handles pregnancy pathway', () => {
    const result = computeTargetNutrition({
      sex: 'female',
      ageYears: 28,
      weightKg: 68,
      prePregnancyWeightKg: 60,
      heightCm: 162,
      gestationalWeeks: 24,
      category: 'ibu_hamil',
      activityLevel: 'lowActive',
    });

    expect(result.status).toBe('estimated');
    expect(result.method).toContain('DRI 2023 EER kehamilan trimester 2');
    expect(result.lifeStage).toBe('pregnantAdult');
    expect(result.statusNutrisi).toBe('Pregnant (Monitoring)');
  });

  it('marks postoperative category without doctor calories as clinical_review_required', () => {
    const result = computeTargetNutrition({
      sex: 'male',
      ageYears: 45,
      weightKg: 65,
      heightCm: 170,
      category: 'pasca_operasi',
    });

    expect(result.status).toBe('clinical_review_required');
    expect(result.calories).toBe(0);
    expect(result.method).toContain('Penilaian individual');
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('resolves activity factors correctly', () => {
    expect(resolveActivityLevel(1.2)).toBe('inactive');
    expect(resolveActivityLevel(1.375)).toBe('lowActive');
    expect(resolveActivityLevel(1.55)).toBe('active');
    expect(resolveActivityLevel(1.725)).toBe('veryActive');
    expect(resolveActivityLevel('sedentary')).toBe('inactive');
  });

  it('calculates nutritional status correctly', () => {
    expect(assessNutritionalStatus(25, 17.5).statusNutrisi).toBe('Underweight');
    expect(assessNutritionalStatus(25, 22.0).statusNutrisi).toBe('Normal');
    expect(assessNutritionalStatus(25, 27.5).statusNutrisi).toBe('Overweight');
    expect(assessNutritionalStatus(25, 32.0).statusNutrisi).toBe('Obese');
    expect(assessNutritionalStatus(28, 24.0, true).statusNutrisi).toBe(
      'Pregnant (Monitoring)',
    );
  });
});
