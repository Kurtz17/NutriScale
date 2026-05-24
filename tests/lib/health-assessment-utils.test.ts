import {
  formatPantanganMedis,
  formatUsiaKehamilan,
  mapCategory,
  mapGender,
} from '@/lib/health-assessment-utils';
import { describe, expect, it } from 'vitest';

describe('health assessment utils', () => {
  it('should map UI gender values to Prisma enum values', () => {
    expect(mapGender('female')).toBe('PEREMPUAN');
    expect(mapGender('male')).toBe('LAKI_LAKI');
    expect(mapGender('unknown')).toBe('LAKI_LAKI');
  });

  it('should map UI category values to Prisma enum values', () => {
    expect(mapCategory('balita')).toBe('ANAK_BALITA');
    expect(mapCategory('ibu_hamil')).toBe('IBU_HAMIL');
    expect(mapCategory('pasca_operasi')).toBe('PASCA_OPERASI');
    expect(mapCategory('umum')).toBe('UMUM');
  });

  it('should format medical restrictions only for post-surgery forms', () => {
    expect(
      formatPantanganMedis({
        gender: 'male',
        category: 'pasca_operasi',
        age: 40,
        weight: 70,
        height: 170,
        larangan: ['gula', 'garam'],
      }),
    ).toBe('gula, garam');

    expect(
      formatPantanganMedis({
        gender: 'female',
        category: 'umum',
        age: 25,
        weight: 55,
        height: 160,
        larangan: ['gula'],
      }),
    ).toBeNull();
  });

  it('should format pregnancy age only for pregnancy forms', () => {
    expect(
      formatUsiaKehamilan({
        gender: 'female',
        category: 'ibu_hamil',
        age: 28,
        weight: 60,
        height: 160,
        gestasi: 18,
      }),
    ).toBe(18);

    expect(
      formatUsiaKehamilan({
        gender: 'female',
        category: 'ibu_hamil',
        age: 28,
        weight: 60,
        height: 160,
        gestasi: '',
      }),
    ).toBeNull();
  });
});
