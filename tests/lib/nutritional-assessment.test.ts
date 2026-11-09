import {
  calculateBMI,
  calculateHAZ,
  calculateWHZ,
  classifyAdultBMI,
  classifyHAZ,
  classifyWHZ,
  evaluateNutritionalAssessment,
} from '@/lib/nutrition/nutritional-assessment';
import { describe, expect, it } from 'vitest';

describe('Nutritional Assessment & Anthropometry Engine', () => {
  describe('calculateBMI', () => {
    it('calculates BMI accurately', () => {
      // 70 kg / (1.75 m)^2 = 22.86
      expect(calculateBMI(70, 175)).toBe(22.86);
      expect(calculateBMI(50, 160)).toBe(19.53);
      expect(calculateBMI(0, 170)).toBe(0);
      expect(calculateBMI(70, 0)).toBe(0);
    });
  });

  describe('classifyAdultBMI', () => {
    it('classifies adult BMI according to WHO standards', () => {
      expect(classifyAdultBMI(17.5).status).toBe('Underweight');
      expect(classifyAdultBMI(22.0).status).toBe('Normal');
      expect(classifyAdultBMI(27.0).status).toBe('Overweight');
      expect(classifyAdultBMI(32.0).status).toBe('Obese');
    });
  });

  describe('calculateHAZ & classifyHAZ', () => {
    it('returns 0 for adults', () => {
      expect(calculateHAZ({ sex: 'male', heightCm: 175, ageYears: 25 })).toBe(
        0,
      );
    });

    it('calculates HAZ for boys at 24 months', () => {
      // At 24m, WHO median height for boys is ~87.8 cm
      const hazNormal = calculateHAZ({
        sex: 'male',
        heightCm: 87.8,
        ageMonths: 24,
      });
      expect(hazNormal).toBe(0.0);
      expect(classifyHAZ(hazNormal).status).toBe('Normal');

      // Stunted child (far below median, e.g. 78 cm)
      const hazStunted = calculateHAZ({
        sex: 'male',
        heightCm: 78.0,
        ageMonths: 24,
      });
      expect(hazStunted).toBeLessThan(-2.0);
      expect(classifyHAZ(hazStunted).isStunted).toBe(true);
    });

    it('calculates HAZ for girls at 48 months (4 years)', () => {
      // At 48m, WHO median height for girls is ~102.7 cm
      const haz = calculateHAZ({
        sex: 'female',
        heightCm: 102.7,
        ageMonths: 48,
      });
      expect(haz).toBe(0.0);
      expect(classifyHAZ(haz).status).toBe('Normal');
    });
  });

  describe('calculateWHZ & classifyWHZ', () => {
    it('returns 0 for adults or children taller than 125 cm', () => {
      expect(
        calculateWHZ({
          sex: 'male',
          weightKg: 70,
          heightCm: 175,
          ageYears: 25,
        }),
      ).toBe(0);
    });

    it('calculates WHZ for toddler boys (height 85 cm)', () => {
      // At 85 cm, WHO median weight for boys is ~11.8 kg
      const whzNormal = calculateWHZ({
        sex: 'male',
        heightCm: 85,
        weightKg: 11.8,
        ageYears: 2,
      });
      expect(whzNormal).toBe(0.0);
      expect(classifyWHZ(whzNormal).status).toBe('Gizi Baik');

      // Severely wasted child (e.g. 8.0 kg at 85 cm)
      const whzWasted = calculateWHZ({
        sex: 'male',
        heightCm: 85,
        weightKg: 8.0,
        ageYears: 2,
      });
      expect(whzWasted).toBeLessThan(-3.0);
      expect(classifyWHZ(whzWasted).isWasted).toBe(true);
      expect(classifyWHZ(whzWasted).status).toBe('Gizi Buruk');
    });

    it('detects overweight/obese WHZ in toddlers', () => {
      // At 85 cm, boy with 16 kg is well above median
      const whzOverweight = calculateWHZ({
        sex: 'male',
        heightCm: 85,
        weightKg: 16.0,
        ageYears: 2,
      });
      expect(whzOverweight).toBeGreaterThan(2.0);
      expect(classifyWHZ(whzOverweight).isOverweight).toBe(true);
    });
  });

  describe('evaluateNutritionalAssessment', () => {
    it('evaluates pregnant women correctly', () => {
      const res = evaluateNutritionalAssessment({
        sex: 'female',
        weightKg: 65,
        heightCm: 160,
        ageYears: 28,
        isPregnant: true,
      });
      expect(res.statusNutrisi).toBe('Pregnant (Monitoring)');
      expect(res.haz).toBe(0);
      expect(res.whz).toBe(0);
      expect(res.bmi).toBe(25.39);
    });

    it('evaluates healthy adults correctly', () => {
      const res = evaluateNutritionalAssessment({
        sex: 'male',
        weightKg: 70,
        heightCm: 175,
        ageYears: 30,
      });
      expect(res.statusNutrisi).toBe('Normal');
      expect(res.bmi).toBe(22.86);
      expect(res.haz).toBe(0);
      expect(res.whz).toBe(0);
    });

    it('evaluates toddler with HAZ and WHZ', () => {
      const res = evaluateNutritionalAssessment({
        sex: 'male',
        weightKg: 12.0,
        heightCm: 86.0,
        ageMonths: 24,
      });
      expect(res.isAdult).toBe(false);
      expect(res.bmi).toBeGreaterThan(0);
      expect(res.haz).toBeDefined();
      expect(res.whz).toBeDefined();
      expect(res.statusNutrisi).toBe('Normal');
    });
  });
});
