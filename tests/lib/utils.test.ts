import { cn } from '@/lib/utils';
import { describe, expect, it } from 'vitest';

describe('Utils: cn function', () => {
  it('should merge tailwind classes correctly', () => {
    const result = cn('bg-red-500', 'text-white');
    expect(result).toBe('bg-red-500 text-white');
  });

  it('should handle conditional classes using clsx format', () => {
    const isActive = true;
    const isError = false;
    const result = cn('base-class', {
      'active-class': isActive,
      'error-class': isError,
    });
    expect(result).toBe('base-class active-class');
  });

  it('should correctly override conflicting tailwind classes using tailwind-merge', () => {
    // text-sm will be overridden by text-lg because twMerge resolves conflicts
    const result = cn('p-2 text-sm text-red-500', 'text-lg');
    expect(result).toBe('p-2 text-red-500 text-lg');
  });

  it('should ignore undefined or null values', () => {
    const result = cn('btn', null, undefined, 'btn-primary');
    expect(result).toBe('btn btn-primary');
  });
});
