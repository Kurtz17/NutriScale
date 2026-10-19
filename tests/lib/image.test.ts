import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getProductImageUrl } from '../../src/lib/image';

describe('getProductImageUrl', () => {
  const originalEnv = process.env.NEXT_PUBLIC_SUPABASE_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://xyzcompany.supabase.co';
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalEnv;
  });

  it('should return null for empty or null image and without productName', () => {
    expect(getProductImageUrl(null, null)).toBeNull();
    expect(getProductImageUrl('', '')).toBeNull();
    expect(getProductImageUrl('   ', '   ')).toBeNull();
  });

  it('should resolve URL from productName if image is emoji', () => {
    expect(getProductImageUrl('🍲', 'Lentils')).toBe(
      'https://xyzcompany.supabase.co/storage/v1/object/public/product-images/Lentils.jpeg',
    );
    expect(getProductImageUrl('🌾', 'Red Bell Pepper')).toBe(
      'https://xyzcompany.supabase.co/storage/v1/object/public/product-images/Red%20Bell%20Pepper.jpeg',
    );
  });

  it('should encode full URLs that have spaces', () => {
    const rawUrl =
      'https://xyzcompany.supabase.co/storage/v1/object/public/product-images/ayam bakar madu.jpg';
    expect(getProductImageUrl(rawUrl)).toBe(
      'https://xyzcompany.supabase.co/storage/v1/object/public/product-images/ayam%20bakar%20madu.jpg',
    );
  });

  it('should build public url from filename with spaces and support various extensions', () => {
    expect(getProductImageUrl('nasi goreng special.jpg')).toBe(
      'https://xyzcompany.supabase.co/storage/v1/object/public/product-images/nasi%20goreng%20special.jpg',
    );

    expect(getProductImageUrl('salad buah segar.jpeg')).toBe(
      'https://xyzcompany.supabase.co/storage/v1/object/public/product-images/salad%20buah%20segar.jpeg',
    );

    expect(getProductImageUrl('avocado toast.PNG')).toBe(
      'https://xyzcompany.supabase.co/storage/v1/object/public/product-images/avocado%20toast.PNG',
    );

    expect(getProductImageUrl('smoothie bowl.webp')).toBe(
      'https://xyzcompany.supabase.co/storage/v1/object/public/product-images/smoothie%20bowl.webp',
    );
  });

  it('should handle subfolder paths properly', () => {
    expect(getProductImageUrl('breakfast/oatmeal pisang.jpg')).toBe(
      'https://xyzcompany.supabase.co/storage/v1/object/public/product-images/breakfast/oatmeal%20pisang.jpg',
    );
  });
});
