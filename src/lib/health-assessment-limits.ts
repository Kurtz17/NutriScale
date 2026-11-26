import { HealthFormData } from '@/types/health-assessment';

type Range = { min: number; max: number };
type Limits = { age: Range; weight: Range; height: Range };

// BB (kg) dan TB (cm) dibatasi agar BMI/HAZ/WHZ muat di kolom Decimal(5, 2).
const BALITA = {
  weight: { min: 0.9, max: 50 },
  height: { min: 38, max: 140 },
};
const ANAK_REMAJA = {
  weight: { min: 10, max: 250 },
  height: { min: 80, max: 230 },
};
const REMAJA_HAMIL = {
  weight: { min: 25, max: 250 },
  height: { min: 110, max: 230 },
};
const DEWASA = {
  weight: { min: 20, max: 350 },
  height: { min: 100, max: 250 },
};

const USIA_REMAJA_MAKS = 19; // tahun (228 bulan)

/** Umur balita dalam bulan, kategori lain dalam tahun. */
export function getHealthLimits(
  category: HealthFormData['category'],
  age: number,
): Limits {
  if (category === 'balita') return { age: { min: 0, max: 60 }, ...BALITA };

  const remaja = age <= USIA_REMAJA_MAKS;
  if (category === 'ibu_hamil') {
    return {
      age: { min: 12, max: 60 }, // 60 = batas atas AI engine
      ...(remaja ? REMAJA_HAMIL : DEWASA),
    };
  }
  return { age: { min: 5, max: 110 }, ...(remaja ? ANAK_REMAJA : DEWASA) };
}

// Ditulis positif supaya NaN ikut ditolak.
const inRange = (value: number, { min, max }: Range) =>
  value >= min && value <= max;

const format = (value: number) => String(value).replace('.', ',');
const formatRange = ({ min, max }: Range) => `${format(min)} - ${format(max)}`;

export function formatAgeRange(category: HealthFormData['category']): string {
  const unit = category === 'balita' ? 'bulan' : 'tahun';
  return `${formatRange(getHealthLimits(category, 0).age)} ${unit}`;
}

/** Pesan error, atau null bila umur valid. */
export function validateAge({
  category,
  age,
}: Pick<HealthFormData, 'category' | 'age'>): string | null {
  const value = Number(age);
  const label =
    category === 'balita'
      ? 'Umur balita'
      : category === 'ibu_hamil'
        ? 'Umur ibu hamil'
        : 'Umur';

  if (age === '' || !inRange(value, getHealthLimits(category, value).age)) {
    return `${label} harus ${formatAgeRange(category)}`;
  }
  // Kolom umur bertipe Int.
  return Number.isInteger(value) ? null : `${label} harus bilangan bulat`;
}

/** Pesan error, atau null bila berat dan tinggi badan wajar untuk umurnya. */
export function validateAnthropometry({
  category,
  age,
  weight,
  height,
}: Pick<HealthFormData, 'category' | 'age' | 'weight' | 'height'>):
  | string
  | null {
  const limits = getHealthLimits(category, Number(age));

  if (!inRange(Number(weight), limits.weight)) {
    return `Berat badan harus antara ${formatRange(limits.weight)} kg`;
  }
  if (!inRange(Number(height), limits.height)) {
    return `Tinggi badan harus antara ${formatRange(limits.height)} cm`;
  }
  return null;
}
