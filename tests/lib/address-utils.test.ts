import { formatAddress } from '@/lib/address-utils';
import { describe, expect, it } from 'vitest';

describe('formatAddress', () => {
  it('should return an empty string when address is missing', () => {
    expect(formatAddress(undefined)).toBe('');
  });

  it('should join available address parts in display order', () => {
    expect(
      formatAddress({
        detailAlamat: 'Rumah hijau',
        jalan: 'Jl. Melati',
        rt: '01',
        rw: '02',
        kelurahan: 'Cipete',
        kecamatan: 'Cilandak',
        kabupaten: 'Jakarta Selatan',
        provinsi: 'DKI Jakarta',
        kodePos: '12410',
      }),
    ).toBe(
      'Rumah hijau, Jl. Melati, RT 01 / RW 02, Cipete, Cilandak, Jakarta Selatan, DKI Jakarta, 12410',
    );
  });

  it('should use dash placeholders when only one RT/RW value exists', () => {
    expect(formatAddress({ rt: '03', kelurahan: 'Pondok Labu' })).toBe(
      'RT 03 / RW -, Pondok Labu',
    );
  });
});
