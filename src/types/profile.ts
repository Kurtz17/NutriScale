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

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  image: string;
  username: string;
  tanggalLahir: string;
  phone: string;
  address: AddressData;
  notification: boolean;
  providerId?: string;
}
