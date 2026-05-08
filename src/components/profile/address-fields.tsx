'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegionData } from '@/hooks/useRegionData';
import { AddressData } from '@/types/profile';

import RegionSelect from './region-select';

interface Props {
  initialData?: AddressData;
  disabled?: boolean;
}

export default function AddressFields({
  initialData,
  disabled = false,
}: Props) {
  const { lists, selections, setters, loading, getNameById } =
    useRegionData(initialData);

  const inputStyle =
    'w-full bg-[#F8FAFC] rounded-2xl h-14 px-5 text-slate-800 font-bold border-2 border-slate-100 focus:border-[#7CB342] focus:ring-0 transition-all disabled:opacity-50 disabled:bg-slate-50 disabled:border-slate-50';
  const labelStyle =
    'text-sm font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block';

  return (
    <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
      {/* Hidden inputs for form data */}
      <input
        type="hidden"
        name="provinsi"
        value={getNameById(lists.provinsi, selections.provinsi)}
      />
      <input type="hidden" name="provinsiId" value={selections.provinsi} />
      <input
        type="hidden"
        name="kabupaten"
        value={getNameById(lists.kabupaten, selections.kabupaten)}
      />
      <input type="hidden" name="kabupatenId" value={selections.kabupaten} />
      <input
        type="hidden"
        name="kecamatan"
        value={getNameById(lists.kecamatan, selections.kecamatan)}
      />
      <input type="hidden" name="kecamatanId" value={selections.kecamatan} />
      <input
        type="hidden"
        name="kelurahan"
        value={getNameById(lists.kelurahan, selections.kelurahan)}
      />
      <input type="hidden" name="kelurahanId" value={selections.kelurahan} />

      <RegionSelect
        label="Provinsi"
        value={selections.provinsi}
        onValueChange={setters.provinsi}
        items={lists.provinsi}
        loading={loading.provinsi}
        disabled={disabled}
        placeholder="Pilih Provinsi"
        emptyPlaceholder="Memuat data..."
      />

      <RegionSelect
        label="Kabupaten / Kota"
        value={selections.kabupaten}
        onValueChange={setters.kabupaten}
        items={lists.kabupaten}
        loading={loading.kabupaten}
        disabled={disabled || !selections.provinsi}
        placeholder="Pilih Kabupaten/Kota"
        emptyPlaceholder="Pilih provinsi dulu"
      />

      <RegionSelect
        label="Kecamatan"
        value={selections.kecamatan}
        onValueChange={setters.kecamatan}
        items={lists.kecamatan}
        loading={loading.kecamatan}
        disabled={disabled || !selections.kabupaten}
        placeholder="Pilih Kecamatan"
        emptyPlaceholder="Pilih kabupaten dulu"
      />

      <RegionSelect
        label="Kelurahan / Desa"
        value={selections.kelurahan}
        onValueChange={setters.kelurahan}
        items={lists.kelurahan}
        loading={loading.kelurahan}
        disabled={disabled || !selections.kecamatan}
        placeholder="Pilih Kelurahan/Desa"
        emptyPlaceholder="Pilih kecamatan dulu"
      />

      <div className="space-y-2">
        <Label className={labelStyle}>RT</Label>
        <Input
          name="rt"
          defaultValue={initialData?.rt}
          type="number"
          placeholder="00"
          disabled={disabled}
          className={inputStyle}
        />
      </div>

      <div className="space-y-2">
        <Label className={labelStyle}>RW</Label>
        <Input
          name="rw"
          defaultValue={initialData?.rw}
          type="number"
          placeholder="00"
          disabled={disabled}
          className={inputStyle}
        />
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label className={labelStyle}>Detail Alamat</Label>
        <Input
          name="detailAlamat"
          defaultValue={initialData?.detailAlamat}
          placeholder="Nama jalan, nomor rumah, blok, dll."
          disabled={disabled}
          className={inputStyle}
        />
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label className={labelStyle}>Kode Pos</Label>
        <Input
          name="kodePos"
          defaultValue={initialData?.kodePos}
          placeholder="Contoh: 40115"
          maxLength={5}
          disabled={disabled}
          className={inputStyle}
        />
      </div>
    </div>
  );
}
