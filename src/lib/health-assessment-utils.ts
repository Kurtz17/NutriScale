import { JenisKelamin, KategoriKondisi } from '@/app/generated/prisma/client';
import { HealthFormData } from '@/types/health-assessment';

export function mapGender(gender: string): JenisKelamin {
  return gender === 'female' ? JenisKelamin.PEREMPUAN : JenisKelamin.LAKI_LAKI;
}

export function mapCategory(category: string): KategoriKondisi {
  switch (category) {
    case 'balita':
      return KategoriKondisi.ANAK_BALITA;
    case 'ibu_hamil':
      return KategoriKondisi.IBU_HAMIL;
    case 'pasca_operasi':
      return KategoriKondisi.PASCA_OPERASI;
    default:
      return KategoriKondisi.UMUM;
  }
}

export function formatPantanganMedis(formData: HealthFormData): string | null {
  return formData.category === 'pasca_operasi' &&
    Array.isArray(formData.larangan) &&
    formData.larangan.length > 0
    ? formData.larangan.join(', ')
    : null;
}

export function formatUsiaKehamilan(formData: HealthFormData): number | null {
  return formData.category === 'ibu_hamil' && formData.gestasi !== ''
    ? Number(formData.gestasi)
    : null;
}
