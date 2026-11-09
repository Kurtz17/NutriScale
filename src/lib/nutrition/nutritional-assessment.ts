/**
 * NutriScale - Nutritional Assessment & Anthropometry Engine
 *
 * Modul komprehensif untuk menghitung:
 * 1. BMI (Body Mass Index / Indeks Massa Tubuh)
 * 2. HAZ (Height-for-Age Z-score / TB/U atau PB/U - WHO Child Growth Standards & Reference)
 * 3. WHZ (Weight-for-Height Z-score / BB/TB atau BB/PB - WHO Child Growth Standards)
 * 4. Klasifikasi Status Nutrisi & Stunting / Wasting (Standar Kemenkes RI & WHO)
 */

export type Gender = 'male' | 'female' | 'LAKI_LAKI' | 'PEREMPUAN';

export interface AnthropometricInput {
  sex: Gender;
  weightKg: number;
  heightCm: number;
  ageYears?: number;
  ageMonths?: number;
  isPregnant?: boolean;
}

export interface HAZResult {
  haz: number;
  status: 'Sangat Pendek' | 'Pendek' | 'Normal' | 'Tinggi';
  label: string;
  isStunted: boolean;
}

export interface WHZResult {
  whz: number;
  status:
    | 'Gizi Buruk'
    | 'Gizi Kurang'
    | 'Gizi Baik'
    | 'Berisiko Gizi Lebih'
    | 'Gizi Lebih'
    | 'Obesitas';
  label: string;
  isWasted: boolean;
  isOverweight: boolean;
}

export interface BMIResult {
  bmi: number;
  status: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  label: string;
}

export interface ComprehensiveAssessment {
  bmi: number;
  haz: number;
  whz: number;
  statusNutrisi: string;
  bmiClassification: string;
  hazClassification?: string;
  whzClassification?: string;
  isStunted: boolean;
  isWasted: boolean;
  isAdult: boolean;
  isPregnant: boolean;
  interpretasi: string[];
}

// =========================================================================
// TABEL STANDAR PERTUMBUHAN WHO (Child Growth Standards 0-5y & Reference 5-18y)
// =========================================================================

interface GrowthPoint {
  ageMonths: number;
  median: number;
  sd: number;
}

// Height-for-Age (TB/U) Laki-laki (0 - 216 bulan / 18 tahun)
const WHO_HAZ_BOYS: GrowthPoint[] = [
  { ageMonths: 0, median: 49.9, sd: 1.89 },
  { ageMonths: 3, median: 61.4, sd: 2.06 },
  { ageMonths: 6, median: 67.6, sd: 2.27 },
  { ageMonths: 9, median: 72.0, sd: 2.45 },
  { ageMonths: 12, median: 75.7, sd: 2.62 },
  { ageMonths: 18, median: 82.3, sd: 2.92 },
  { ageMonths: 24, median: 87.8, sd: 3.19 },
  { ageMonths: 30, median: 92.4, sd: 3.42 },
  { ageMonths: 36, median: 96.1, sd: 3.63 },
  { ageMonths: 48, median: 103.3, sd: 4.02 },
  { ageMonths: 60, median: 110.0, sd: 4.39 },
  { ageMonths: 72, median: 116.0, sd: 4.8 },
  { ageMonths: 84, median: 121.7, sd: 5.12 },
  { ageMonths: 96, median: 127.3, sd: 5.43 },
  { ageMonths: 108, median: 132.6, sd: 5.73 },
  { ageMonths: 120, median: 137.8, sd: 6.03 },
  { ageMonths: 132, median: 143.1, sd: 6.54 },
  { ageMonths: 144, median: 149.1, sd: 7.2 },
  { ageMonths: 156, median: 156.0, sd: 7.78 },
  { ageMonths: 168, median: 163.2, sd: 7.75 },
  { ageMonths: 180, median: 169.0, sd: 7.24 },
  { ageMonths: 192, median: 172.9, sd: 6.78 },
  { ageMonths: 204, median: 175.2, sd: 6.55 },
  { ageMonths: 216, median: 176.1, sd: 6.49 },
];

// Height-for-Age (TB/U) Perempuan (0 - 216 bulan / 18 tahun)
const WHO_HAZ_GIRLS: GrowthPoint[] = [
  { ageMonths: 0, median: 49.1, sd: 1.86 },
  { ageMonths: 3, median: 59.8, sd: 2.03 },
  { ageMonths: 6, median: 65.7, sd: 2.25 },
  { ageMonths: 9, median: 70.1, sd: 2.43 },
  { ageMonths: 12, median: 74.0, sd: 2.6 },
  { ageMonths: 18, median: 80.7, sd: 2.9 },
  { ageMonths: 24, median: 86.4, sd: 3.17 },
  { ageMonths: 30, median: 91.2, sd: 3.4 },
  { ageMonths: 36, median: 95.1, sd: 3.61 },
  { ageMonths: 48, median: 102.7, sd: 4.0 },
  { ageMonths: 60, median: 109.4, sd: 4.37 },
  { ageMonths: 72, median: 115.1, sd: 4.8 },
  { ageMonths: 84, median: 120.8, sd: 5.2 },
  { ageMonths: 96, median: 126.6, sd: 5.6 },
  { ageMonths: 108, median: 132.5, sd: 6.0 },
  { ageMonths: 120, median: 138.6, sd: 6.5 },
  { ageMonths: 132, median: 145.0, sd: 6.9 },
  { ageMonths: 144, median: 151.2, sd: 6.8 },
  { ageMonths: 156, median: 156.4, sd: 6.4 },
  { ageMonths: 168, median: 159.8, sd: 6.0 },
  { ageMonths: 180, median: 161.7, sd: 5.8 },
  { ageMonths: 192, median: 162.5, sd: 5.7 },
  { ageMonths: 204, median: 162.9, sd: 5.7 },
  { ageMonths: 216, median: 163.1, sd: 5.7 },
];

interface HeightWeightPoint {
  heightCm: number;
  medianWeight: number;
  sdWeight: number;
}

// Weight-for-Height (BB/TB) Laki-laki (45 - 120 cm)
const WHO_WHZ_BOYS: HeightWeightPoint[] = [
  { heightCm: 45, medianWeight: 2.4, sdWeight: 0.25 },
  { heightCm: 50, medianWeight: 3.3, sdWeight: 0.35 },
  { heightCm: 55, medianWeight: 4.5, sdWeight: 0.45 },
  { heightCm: 60, medianWeight: 6.0, sdWeight: 0.6 },
  { heightCm: 65, medianWeight: 7.4, sdWeight: 0.72 },
  { heightCm: 70, medianWeight: 8.6, sdWeight: 0.83 },
  { heightCm: 75, medianWeight: 9.6, sdWeight: 0.92 },
  { heightCm: 80, medianWeight: 10.6, sdWeight: 1.01 },
  { heightCm: 85, medianWeight: 11.8, sdWeight: 1.12 },
  { heightCm: 90, medianWeight: 13.0, sdWeight: 1.23 },
  { heightCm: 95, medianWeight: 14.3, sdWeight: 1.36 },
  { heightCm: 100, medianWeight: 15.7, sdWeight: 1.51 },
  { heightCm: 105, medianWeight: 17.2, sdWeight: 1.68 },
  { heightCm: 110, medianWeight: 18.7, sdWeight: 1.86 },
  { heightCm: 115, medianWeight: 20.4, sdWeight: 2.05 },
  { heightCm: 120, medianWeight: 22.2, sdWeight: 2.26 },
];

// Weight-for-Height (BB/TB) Perempuan (45 - 120 cm)
const WHO_WHZ_GIRLS: HeightWeightPoint[] = [
  { heightCm: 45, medianWeight: 2.5, sdWeight: 0.25 },
  { heightCm: 50, medianWeight: 3.4, sdWeight: 0.35 },
  { heightCm: 55, medianWeight: 4.4, sdWeight: 0.44 },
  { heightCm: 60, medianWeight: 5.7, sdWeight: 0.57 },
  { heightCm: 65, medianWeight: 7.0, sdWeight: 0.69 },
  { heightCm: 70, medianWeight: 8.2, sdWeight: 0.8 },
  { heightCm: 75, medianWeight: 9.2, sdWeight: 0.89 },
  { heightCm: 80, medianWeight: 10.2, sdWeight: 0.99 },
  { heightCm: 85, medianWeight: 11.4, sdWeight: 1.1 },
  { heightCm: 90, medianWeight: 12.6, sdWeight: 1.22 },
  { heightCm: 95, medianWeight: 13.9, sdWeight: 1.35 },
  { heightCm: 100, medianWeight: 15.3, sdWeight: 1.5 },
  { heightCm: 105, medianWeight: 16.8, sdWeight: 1.66 },
  { heightCm: 110, medianWeight: 18.4, sdWeight: 1.84 },
  { heightCm: 115, medianWeight: 20.1, sdWeight: 2.04 },
  { heightCm: 120, medianWeight: 22.0, sdWeight: 2.25 },
];

// Helper interpolasi linier
function interpolateLinear(
  val: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): number {
  if (x1 === x0) return y0;
  return y0 + ((val - x0) / (x1 - x0)) * (y1 - y0);
}

// =========================================================================
// 1. HITUNG BMI (Body Mass Index)
// =========================================================================
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm || heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(2));
}

// =========================================================================
// 2. HITUNG HAZ (Height-for-Age Z-Score)
// =========================================================================
export function calculateHAZ(input: {
  sex: Gender;
  heightCm: number;
  ageYears?: number;
  ageMonths?: number;
}): number {
  const normSex =
    input.sex === 'female' || input.sex === 'PEREMPUAN' ? 'female' : 'male';
  const ageMonths =
    input.ageMonths !== undefined
      ? input.ageMonths
      : (input.ageYears ?? 25) * 12;

  // HAZ hanya berlaku klinis untuk anak & remaja (< 19 tahun / <= 216 bulan)
  if (ageMonths > 216) {
    return 0.0;
  }

  const table = normSex === 'female' ? WHO_HAZ_GIRLS : WHO_HAZ_BOYS;

  // Bound to table limits
  const clampedAge = Math.max(0, Math.min(216, ageMonths));

  let lower = table[0];
  let upper = table[table.length - 1];

  for (let i = 0; i < table.length - 1; i++) {
    if (
      clampedAge >= table[i].ageMonths &&
      clampedAge <= table[i + 1].ageMonths
    ) {
      lower = table[i];
      upper = table[i + 1];
      break;
    }
  }

  const median = interpolateLinear(
    clampedAge,
    lower.ageMonths,
    lower.median,
    upper.ageMonths,
    upper.median,
  );
  const sd = interpolateLinear(
    clampedAge,
    lower.ageMonths,
    lower.sd,
    upper.ageMonths,
    upper.sd,
  );

  if (sd <= 0) return 0.0;
  const z = (input.heightCm - median) / sd;
  return Number(z.toFixed(2));
}

// =========================================================================
// 3. HITUNG WHZ (Weight-for-Height Z-Score)
// =========================================================================
export function calculateWHZ(input: {
  sex: Gender;
  weightKg: number;
  heightCm: number;
  ageYears?: number;
}): number {
  const normSex =
    input.sex === 'female' || input.sex === 'PEREMPUAN' ? 'female' : 'male';
  const ageYears = input.ageYears ?? 25;

  // WHZ standar WHO diperuntukkan bagi anak balita & masa pertumbuhan (< 10 tahun / TB <= 120 cm)
  if (ageYears >= 10 || input.heightCm > 125) {
    return 0.0;
  }

  const table = normSex === 'female' ? WHO_WHZ_GIRLS : WHO_WHZ_BOYS;
  const clampedH = Math.max(45, Math.min(120, input.heightCm));

  let lower = table[0];
  let upper = table[table.length - 1];

  for (let i = 0; i < table.length - 1; i++) {
    if (clampedH >= table[i].heightCm && clampedH <= table[i + 1].heightCm) {
      lower = table[i];
      upper = table[i + 1];
      break;
    }
  }

  const medianWeight = interpolateLinear(
    clampedH,
    lower.heightCm,
    lower.medianWeight,
    upper.heightCm,
    upper.medianWeight,
  );
  const sdWeight = interpolateLinear(
    clampedH,
    lower.heightCm,
    lower.sdWeight,
    upper.heightCm,
    upper.sdWeight,
  );

  if (sdWeight <= 0) return 0.0;
  const z = (input.weightKg - medianWeight) / sdWeight;
  return Number(z.toFixed(2));
}

// =========================================================================
// 4. KLASIFIKASI INDEKS (WHO & KEMENKES RI)
// =========================================================================

export function classifyHAZ(haz: number): HAZResult {
  if (haz < -3.0) {
    return {
      haz,
      status: 'Sangat Pendek',
      label: 'Severely Stunted (Sangat Pendek)',
      isStunted: true,
    };
  }
  if (haz < -2.0) {
    return {
      haz,
      status: 'Pendek',
      label: 'Stunted (Pendek)',
      isStunted: true,
    };
  }
  if (haz <= 3.0) {
    return {
      haz,
      status: 'Normal',
      label: 'Normal',
      isStunted: false,
    };
  }
  return {
    haz,
    status: 'Tinggi',
    label: 'Tinggi',
    isStunted: false,
  };
}

export function classifyWHZ(whz: number): WHZResult {
  if (whz < -3.0) {
    return {
      whz,
      status: 'Gizi Buruk',
      label: 'Severely Wasted (Gizi Buruk)',
      isWasted: true,
      isOverweight: false,
    };
  }
  if (whz < -2.0) {
    return {
      whz,
      status: 'Gizi Kurang',
      label: 'Wasted (Gizi Kurang)',
      isWasted: true,
      isOverweight: false,
    };
  }
  if (whz <= 1.0) {
    return {
      whz,
      status: 'Gizi Baik',
      label: 'Normal (Gizi Baik)',
      isWasted: false,
      isOverweight: false,
    };
  }
  if (whz <= 2.0) {
    return {
      whz,
      status: 'Berisiko Gizi Lebih',
      label: 'Berisiko Gizi Lebih (Risk of Overweight)',
      isWasted: false,
      isOverweight: true,
    };
  }
  if (whz <= 3.0) {
    return {
      whz,
      status: 'Gizi Lebih',
      label: 'Overweight (Gizi Lebih)',
      isWasted: false,
      isOverweight: true,
    };
  }
  return {
    whz,
    status: 'Obesitas',
    label: 'Obese (Obesitas)',
    isWasted: false,
    isOverweight: true,
  };
}

export function classifyAdultBMI(bmi: number): BMIResult {
  if (bmi < 18.5) {
    return {
      bmi,
      status: 'Underweight',
      label: 'Underweight (Kekurangan berat badan)',
    };
  }
  if (bmi < 25.0) {
    return {
      bmi,
      status: 'Normal',
      label: 'Normal (Berat badan ideal)',
    };
  }
  if (bmi < 30.0) {
    return {
      bmi,
      status: 'Overweight',
      label: 'Overweight (Kelebihan berat badan)',
    };
  }
  return {
    bmi,
    status: 'Obese',
    label: 'Obese (Obesitas)',
  };
}

// =========================================================================
// 5. PENILAIAN STATUS NUTRISI LENGKAP (COMPREHENSIVE)
// =========================================================================
export function evaluateNutritionalAssessment(
  input: AnthropometricInput,
): ComprehensiveAssessment {
  const bmi = calculateBMI(input.weightKg, input.heightCm);
  const ageYears =
    input.ageYears !== undefined
      ? input.ageYears
      : input.ageMonths !== undefined
        ? input.ageMonths / 12
        : 25;
  const isAdult = ageYears >= 19;
  const isPregnant = Boolean(input.isPregnant);

  const interpretasi: string[] = [];

  // Kasus Ibu Hamil
  if (isPregnant) {
    interpretasi.push(
      `Status: Pemantauan Kehamilan. BMI awal/saat ini ${bmi.toFixed(1)} kg/m².`,
    );
    return {
      bmi,
      haz: 0.0,
      whz: 0.0,
      statusNutrisi: 'Pregnant (Monitoring)',
      bmiClassification: 'Pregnant (Monitoring)',
      isStunted: false,
      isWasted: false,
      isAdult,
      isPregnant: true,
      interpretasi,
    };
  }

  // Kasus Dewasa (>= 19 tahun)
  if (isAdult) {
    const bmiClass = classifyAdultBMI(bmi);
    interpretasi.push(
      `Indeks Massa Tubuh (BMI) ${bmi.toFixed(1)} kg/m²: ${bmiClass.label}.`,
    );
    return {
      bmi,
      haz: 0.0,
      whz: 0.0,
      statusNutrisi: bmiClass.status,
      bmiClassification: bmiClass.label,
      isStunted: false,
      isWasted: false,
      isAdult: true,
      isPregnant: false,
      interpretasi,
    };
  }

  // Kasus Anak & Remaja (< 19 tahun)
  const hazVal = calculateHAZ({
    sex: input.sex,
    heightCm: input.heightCm,
    ageYears,
    ageMonths: input.ageMonths,
  });
  const whzVal = calculateWHZ({
    sex: input.sex,
    weightKg: input.weightKg,
    heightCm: input.heightCm,
    ageYears,
  });

  const hazClass = classifyHAZ(hazVal);
  const whzClass = classifyWHZ(whzVal);

  if (hazClass.isStunted) {
    interpretasi.push(
      `Indikator TB/U (HAZ ${hazVal > 0 ? '+' : ''}${hazVal} SD): ${hazClass.label}.`,
    );
  }

  if (ageYears < 5 && whzVal !== 0) {
    interpretasi.push(
      `Indikator BB/TB (WHZ ${whzVal > 0 ? '+' : ''}${whzVal} SD): ${whzClass.label}.`,
    );
  }

  // Tentukan status nutrisi utama yang kompatibel dengan Prisma enum / UI
  let statusNutrisi = 'Normal';

  if (ageYears < 5 && whzVal !== 0) {
    // Balita < 5 tahun mengutamakan BB/TB (Wasting indicator)
    if (whzVal < -3.0)
      statusNutrisi = 'Underweight'; // Gizi Buruk
    else if (whzVal < -2.0)
      statusNutrisi = 'Underweight'; // Gizi Kurang
    else if (whzVal > 3.0) statusNutrisi = 'Obese';
    else if (whzVal > 2.0) statusNutrisi = 'Overweight';
    else if (hazClass.isStunted)
      statusNutrisi = 'Underweight'; // Stunted
    else statusNutrisi = 'Normal';
  } else {
    // Anak 5-18 tahun mengutamakan BMI-for-Age
    const bmiClass = classifyAdultBMI(bmi);
    statusNutrisi = bmiClass.status;
  }

  return {
    bmi,
    haz: hazVal,
    whz: whzVal,
    statusNutrisi,
    bmiClassification: classifyAdultBMI(bmi).label,
    hazClassification: hazClass.label,
    whzClassification: whzClass.label,
    isStunted: hazClass.isStunted,
    isWasted: whzClass.isWasted,
    isAdult: false,
    isPregnant: false,
    interpretasi,
  };
}
