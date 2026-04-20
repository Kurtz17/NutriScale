'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { AddressData } from '../types';

interface Props {
  initialData?: AddressData;
  disabled?: boolean;
}

export default function AddressFields({
  initialData,
  disabled = false,
}: Props) {
  const inputStyle =
    'w-full bg-[#F3F4F6] rounded-xl h-12 px-4 mt-2 disabled:opacity-50'; // ✅ INI KUNCI FIX

  const kelurahan = [
    'Cibeusi',
    'Cikeruh',
    'Cilayung',
    'Cileles',
    'Cintamulya',
    'Cipacing',
    'Cisempur',
    'Hegarmanah',
    'Jatimukti',
    'Jatiroke',
    'Mekargalih',
    'Sayang',
    'lainnya',
  ];

  const jalan = [
    'Jl. Raya Jatinangor',
    'Jl. Kolonel Ahmad Syam',
    'Jl. Ir. Soekarno',
    'Jl. Letda Lukito',
    'Jl. GKPN',
    'Jl. Cikuda',
    'Jl. KH. Hasan Mustopha',
    'Jl. Cipacing',
    'lainnya',
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <Label>Provinsi</Label>
        <Input
          name="provinsi"
          value="Jawa Barat"
          disabled
          className={inputStyle}
        />
      </div>

      <div>
        <Label>Kabupaten</Label>
        <Input
          name="kabupaten"
          value="Jatinangor"
          disabled
          className={inputStyle}
        />
      </div>

      <div>
        <Label>Kelurahan</Label>
        <Select
          name="kelurahan"
          defaultValue={initialData?.kelurahan}
          disabled={disabled}
        >
          <SelectTrigger className={inputStyle}>
            <SelectValue placeholder="Pilih kelurahan" />
          </SelectTrigger>
          <SelectContent>
            {kelurahan.map((k) => (
              <SelectItem key={k} value={k}>
                {k}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Jalan</Label>
        <Select
          name="jalan"
          defaultValue={initialData?.jalan}
          disabled={disabled}
        >
          <SelectTrigger className={inputStyle}>
            <SelectValue placeholder="Pilih jalan" />
          </SelectTrigger>
          <SelectContent>
            {jalan.map((j) => (
              <SelectItem key={j} value={j}>
                {j}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>RT</Label>
        <Input
          name="rt"
          defaultValue={initialData?.rt}
          type="number"
          min={1}
          max={10}
          disabled={disabled}
          className={inputStyle}
        />
      </div>

      <div>
        <Label>RW</Label>
        <Input
          name="rw"
          defaultValue={initialData?.rw}
          type="number"
          min={1}
          max={10}
          disabled={disabled}
          className={inputStyle}
        />
      </div>

      <div className="md:col-span-2">
        <Label>Kode Pos</Label>
        <Input name="kodePos" value="45363" disabled className={inputStyle} />
      </div>
    </div>
  );
}
