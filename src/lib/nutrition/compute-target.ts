/**
 * NutriScale - Target Nutrition Calculation Service
 *
 * Menghubungkan kalkulasi gizi deterministik dari `nutri-calc.ts` ke dalam
 * seluruh alur NutriScale (Health Assessment, Dashboard, Produk/Marketplace).
 *
 * ATURAN:
 * 1. Menghitung sendiri target kalori, karbohidrat, protein, dan lemak tanpa AI API.
 * 2. Anjuran kalori dokter menjadi PRIORITAS utama apabila ada.
 * 3. Menghitung BMI dan status gizi (WHO/CDC) secara lokal.
 */
import {
  type ActivityLevel,
  type MacroLifeStage,
  type Sex,
  calculateAdultCalories,
  calculateChildCalories3to18,
  calculateChildCaloriesUnder3,
  calculateMacros,
  calculatePostoperativeCalories,
  calculatePregnancyCalories,
  getMacroLifeStage,
} from '../../../nutri-calc';
import {
  type ComprehensiveAssessment,
  calculateBMI,
  calculateHAZ,
  calculateWHZ,
  evaluateNutritionalAssessment,
} from './nutritional-assessment';

export interface ComputeNutritionInput {
  sex: 'male' | 'female' | 'LAKI_LAKI' | 'PEREMPUAN';
  ageYears?: number;
  ageMonths?: number;
  weightKg: number;
  heightCm: number;
  category?:
    | 'umum'
    | 'balita'
    | 'ibu_hamil'
    | 'pasca_operasi'
    | 'UMUM'
    | 'ANAK_BALITA'
    | 'IBU_HAMIL'
    | 'PASCA_OPERASI'
    | string;
  activityFactor?: number;
  activityLevel?: ActivityLevel;
  gestationalWeeks?: number;
  prePregnancyWeightKg?: number;
  anjuranKaloriDokter?: number | null;
  isPregnantOrLactating?: boolean;
}

export interface NutritionTargetResult {
  status: 'estimated' | 'clinical_review_required';
  calories: number;
  method: string;
  notes: string[];
  warnings: string[];
  lifeStage: MacroLifeStage;
  carbohydrates: { percent: number; grams: number };
  protein: { percent: number; grams: number };
  fat: { percent: number; grams: number };
  isDoctorPrescription: boolean;
  bmi: number;
  statusNutrisi: string;
  haz: number;
  whz: number;
}

const CHILD_BMI_MEDIAN: Record<number, number> = {
  2: 16.4,
  3: 15.9,
  4: 15.6,
  5: 15.5,
  6: 15.5,
  7: 15.7,
  8: 15.9,
  9: 16.3,
  10: 16.7,
  11: 17.2,
  12: 17.7,
  13: 18.4,
  14: 19.0,
  15: 19.6,
  16: 20.2,
  17: 20.7,
  18: 21.2,
};

export function resolveActivityLevel(
  factorOrLevel?: number | ActivityLevel | string,
): ActivityLevel {
  if (typeof factorOrLevel === 'string') {
    const lower = factorOrLevel.toLowerCase();
    if (lower === 'inactive' || lower === 'sedentary') return 'inactive';
    if (lower === 'lowactive' || lower === 'light' || lower === 'ringan')
      return 'lowActive';
    if (lower === 'active' || lower === 'moderate' || lower === 'sedang')
      return 'active';
    if (
      lower === 'veryactive' ||
      lower === 'heavy' ||
      lower === 'berat' ||
      lower === 'sangat_berat'
    )
      return 'veryActive';
  }

  if (typeof factorOrLevel === 'number') {
    if (factorOrLevel <= 1.25) return 'inactive';
    if (factorOrLevel <= 1.45) return 'lowActive';
    if (factorOrLevel <= 1.65) return 'active';
    return 'veryActive';
  }

  return 'lowActive';
}

export {
  evaluateNutritionalAssessment,
  calculateBMI,
  calculateHAZ,
  calculateWHZ,
};

export function assessNutritionalStatus(
  ageYears: number,
  bmi: number,
  isPregnant?: boolean,
): { statusNutrisi: string; haz: number; whz: number } {
  const assessment = evaluateNutritionalAssessment({
    sex: 'male',
    weightKg: 60,
    heightCm: Math.sqrt(60 / (bmi || 22)) * 100,
    ageYears,
    isPregnant,
  });
  return {
    statusNutrisi: assessment.statusNutrisi,
    haz: assessment.haz,
    whz: assessment.whz,
  };
}

/**
 * Fungsi Utama: Menghitung target kalori dan makronutrien sesuai kondisi pengguna.
 */
export function computeTargetNutrition(
  input: ComputeNutritionInput,
): NutritionTargetResult {
  const normSex: Sex =
    input.sex === 'PEREMPUAN' || input.sex === 'female' ? 'female' : 'male';
  const weightKg = Number(input.weightKg) || 60;
  const heightCm = Number(input.heightCm) || 165;

  // Normalisasi kategori
  const cat = (input.category || 'UMUM').toLowerCase();
  const isBalitaCategory = cat === 'balita' || cat === 'anak_balita';
  const isPregnantCategory = cat === 'ibu_hamil';
  const isPostOpCategory = cat === 'pasca_operasi';

  // Usia:
  const ageYears =
    input.ageYears !== undefined && input.ageYears !== null
      ? Number(input.ageYears)
      : 25;

  let ageMonths = input.ageMonths;
  // Jika usia < 3 tahun dan ageMonths belum ada, hitung dari ageYears * 12
  if (ageMonths === undefined && ageYears < 3) {
    ageMonths = Math.round(ageYears * 12);
  }

  const nutStatus = evaluateNutritionalAssessment({
    sex: normSex,
    weightKg,
    heightCm,
    ageYears,
    ageMonths,
    isPregnant: isPregnantCategory,
  });
  const bmi = nutStatus.bmi;

  const resolvedActivityLevel =
    input.activityLevel ||
    resolveActivityLevel(input.activityFactor || 'lowActive');

  // =========================================================================
  // 1. PRIORITAS TERTINGGI: ANJURAN KALORI DOKTER
  // =========================================================================
  if (
    input.anjuranKaloriDokter !== undefined &&
    input.anjuranKaloriDokter !== null &&
    Number(input.anjuranKaloriDokter) > 0
  ) {
    const calories = Math.round(Number(input.anjuranKaloriDokter));
    const lifeStage = getMacroLifeStage({
      ageYears,
      isPregnant: isPregnantCategory,
    });

    let macros;
    if (lifeStage === 'infantUnder1') {
      macros = calculateMacros({
        calories,
        lifeStage,
        carbohydratesPercent: 45,
        proteinPercent: 10,
        fatPercent: 45,
      });
    } else {
      macros = calculateMacros({ calories, lifeStage });
    }

    return {
      status: 'estimated',
      calories,
      method: 'Anjuran Kalori Dokter',
      notes: [
        'Kebutuhan kalori ditentukan langsung berdasarkan anjuran dokter atau resep klinis.',
        'Distribusi makronutrien disesuaikan dengan tahapan kehidupan.',
      ],
      warnings: macros.warnings,
      lifeStage: macros.lifeStage,
      carbohydrates: macros.carbohydrates,
      protein: macros.protein,
      fat: macros.fat,
      isDoctorPrescription: true,
      bmi,
      statusNutrisi: nutStatus.statusNutrisi,
      haz: nutStatus.haz,
      whz: nutStatus.whz,
    };
  }

  // =========================================================================
  // 2. KATEGORI PASCA OPERASI (Tanpa Anjuran Dokter -> Tinjauan Klinis)
  // =========================================================================
  if (isPostOpCategory) {
    const postOp = calculatePostoperativeCalories();
    const lifeStage = getMacroLifeStage({ ageYears });

    return {
      status: 'clinical_review_required',
      calories: 0,
      method: postOp.method,
      notes: postOp.notes,
      warnings: [
        'Kebutuhan energi pasca operasi bergantung pada jenis operasi dan fase pemulihan.',
        'Silakan masukkan target kalori anjuran dokter atau konsultasikan dengan tim kesehatan.',
      ],
      lifeStage,
      carbohydrates: { percent: 0, grams: 0 },
      protein: { percent: 0, grams: 0 },
      fat: { percent: 0, grams: 0 },
      isDoctorPrescription: false,
      bmi,
      statusNutrisi: nutStatus.statusNutrisi,
      haz: nutStatus.haz,
      whz: nutStatus.whz,
    };
  }

  // =========================================================================
  // 3. KATEGORI IBU HAMIL (DRI 2023)
  // =========================================================================
  if (isPregnantCategory) {
    const weeks = Math.min(42, Math.max(1, input.gestationalWeeks ?? 12));
    const prePregnancyWeight =
      input.prePregnancyWeightKg && input.prePregnancyWeightKg >= 20
        ? input.prePregnancyWeightKg
        : weightKg;

    const pregResult = calculatePregnancyCalories({
      ageYears,
      heightCm,
      currentWeightKg: weightKg,
      prePregnancyWeightKg: prePregnancyWeight,
      gestationalWeeks: weeks,
      activityLevel: resolvedActivityLevel,
    });

    if (pregResult.status === 'clinical_review_required') {
      return {
        status: 'clinical_review_required',
        calories: 0,
        method: pregResult.method,
        notes: pregResult.notes,
        warnings: [
          'Remaja hamil masih bertumbuh sehingga kebutuhan energi perlu ditentukan langsung oleh dokter/ahli gizi.',
        ],
        lifeStage: 'pregnantAdolescent',
        carbohydrates: { percent: 0, grams: 0 },
        protein: { percent: 0, grams: 0 },
        fat: { percent: 0, grams: 0 },
        isDoctorPrescription: false,
        bmi,
        statusNutrisi: nutStatus.statusNutrisi,
        haz: nutStatus.haz,
        whz: nutStatus.whz,
      };
    }

    const lifeStage = getMacroLifeStage({ ageYears, isPregnant: true });
    const macros = calculateMacros({
      calories: pregResult.kcalPerDay,
      lifeStage,
    });

    return {
      status: 'estimated',
      calories: pregResult.kcalPerDay,
      method: pregResult.method,
      notes: pregResult.notes,
      warnings: macros.warnings,
      lifeStage: macros.lifeStage,
      carbohydrates: macros.carbohydrates,
      protein: macros.protein,
      fat: macros.fat,
      isDoctorPrescription: false,
      bmi,
      statusNutrisi: nutStatus.statusNutrisi,
      haz: nutStatus.haz,
      whz: nutStatus.whz,
    };
  }

  // =========================================================================
  // 4. BAYI & BALITA: USIA 0 SAMPAI <3 TAHUN (DRI 2023)
  // =========================================================================
  if (
    ageYears < 3 ||
    (ageMonths !== undefined && ageMonths >= 0 && ageMonths < 36)
  ) {
    const months = Math.min(
      35.9,
      Math.max(0, ageMonths !== undefined ? ageMonths : ageYears * 12),
    );
    const validWeight = Math.min(25, Math.max(1, weightKg));
    const validHeight = Math.min(110, Math.max(30, heightCm));

    const childUnder3 = calculateChildCaloriesUnder3({
      sex: normSex,
      ageMonths: months,
      weightKg: validWeight,
      heightCm: validHeight,
    });

    const lifeStage = getMacroLifeStage({ ageYears: months / 12 });
    let macros;
    if (lifeStage === 'infantUnder1') {
      macros = calculateMacros({
        calories: childUnder3.kcalPerDay,
        lifeStage,
        carbohydratesPercent: 45,
        proteinPercent: 10,
        fatPercent: 45,
      });
    } else {
      macros = calculateMacros({
        calories: childUnder3.kcalPerDay,
        lifeStage,
      });
    }

    return {
      status: 'estimated',
      calories: childUnder3.kcalPerDay,
      method: childUnder3.method,
      notes: childUnder3.notes,
      warnings: macros.warnings,
      lifeStage: macros.lifeStage,
      carbohydrates: macros.carbohydrates,
      protein: macros.protein,
      fat: macros.fat,
      isDoctorPrescription: false,
      bmi,
      statusNutrisi: nutStatus.statusNutrisi,
      haz: nutStatus.haz,
      whz: nutStatus.whz,
    };
  }

  // =========================================================================
  // 5. ANAK DAN REMAJA: USIA 3 SAMPAI <19 TAHUN (DRI 2023)
  // =========================================================================
  if (ageYears < 19) {
    const validWeight = Math.min(250, Math.max(5, weightKg));
    const validHeight = Math.min(230, Math.max(60, heightCm));

    const child3to18 = calculateChildCalories3to18({
      sex: normSex,
      ageYears: Math.min(18.9, Math.max(3, ageYears)),
      weightKg: validWeight,
      heightCm: validHeight,
      activityLevel: resolvedActivityLevel,
    });

    const lifeStage = getMacroLifeStage({ ageYears });
    const macros = calculateMacros({
      calories: child3to18.kcalPerDay,
      lifeStage,
    });

    return {
      status: 'estimated',
      calories: child3to18.kcalPerDay,
      method: child3to18.method,
      notes: child3to18.notes,
      warnings: macros.warnings,
      lifeStage: macros.lifeStage,
      carbohydrates: macros.carbohydrates,
      protein: macros.protein,
      fat: macros.fat,
      isDoctorPrescription: false,
      bmi,
      statusNutrisi: nutStatus.statusNutrisi,
      haz: nutStatus.haz,
      whz: nutStatus.whz,
    };
  }

  // =========================================================================
  // 6. DEWASA SEHAT >= 19 TAHUN (Harris-Benedict 1984 x Activity Factor)
  // =========================================================================
  const actFactor = Math.min(2.5, Math.max(1.0, input.activityFactor || 1.2));
  const adult = calculateAdultCalories({
    sex: normSex,
    ageYears: Math.min(120, Math.max(19, ageYears)),
    weightKg: Math.min(400, Math.max(1, weightKg)),
    heightCm: Math.min(250, Math.max(30, heightCm)),
    activityFactor: actFactor,
    isPregnantOrLactating: input.isPregnantOrLactating ?? false,
  });

  const lifeStage = getMacroLifeStage({ ageYears });
  const macros = calculateMacros({
    calories: adult.kcalPerDay,
    lifeStage,
  });

  return {
    status: 'estimated',
    calories: adult.kcalPerDay,
    method: adult.method,
    notes: adult.notes,
    warnings: macros.warnings,
    lifeStage: macros.lifeStage,
    carbohydrates: macros.carbohydrates,
    protein: macros.protein,
    fat: macros.fat,
    isDoctorPrescription: false,
    bmi,
    statusNutrisi: nutStatus.statusNutrisi,
    haz: nutStatus.haz,
    whz: nutStatus.whz,
  };
}
