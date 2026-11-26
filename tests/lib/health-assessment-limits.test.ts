import {
  validateAge,
  validateAnthropometry,
} from '@/lib/health-assessment-limits';
import { HealthFormData } from '@/types/health-assessment';
import { describe, expect, it } from 'vitest';

type Category = HealthFormData['category'];

// [kategori, umur, BB min, BB max, TB min, TB max]; umur balita dalam bulan.
const rows: [Category, number, number, number, number, number][] = [
  ['balita', 0, 0.9, 50, 38, 140],
  ['balita', 60, 0.9, 50, 38, 140],
  ['umum', 5, 10, 250, 80, 230],
  ['umum', 19, 10, 250, 80, 230],
  ['umum', 20, 20, 350, 100, 250],
  ['umum', 110, 20, 350, 100, 250],
  ['pasca_operasi', 19, 10, 250, 80, 230],
  ['pasca_operasi', 20, 20, 350, 100, 250],
  ['ibu_hamil', 12, 25, 250, 110, 230],
  ['ibu_hamil', 19, 25, 250, 110, 230],
  ['ibu_hamil', 20, 20, 350, 100, 250],
  ['ibu_hamil', 60, 20, 350, 100, 250],
];

describe('health assessment limits', () => {
  it.each(rows)(
    '%s umur %d: batas BB dan TB inklusif',
    (category, age, minW, maxW, minH, maxH) => {
      const check = (weight: number, height: number) =>
        validateAnthropometry({ category, age, weight, height });

      expect(validateAge({ category, age })).toBeNull();
      expect(check(minW, minH)).toBeNull();
      expect(check(maxW, maxH)).toBeNull();
      expect(check(minW - 0.1, minH)).toContain('Berat badan');
      expect(check(maxW + 0.1, minH)).toContain('Berat badan');
      expect(check(minW, minH - 0.1)).toContain('Tinggi badan');
      expect(check(minW, maxH + 0.1)).toContain('Tinggi badan');
      // BMI terburuk harus muat di Decimal(5, 2)
      expect(maxW / (minH / 100) ** 2).toBeLessThan(999.99);
    },
  );

  it.each<[Category, number]>([
    ['balita', -1],
    ['balita', 61],
    ['umum', 4],
    ['umum', 111],
    ['pasca_operasi', 4],
    ['ibu_hamil', 11],
    ['ibu_hamil', 61],
    ['umum', 25.5],
    ['umum', NaN],
  ])('%s umur %d ditolak', (category, age) => {
    expect(validateAge({ category, age })).not.toBeNull();
  });
});
