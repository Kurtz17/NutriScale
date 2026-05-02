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
import { useEffect, useRef, useState } from 'react';

import { AddressData } from '../types';

interface WilayahItem {
  id: string;
  name: string;
}

interface Props {
  initialData?: AddressData;
  disabled?: boolean;
}

const API_BASE = '/api/wilayah';

const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase(),
  );
};

export default function AddressFields({
  initialData,
  disabled = false,
}: Props) {
  const inputStyle =
    'w-full bg-[#F3F4F6] rounded-xl h-12 px-4 mt-2 disabled:opacity-50';

  const [provinsiList, setProvinsiList] = useState<WilayahItem[]>([]);
  const [kabupatenList, setKabupatenList] = useState<WilayahItem[]>([]);
  const [kecamatanList, setKecamatanList] = useState<WilayahItem[]>([]);
  const [kelurahanList, setKelurahanList] = useState<WilayahItem[]>([]);

  const [selectedProvinsi, setSelectedProvinsi] = useState<string>(
    initialData?.provinsiId ?? '',
  );
  const [selectedKabupaten, setSelectedKabupaten] = useState<string>(
    initialData?.kabupatenId ?? '',
  );
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>(
    initialData?.kecamatanId ?? '',
  );
  const [selectedKelurahan, setSelectedKelurahan] = useState<string>(
    initialData?.kelurahanId ?? '',
  );

  const [loadingProvinsi, setLoadingProvinsi] = useState(true);
  const [loadingKabupaten, setLoadingKabupaten] = useState(false);
  const [loadingKecamatan, setLoadingKecamatan] = useState(false);
  const [loadingKelurahan, setLoadingKelurahan] = useState(false);

  // Ref untuk track apakah ini initial load (bukan user interaction)
  const initialProvinsiId = useRef(initialData?.provinsiId ?? '');
  const initialKabupatenId = useRef(initialData?.kabupatenId ?? '');
  const initialKecamatanId = useRef(initialData?.kecamatanId ?? '');
  const initialKelurahanId = useRef(initialData?.kelurahanId ?? '');

  // Fetch Provinsi
  useEffect(() => {
    fetch(`${API_BASE}?type=provinces`)
      .then((r) => r.json())
      .then((data: WilayahItem[]) => {
        setProvinsiList(data);
        if (initialProvinsiId.current) {
          setSelectedProvinsi(initialProvinsiId.current);
        }
      })
      .finally(() => setLoadingProvinsi(false));
  }, []);

  // Fetch Kabupaten
  useEffect(() => {
    if (!selectedProvinsi) return;

    const loadData = async () => {
      setLoadingKabupaten(true);
      const isInitial = selectedProvinsi === initialProvinsiId.current;
      try {
        const r = await fetch(
          `${API_BASE}?type=regencies&id=${selectedProvinsi}`,
        );
        const data = await r.json();
        setKabupatenList(data);
        if (!isInitial) {
          setSelectedKabupaten('');
          setSelectedKecamatan('');
          setSelectedKelurahan('');
          setKecamatanList([]);
          setKelurahanList([]);
        } else if (initialKabupatenId.current) {
          setSelectedKabupaten(initialKabupatenId.current);
        }
      } finally {
        setLoadingKabupaten(false);
      }
    };

    loadData();
  }, [selectedProvinsi]);

  // Fetch Kecamatan
  useEffect(() => {
    if (!selectedKabupaten) return;

    const loadData = async () => {
      setLoadingKecamatan(true);
      const isInitial = selectedKabupaten === initialKabupatenId.current;
      try {
        const r = await fetch(
          `${API_BASE}?type=districts&id=${selectedKabupaten}`,
        );
        const data = await r.json();
        setKecamatanList(data);
        if (!isInitial) {
          setSelectedKecamatan('');
          setSelectedKelurahan('');
          setKelurahanList([]);
        } else if (initialKecamatanId.current) {
          setSelectedKecamatan(initialKecamatanId.current);
        }
      } finally {
        setLoadingKecamatan(false);
      }
    };

    loadData();
  }, [selectedKabupaten]);

  // Fetch Kelurahan
  useEffect(() => {
    if (!selectedKecamatan) return;

    const loadData = async () => {
      setLoadingKelurahan(true);
      const isInitial = selectedKecamatan === initialKecamatanId.current;
      try {
        const r = await fetch(
          `${API_BASE}?type=villages&id=${selectedKecamatan}`,
        );
        const data = await r.json();
        setKelurahanList(data);
        if (!isInitial) {
          setSelectedKelurahan('');
        } else if (initialKelurahanId.current) {
          setSelectedKelurahan(initialKelurahanId.current);
        }
      } finally {
        setLoadingKelurahan(false);
      }
    };

    loadData();
  }, [selectedKecamatan]);

  const getNameById = (list: WilayahItem[], id: string) => {
    const name = list.find((item) => item.id === id)?.name ?? '';
    return name ? toTitleCase(name) : '';
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <input
        type="hidden"
        name="provinsi"
        value={getNameById(provinsiList, selectedProvinsi)}
      />
      <input type="hidden" name="provinsiId" value={selectedProvinsi} />
      <input
        type="hidden"
        name="kabupaten"
        value={getNameById(kabupatenList, selectedKabupaten)}
      />
      <input type="hidden" name="kabupatenId" value={selectedKabupaten} />
      <input
        type="hidden"
        name="kecamatan"
        value={getNameById(kecamatanList, selectedKecamatan)}
      />
      <input type="hidden" name="kecamatanId" value={selectedKecamatan} />
      <input
        type="hidden"
        name="kelurahan"
        value={getNameById(kelurahanList, selectedKelurahan)}
      />
      <input type="hidden" name="kelurahanId" value={selectedKelurahan} />

      <div>
        <Label>Provinsi</Label>
        <Select
          value={selectedProvinsi}
          onValueChange={setSelectedProvinsi}
          disabled={disabled || loadingProvinsi}
        >
          <SelectTrigger className={inputStyle}>
            <SelectValue
              placeholder={loadingProvinsi ? 'Memuat...' : 'Pilih provinsi'}
            />
          </SelectTrigger>
          <SelectContent>
            {provinsiList.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {toTitleCase(p.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Kabupaten / Kota</Label>
        <Select
          value={selectedKabupaten}
          onValueChange={setSelectedKabupaten}
          disabled={disabled || !selectedProvinsi || loadingKabupaten}
        >
          <SelectTrigger className={inputStyle}>
            <SelectValue
              placeholder={
                !selectedProvinsi
                  ? 'Pilih provinsi dulu'
                  : loadingKabupaten
                    ? 'Memuat...'
                    : 'Pilih kabupaten/kota'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {kabupatenList.map((k) => (
              <SelectItem key={k.id} value={k.id}>
                {toTitleCase(k.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Kecamatan</Label>
        <Select
          value={selectedKecamatan}
          onValueChange={setSelectedKecamatan}
          disabled={disabled || !selectedKabupaten || loadingKecamatan}
        >
          <SelectTrigger className={inputStyle}>
            <SelectValue
              placeholder={
                !selectedKabupaten
                  ? 'Pilih kabupaten dulu'
                  : loadingKecamatan
                    ? 'Memuat...'
                    : 'Pilih kecamatan'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {kecamatanList.map((k) => (
              <SelectItem key={k.id} value={k.id}>
                {toTitleCase(k.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Kelurahan / Desa</Label>
        <Select
          value={selectedKelurahan}
          onValueChange={setSelectedKelurahan}
          disabled={disabled || !selectedKecamatan || loadingKelurahan}
        >
          <SelectTrigger className={inputStyle}>
            <SelectValue
              placeholder={
                !selectedKecamatan
                  ? 'Pilih kecamatan dulu'
                  : loadingKelurahan
                    ? 'Memuat...'
                    : 'Pilih kelurahan/desa'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {kelurahanList.map((k) => (
              <SelectItem key={k.id} value={k.id}>
                {toTitleCase(k.name)}
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
          max={99}
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
          max={99}
          disabled={disabled}
          className={inputStyle}
        />
      </div>

      <div className="md:col-span-2">
        <Label>Detail Alamat</Label>
        <Input
          name="detailAlamat"
          defaultValue={initialData?.detailAlamat}
          placeholder="Nama jalan, nomor rumah, blok, dll."
          disabled={disabled}
          className={inputStyle}
        />
      </div>

      <div className="md:col-span-2">
        <Label>Kode Pos</Label>
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
