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

/**
 * Teks bebas dari form: dirapikan; kosong atau tanpa huruf sama sekali ('-', '--', '???') -> null,
 * artinya tidak ada alergi/pantangan (dipakai untuk kolom alergi & pantangan).
 */
export function formatTeksOpsional(value?: string | null): string | null {
  const teks = (value ?? '').replace(/\s+/g, ' ').trim();
  return /\p{L}/u.test(teks) ? teks : null;
}

/** Pantangan untuk AI engine: pantangan tipe makanan user + larangan dokter (pasca operasi). */
export function gabungPantanganAI(
  pantangan: string | null,
  pantanganMedis: string | null,
): string {
  return [pantangan, pantanganMedis].filter(Boolean).join(', ');
}

/**
 * Hasil parser alergi/pantangan (Groq) dari respons AI engine: `data._meta.parser_alergi.hasil_untuk_disimpan`.
 * Disimpan di kolom parser_alergi lalu dikirim balik sebagai `parserAlergiTersimpan`, sehingga AI engine
 * tidak memanggil Groq lagi selama teks alergi/pantangan tidak berubah. Bentuk tidak valid -> null.
 */
export function ambilHasilParserAlergi(
  aiData: unknown,
): Record<string, unknown> | null {
  const hasil = (
    aiData as
      | { _meta?: { parser_alergi?: { hasil_untuk_disimpan?: unknown } } }
      | null
      | undefined
  )?._meta?.parser_alergi?.hasil_untuk_disimpan;
  return hasil && typeof hasil === 'object' && !Array.isArray(hasil)
    ? (hasil as Record<string, unknown>)
    : null;
}

export function formatUsiaKehamilan(formData: HealthFormData): number | null {
  return formData.category === 'ibu_hamil' && formData.gestasi !== ''
    ? Number(formData.gestasi)
    : null;
}
