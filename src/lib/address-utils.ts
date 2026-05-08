import { UserResponse } from '@/types/checkout';

export function formatAddress(address: UserResponse['address']): string {
  if (!address) return '';

  const parts: string[] = [];
  if (address.detailAlamat) parts.push(address.detailAlamat);
  if (address.jalan) parts.push(address.jalan);
  if (address.rt || address.rw)
    parts.push(`RT ${address.rt || '-'} / RW ${address.rw || '-'}`);
  if (address.kelurahan) parts.push(address.kelurahan);
  if (address.kecamatan) parts.push(address.kecamatan);
  if (address.kabupaten) parts.push(address.kabupaten);
  if (address.provinsi) parts.push(address.provinsi);
  if (address.kodePos) parts.push(address.kodePos);

  return parts.join(', ');
}
