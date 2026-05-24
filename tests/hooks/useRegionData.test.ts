import { toTitleCase } from '@/hooks/useRegionData';
import { describe, expect, it } from 'vitest';

describe('toTitleCase', () => {
  it('should title-case uppercase region names from wilayah API responses', () => {
    expect(toTitleCase('JAWA BARAT')).toBe('Jawa Barat');
    expect(toTitleCase('kabupaten bandung barat')).toBe(
      'Kabupaten Bandung Barat',
    );
  });

  it('should preserve an empty string', () => {
    expect(toTitleCase('')).toBe('');
  });
});
