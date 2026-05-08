import { AddressData } from '@/types/profile';
import { useCallback, useEffect, useRef, useState } from 'react';

interface WilayahItem {
  id: string;
  name: string;
}

const API_BASE = '/api/wilayah';

export const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase(),
  );
};

export function useRegionData(initialData?: AddressData) {
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

  const getNameById = useCallback((list: WilayahItem[], id: string) => {
    const name = list.find((item) => item.id === id)?.name ?? '';
    return name ? toTitleCase(name) : '';
  }, []);

  return {
    lists: {
      provinsi: provinsiList,
      kabupaten: kabupatenList,
      kecamatan: kecamatanList,
      kelurahan: kelurahanList,
    },
    selections: {
      provinsi: selectedProvinsi,
      kabupaten: selectedKabupaten,
      kecamatan: selectedKecamatan,
      kelurahan: selectedKelurahan,
    },
    setters: {
      provinsi: setSelectedProvinsi,
      kabupaten: setSelectedKabupaten,
      kecamatan: setSelectedKecamatan,
      kelurahan: setSelectedKelurahan,
    },
    loading: {
      provinsi: loadingProvinsi,
      kabupaten: loadingKabupaten,
      kecamatan: loadingKecamatan,
      kelurahan: loadingKelurahan,
    },
    getNameById,
  };
}
