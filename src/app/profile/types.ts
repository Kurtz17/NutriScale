export interface AddressData {
  // Field lama
  provinsi?: string;
  kabupaten?: string;
  kelurahan?: string;
  jalan?: string;
  rt?: string;
  rw?: string;
  kodePos?: string;

  // Field baru untuk cascading dropdown
  provinsiId?: string;
  kabupatenId?: string;
  kecamatan?: string;
  kecamatanId?: string;
  kelurahanId?: string;
  detailAlamat?: string;
}
