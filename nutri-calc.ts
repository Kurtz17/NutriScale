/**
 * NutriScale - Nutrition Calorie Calculator (versi gabungan)
 *
 * Fungsi:
 * 1. calculateAdultCalories
 * 2. calculateChildCaloriesUnder3
 * 3. calculateChildCalories3to18
 * 4. calculatePregnancyCalories
 * 5. calculatePostoperativeCalories
 * 6. calculateMacros (AMDR menurut tahap kehidupan)
 * + getMacroLifeStage (helper menurunkan tahap kehidupan dari usia)
 */

export type Sex = 'male' | 'female';

export type ActivityLevel = 'inactive' | 'lowActive' | 'active' | 'veryActive';

export type EstimatedEnergy = {
  status: 'estimated';
  kcalPerDay: number;
  method: string;
  notes: string[];
};

export type ClinicalReviewRequired = {
  status: 'clinical_review_required';
  kcalPerDay: null;
  method: string;
  notes: string[];
};

export type EnergyResult = EstimatedEnergy | ClinicalReviewRequired;

export type PregnancyEstimate = EstimatedEnergy & {
  trimester: 1 | 2 | 3;
  gestationalWeeks: number;
  prePregnancyBmi: number;
  energyDepositionKcalPerDay: number;
};

export type MacroLifeStage =
  | 'infantUnder1'
  | 'toddler1to3'
  | 'child4to18'
  | 'adult19Plus'
  | 'pregnantAdolescent'
  | 'pregnantAdult'
  | 'custom';

export type MacroResult = {
  lifeStage: MacroLifeStage;
  calories: number;
  carbohydrates: { percent: number; grams: number };
  protein: { percent: number; grams: number };
  fat: { percent: number; grams: number };
  warnings: string[];
};

const VALIDATION_NOTE =
  'Persamaan DRI 2023 terutama didasarkan pada data AS/Kanada. Validasi terhadap acuan Indonesia (AKG) sebelum penggunaan produksi.';

// ======================================================
// VALIDASI INPUT
// ======================================================

function assertFinitePositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} harus berupa angka lebih besar dari 0.`);
  }
}

function assertRange(
  value: number,
  min: number,
  max: number,
  label: string,
): void {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${label} harus antara ${min} dan ${max}.`);
  }
}

function validateBody(
  ageYears: number,
  weightKg: number,
  heightCm: number,
): void {
  assertRange(ageYears, 0, 120, 'Usia (tahun)');
  assertRange(weightKg, 1, 400, 'Berat badan (kg)');
  assertRange(heightCm, 30, 250, 'Tinggi badan (cm)');
}

function makeEstimate(
  kcal: number,
  method: string,
  notes: string[] = [],
): EstimatedEnergy {
  if (!Number.isFinite(kcal) || kcal <= 0) {
    throw new Error(
      'Hasil estimasi kalori tidak valid. Periksa input dan metode.',
    );
  }

  return {
    status: 'estimated',
    kcalPerDay: Math.round(kcal),
    method,
    notes,
  };
}

// ======================================================
// 1. DEWASA SEHAT: HARRIS-BENEDICT 1984 × ACTIVITY FACTOR
// ======================================================

export function calculateAdultCalories(input: {
  sex: Sex;
  ageYears: number;
  weightKg: number;
  heightCm: number;
  activityFactor: number;
  isPregnantOrLactating?: boolean;
}): EstimatedEnergy & { bmrKcalPerDay: number } {
  const { sex, ageYears, weightKg, heightCm, activityFactor } = input;

  if (input.isPregnantOrLactating) {
    throw new Error(
      'Gunakan calculatePregnancyCalories untuk ibu hamil. Ibu menyusui memerlukan penilaian terpisah.',
    );
  }

  validateBody(ageYears, weightKg, heightCm);

  if (ageYears < 19) {
    throw new Error(
      'Usia di bawah 19 tahun harus menggunakan fungsi anak/remaja.',
    );
  }

  // Rentang umum Activity Factor: 1,2 (sangat sedikit gerak) s.d. ~2,4.
  assertRange(activityFactor, 1.0, 2.5, 'Activity Factor');

  const bmr =
    sex === 'male'
      ? 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYears
      : 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * ageYears;

  const result = makeEstimate(
    bmr * activityFactor,
    'Harris-Benedict revisi 1984 × Activity Factor',
    [
      'Estimasi untuk orang dewasa sehat yang tidak sedang hamil.',
      'Kategori ini memakai Harris-Benedict, berbeda dengan kategori lain yang memakai DRI 2023.',
    ],
  );

  return { ...result, bmrKcalPerDay: Math.round(bmr) };
}

// ======================================================
// 2. BAYI DAN BALITA: USIA 0 SAMPAI <3 TAHUN
// DRI 2023: EER = TEE + energi pertumbuhan
// ======================================================

function energyCostOfGrowthUnder3(sex: Sex, ageMonths: number): number {
  if (sex === 'male') {
    if (ageMonths < 3) return 200;
    if (ageMonths < 6) return 50;
    return 20; // 6 s.d. <36 bulan
  }

  if (ageMonths < 3) return 180;
  if (ageMonths < 6) return 60;
  if (ageMonths < 12) return 20;
  return 15; // 12 s.d. <36 bulan
}

export function calculateChildCaloriesUnder3(input: {
  sex: Sex;
  ageMonths: number;
  weightKg: number;
  heightCm: number;
}): EstimatedEnergy {
  const { sex, ageMonths, weightKg, heightCm } = input;

  if (!Number.isFinite(ageMonths) || ageMonths < 0 || ageMonths >= 36) {
    throw new Error('Usia harus 0 sampai kurang dari 36 bulan.');
  }

  const ageYears = ageMonths / 12;

  assertRange(weightKg, 1, 25, 'Berat badan (kg)');
  assertRange(heightCm, 30, 110, 'Panjang/tinggi badan (cm)');

  const tee =
    sex === 'male'
      ? -716.45 - ageYears + 17.82 * heightCm + 15.06 * weightKg
      : -69.15 + 80 * ageYears + 2.65 * heightCm + 54.15 * weightKg;

  const growth = energyCostOfGrowthUnder3(sex, ageMonths);

  return makeEstimate(tee + growth, 'DRI 2023 EER usia 0–<3 tahun', [
    'EER = TEE + energi pertumbuhan.',
    `Energi pertumbuhan: ${growth} kkal/hari.`,
    'Usia dikonversi dari bulan menjadi tahun; tinggi dalam cm, berat dalam kg.',
    VALIDATION_NOTE,
  ]);
}

// ======================================================
// 3. ANAK DAN REMAJA: USIA 3 SAMPAI <19 TAHUN
// DRI 2023: EER = TEE + energi pertumbuhan
// ======================================================

function energyCostOfGrowth3to18(sex: Sex, ageYears: number): number {
  if (ageYears < 4) return sex === 'male' ? 20 : 15; // usia 3 tahun
  if (ageYears < 9) return 15;
  if (ageYears < 14) return sex === 'male' ? 25 : 30;
  return 20; // 14 s.d. <19 tahun
}

export function calculateChildCalories3to18(input: {
  sex: Sex;
  ageYears: number;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
}): EstimatedEnergy {
  const { sex, ageYears, weightKg, heightCm, activityLevel } = input;

  if (!Number.isFinite(ageYears) || ageYears < 3 || ageYears >= 19) {
    throw new Error(
      'Fungsi ini hanya untuk usia 3 sampai kurang dari 19 tahun.',
    );
  }

  assertRange(weightKg, 5, 250, 'Berat badan (kg)');
  assertRange(heightCm, 60, 230, 'Tinggi badan (cm)');

  const a = ageYears;
  const w = weightKg;
  const h = heightCm;

  const equations: Record<ActivityLevel, number> =
    sex === 'male'
      ? {
          inactive: -447.51 + 3.68 * a + 13.01 * h + 13.15 * w,
          lowActive: 19.12 + 3.68 * a + 8.62 * h + 20.28 * w,
          active: -388.19 + 3.68 * a + 12.66 * h + 20.46 * w,
          veryActive: -671.75 + 3.68 * a + 15.38 * h + 23.25 * w,
        }
      : {
          inactive: 55.59 - 22.25 * a + 8.43 * h + 17.07 * w,
          lowActive: -297.54 - 22.25 * a + 12.77 * h + 14.73 * w,
          active: -189.55 - 22.25 * a + 11.74 * h + 18.34 * w,
          veryActive: -709.59 - 22.25 * a + 18.22 * h + 14.25 * w,
        };

  if (!(activityLevel in equations)) {
    throw new Error('Kategori aktivitas tidak valid.');
  }

  const growth = energyCostOfGrowth3to18(sex, ageYears);

  return makeEstimate(
    equations[activityLevel] + growth,
    'DRI 2023 EER anak dan remaja',
    [
      'EER = TEE + energi pertumbuhan.',
      `Energi pertumbuhan: ${growth} kkal/hari.`,
      'Kategori aktivitas mengikuti definisi persamaan DRI.',
      VALIDATION_NOTE,
    ],
  );
}

// ======================================================
// HELPER UNTUK PERHITUNGAN KEHAMILAN
// ======================================================

function calculateNonPregnantFemaleTEE2023(
  ageYears: number,
  heightCm: number,
  weightKg: number,
  activityLevel: ActivityLevel,
): number {
  const a = ageYears;
  const h = heightCm;
  const w = weightKg;

  const equations: Record<ActivityLevel, number> = {
    inactive: 584.9 - 7.01 * a + 5.72 * h + 11.71 * w,
    lowActive: 575.77 - 7.01 * a + 6.6 * h + 12.14 * w,
    active: 710.25 - 7.01 * a + 6.54 * h + 12.34 * w,
    veryActive: 511.83 - 7.01 * a + 9.07 * h + 12.56 * w,
  };

  return equations[activityLevel];
}

// ======================================================
// 4. IBU HAMIL: ESTIMASI EER DRI 2023
// Trimester 1: persamaan perempuan nonhamil, tanpa deposisi
// Trimester 2-3: TEE kehamilan + deposisi menurut BMI pra-hamil
// ======================================================

export function calculatePregnancyCalories(input: {
  ageYears: number;
  heightCm: number;
  currentWeightKg: number;
  prePregnancyWeightKg: number;
  gestationalWeeks: number;
  activityLevel: ActivityLevel;
}): PregnancyEstimate | ClinicalReviewRequired {
  const {
    ageYears,
    heightCm,
    currentWeightKg,
    prePregnancyWeightKg,
    gestationalWeeks,
    activityLevel,
  } = input;

  validateBody(ageYears, currentWeightKg, heightCm);
  assertRange(prePregnancyWeightKg, 20, 400, 'Berat sebelum hamil (kg)');

  if (
    !Number.isFinite(gestationalWeeks) ||
    gestationalWeeks < 0 ||
    gestationalWeeks > 42
  ) {
    throw new Error('Usia kehamilan harus berada antara 0 dan 42 minggu.');
  }

  if (ageYears < 19) {
    return {
      status: 'clinical_review_required',
      kcalPerDay: null,
      method: 'Kehamilan remaja: penilaian individual',
      notes: [
        'Persamaan kehamilan dalam kalkulator ini ditujukan untuk perempuan dewasa (19 tahun ke atas).',
        'Remaja hamil masih tumbuh sehingga kebutuhan energi perlu ditentukan oleh dokter atau ahli gizi.',
      ],
    };
  }

  const prePregnancyBmi = prePregnancyWeightKg / Math.pow(heightCm / 100, 2);
  const trimester: 1 | 2 | 3 =
    gestationalWeeks < 14 ? 1 : gestationalWeeks < 28 ? 2 : 3;

  // TRIMESTER 1: persamaan perempuan nonhamil, berat pra-hamil,
  // energi deposisi diabaikan.
  if (trimester === 1) {
    const tee = calculateNonPregnantFemaleTEE2023(
      ageYears,
      heightCm,
      prePregnancyWeightKg,
      activityLevel,
    );

    const result = makeEstimate(
      tee,
      'DRI 2023 TEE perempuan nonhamil, trimester pertama',
      [
        'Trimester 1: memakai persamaan perempuan nonhamil dan berat sebelum kehamilan.',
        'Energi deposisi diabaikan pada trimester pertama (0 kkal/hari).',
        `BMI sebelum kehamilan: ${prePregnancyBmi.toFixed(2)}.`,
        VALIDATION_NOTE,
      ],
    );

    return {
      ...result,
      trimester,
      gestationalWeeks,
      prePregnancyBmi: Number(prePregnancyBmi.toFixed(2)),
      energyDepositionKcalPerDay: 0,
    };
  }

  // TRIMESTER 2 DAN 3: persamaan TEE kehamilan memakai berat saat ini
  // dan usia gestasi, lalu ditambah energi deposisi/mobilisasi berdasarkan
  // BMI sebelum kehamilan (DRI 2023, Table 5-17).
  const energyDeposition =
    prePregnancyBmi < 18.5
      ? 300 // underweight
      : prePregnancyBmi < 25
        ? 200 // normal weight
        : prePregnancyBmi < 30
          ? 150 // overweight
          : -50; // obesity: energy mobilization

  const a = ageYears;
  const h = heightCm;
  const w = currentWeightKg;
  const g = gestationalWeeks;

  const teeEquations: Record<ActivityLevel, number> = {
    inactive: 1131.2 - 2.04 * a + 0.34 * h + 12.15 * w + 9.16 * g,
    lowActive: 693.35 - 2.04 * a + 5.73 * h + 10.2 * w + 9.16 * g,
    active: -223.84 - 2.04 * a + 13.23 * h + 8.15 * w + 9.16 * g,
    veryActive: -779.72 - 2.04 * a + 18.45 * h + 8.73 * w + 9.16 * g,
  };

  const result = makeEstimate(
    teeEquations[activityLevel] + energyDeposition,
    `DRI 2023 EER kehamilan trimester ${trimester}`,
    [
      `Trimester ${trimester}: memakai berat badan saat ini dan usia gestasi dalam minggu.`,
      `BMI sebelum kehamilan: ${prePregnancyBmi.toFixed(2)}.`,
      `Energi deposisi/mobilisasi berdasarkan BMI pra-hamil: ${energyDeposition} kkal/hari.`,
      `Batas trimester: ${trimester === 2 ? '14 sampai kurang dari 28 minggu' : '28 sampai 42 minggu'}.`,
      VALIDATION_NOTE,
    ],
  );

  return {
    ...result,
    trimester,
    gestationalWeeks,
    prePregnancyBmi: Number(prePregnancyBmi.toFixed(2)),
    energyDepositionKcalPerDay: energyDeposition,
  };
}

// ======================================================
// 5. PASCAOPERASI: TIDAK MENGHASILKAN TARGET OTOMATIS
// ======================================================

export function calculatePostoperativeCalories(): ClinicalReviewRequired {
  return {
    status: 'clinical_review_required',
    kcalPerDay: null,
    method: 'Penilaian individual oleh dokter atau ahli gizi',
    notes: [
      'Kebutuhan energi bergantung pada jenis operasi, komplikasi, status gizi, dan fase pemulihan.',
      'Jangan menerapkan injury factor generik.',
      'Ikuti instruksi tim kesehatan yang menangani pengguna.',
    ],
  };
}

// ======================================================
// 6. KONVERSI KALORI KE GRAM MAKRO
// ======================================================

/**
 * AMDR (persen dari total energi), berdasarkan IOM/National Academies:
 * - Balita 1-3 th: karbohidrat 45-65%, protein 5-20%, lemak 30-40%.
 * - Anak/remaja 4-18 th: karbohidrat 45-65%, protein 10-30%, lemak 25-35%.
 * - Dewasa 19+ th: karbohidrat 45-65%, protein 10-35%, lemak 20-35%.
 * - Bayi <1 th: tidak ada AMDR (kebutuhan memakai AI dari ASI/formula).
 * - Kehamilan: tidak ada AMDR khusus; mengikuti rentang usia.
 */
type MacroBounds = {
  carbohydrates: { min: number; max: number };
  protein: { min: number; max: number };
  fat: { min: number; max: number };
};

const MACRO_AMDR: Partial<Record<MacroLifeStage, MacroBounds>> = {
  toddler1to3: {
    carbohydrates: { min: 45, max: 65 },
    protein: { min: 5, max: 20 },
    fat: { min: 30, max: 40 },
  },
  child4to18: {
    carbohydrates: { min: 45, max: 65 },
    protein: { min: 10, max: 30 },
    fat: { min: 25, max: 35 },
  },
  adult19Plus: {
    carbohydrates: { min: 45, max: 65 },
    protein: { min: 10, max: 35 },
    fat: { min: 20, max: 35 },
  },
  pregnantAdolescent: {
    carbohydrates: { min: 45, max: 65 },
    protein: { min: 10, max: 30 },
    fat: { min: 25, max: 35 },
  },
  pregnantAdult: {
    carbohydrates: { min: 45, max: 65 },
    protein: { min: 10, max: 35 },
    fat: { min: 20, max: 35 },
  },
};

const DEFAULT_MACROS: Partial<
  Record<MacroLifeStage, { carbs: number; protein: number; fat: number }>
> = {
  toddler1to3: { carbs: 50, protein: 15, fat: 35 },
  child4to18: { carbs: 55, protein: 15, fat: 30 },
  adult19Plus: { carbs: 50, protein: 20, fat: 30 },
  pregnantAdolescent: { carbs: 55, protein: 20, fat: 25 },
  pregnantAdult: { carbs: 50, protein: 20, fat: 30 },
};

const MACRO_LIFE_STAGES: readonly MacroLifeStage[] = [
  'infantUnder1',
  'toddler1to3',
  'child4to18',
  'adult19Plus',
  'pregnantAdolescent',
  'pregnantAdult',
  'custom',
];

/** Helper: turunkan tahap kehidupan makro dari usia agar tidak salah pasang. */
export function getMacroLifeStage(input: {
  ageYears: number;
  isPregnant?: boolean;
}): MacroLifeStage {
  const { ageYears, isPregnant } = input;
  assertRange(ageYears, 0, 120, 'Usia (tahun)');

  if (isPregnant) return ageYears < 19 ? 'pregnantAdolescent' : 'pregnantAdult';
  if (ageYears < 1) return 'infantUnder1';
  if (ageYears < 4) return 'toddler1to3';
  if (ageYears < 19) return 'child4to18';
  return 'adult19Plus';
}

export function calculateMacros(input: {
  calories: number;
  lifeStage: MacroLifeStage;
  carbohydratesPercent?: number;
  proteinPercent?: number;
  fatPercent?: number;
}): MacroResult {
  assertFinitePositive(input.calories, 'Target kalori');

  const lifeStage = input.lifeStage;
  if (!MACRO_LIFE_STAGES.includes(lifeStage)) {
    throw new Error('Kategori lifeStage untuk makro tidak valid.');
  }

  const calories = Math.round(input.calories);

  const supplied = [
    input.carbohydratesPercent,
    input.proteinPercent,
    input.fatPercent,
  ];
  const allOmitted = supplied.every((v) => v === undefined);
  const anyOmitted = supplied.some((v) => v === undefined);

  if (!allOmitted && anyOmitted) {
    throw new Error(
      'Masukkan ketiga persentase makro, atau kosongkan semuanya untuk memakai default kategori.',
    );
  }

  let carbs: number;
  let protein: number;
  let fat: number;

  if (allOmitted) {
    const defaults = DEFAULT_MACROS[lifeStage];
    if (!defaults) {
      throw new Error(
        `Kategori ${lifeStage} tidak punya default; masukkan ketiga persentase makro secara eksplisit.`,
      );
    }
    carbs = defaults.carbs;
    protein = defaults.protein;
    fat = defaults.fat;
  } else {
    carbs = input.carbohydratesPercent!;
    protein = input.proteinPercent!;
    fat = input.fatPercent!;
  }

  for (const [label, value] of [
    ['Karbohidrat', carbs],
    ['Protein', protein],
    ['Lemak', fat],
  ] as const) {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      throw new Error(`Persentase ${label} harus antara 0 dan 100.`);
    }
  }

  if (Math.abs(carbs + protein + fat - 100) > 0.01) {
    throw new Error('Total persentase makronutrien harus 100%.');
  }

  // Di luar AMDR = peringatan, bukan penolakan (rencana klinis bisa sengaja
  // menyimpang).
  const warnings: string[] = [];
  const bounds = MACRO_AMDR[lifeStage];

  if (bounds) {
    const check = (
      label: string,
      value: number,
      range: { min: number; max: number },
    ) => {
      if (value < range.min || value > range.max) {
        warnings.push(
          `${label} ${value}% di luar rentang AMDR ${range.min}–${range.max}% untuk kategori ini.`,
        );
      }
    };
    check('Karbohidrat', carbs, bounds.carbohydrates);
    check('Protein', protein, bounds.protein);
    check('Lemak', fat, bounds.fat);
  } else if (lifeStage === 'infantUnder1') {
    warnings.push(
      'Bayi <1 tahun tidak memiliki AMDR; kebutuhan makro mengikuti AI dari ASI/formula. Konsultasikan dengan tenaga kesehatan.',
    );
  } else {
    warnings.push('Kategori custom: rentang AMDR tidak diperiksa.');
  }

  return {
    lifeStage,
    calories,
    carbohydrates: {
      percent: carbs,
      grams: Number(((calories * carbs) / 100 / 4).toFixed(1)),
    },
    protein: {
      percent: protein,
      grams: Number(((calories * protein) / 100 / 4).toFixed(1)),
    },
    fat: {
      percent: fat,
      grams: Number(((calories * fat) / 100 / 9).toFixed(1)),
    },
    warnings,
  };
}
