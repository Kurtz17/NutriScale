import { describe, expect, it } from 'vitest';

import {
  type ActivityLevel,
  type ClinicalReviewRequired,
  type PregnancyEstimate,
  calculateAdultCalories,
  calculateChildCalories3to18,
  calculateChildCaloriesUnder3,
  calculateMacros,
  calculatePostoperativeCalories,
  calculatePregnancyCalories,
  getMacroLifeStage,
} from './nutri-calc';

// Nilai harapan dihitung manual dari persamaan DRI 2023 / Harris-Benedict,
// terpisah dari implementasi.

/** Helper: pastikan hasil kehamilan berupa estimasi, lalu kembalikan. */
function asEstimate(
  r: PregnancyEstimate | ClinicalReviewRequired,
): PregnancyEstimate {
  if (r.status !== 'estimated') {
    throw new Error('Hasil seharusnya estimasi, bukan tinjauan klinis.');
  }
  return r;
}

// ======================================================
// 1. DEWASA
// ======================================================
describe('calculateAdultCalories', () => {
  it('menghitung pria dewasa (Harris-Benedict 1984)', () => {
    const r = calculateAdultCalories({
      sex: 'male',
      ageYears: 30,
      weightKg: 70,
      heightCm: 175,
      activityFactor: 1.55,
    });
    expect(r.bmrKcalPerDay).toBe(1696);
    expect(r.kcalPerDay).toBe(2628);
    expect(r.status).toBe('estimated');
  });

  it('menghitung wanita dewasa', () => {
    const r = calculateAdultCalories({
      sex: 'female',
      ageYears: 30,
      weightKg: 60,
      heightCm: 165,
      activityFactor: 1.2,
    });
    expect(r.bmrKcalPerDay).toBe(1384);
    expect(r.kcalPerDay).toBe(1660);
  });

  it('menerima usia tepat 19 tahun dan menolak 18,99', () => {
    const base = {
      sex: 'male' as const,
      weightKg: 60,
      heightCm: 170,
      activityFactor: 1.4,
    };
    expect(() =>
      calculateAdultCalories({ ...base, ageYears: 19 }),
    ).not.toThrow();
    expect(() => calculateAdultCalories({ ...base, ageYears: 18.99 })).toThrow(
      /di bawah 19/,
    );
  });

  it('menolak Activity Factor di luar 1,0-2,5', () => {
    const base = {
      sex: 'male' as const,
      ageYears: 30,
      weightKg: 70,
      heightCm: 175,
    };
    expect(() =>
      calculateAdultCalories({ ...base, activityFactor: 100 }),
    ).toThrow(/Activity Factor/);
    expect(() =>
      calculateAdultCalories({ ...base, activityFactor: 0.5 }),
    ).toThrow(/Activity Factor/);
  });

  it('menolak ibu hamil/menyusui', () => {
    expect(() =>
      calculateAdultCalories({
        sex: 'female',
        ageYears: 30,
        weightKg: 60,
        heightCm: 160,
        activityFactor: 1.4,
        isPregnantOrLactating: true,
      }),
    ).toThrow(/calculatePregnancyCalories/);
  });

  it('menolak input tidak valid', () => {
    const base = {
      sex: 'male' as const,
      ageYears: 30,
      weightKg: 70,
      heightCm: 175,
      activityFactor: 1.5,
    };
    expect(() => calculateAdultCalories({ ...base, weightKg: NaN })).toThrow();
    expect(() => calculateAdultCalories({ ...base, weightKg: -5 })).toThrow();
    expect(() => calculateAdultCalories({ ...base, heightCm: 0 })).toThrow();
    expect(() =>
      calculateAdultCalories({ ...base, ageYears: Infinity }),
    ).toThrow();
  });
});

// ======================================================
// 2. USIA 0 - <3 TAHUN
// ======================================================
describe('calculateChildCaloriesUnder3', () => {
  it('laki-laki 6 bulan (TEE + 20)', () => {
    const r = calculateChildCaloriesUnder3({
      sex: 'male',
      ageMonths: 6,
      weightKg: 7.5,
      heightCm: 67,
    });
    expect(r.kcalPerDay).toBe(610);
  });

  it('laki-laki 2 bulan (TEE + 200)', () => {
    const r = calculateChildCaloriesUnder3({
      sex: 'male',
      ageMonths: 2,
      weightKg: 5,
      heightCm: 58,
    });
    expect(r.kcalPerDay).toBe(592);
  });

  it('perempuan 24 bulan (TEE + 15)', () => {
    const r = calculateChildCaloriesUnder3({
      sex: 'female',
      ageMonths: 24,
      weightKg: 12,
      heightCm: 86,
    });
    expect(r.kcalPerDay).toBe(984);
  });

  it('perempuan: energi pertumbuhan 20 pada 11 bulan, 15 pada 12 bulan', () => {
    const f11 = calculateChildCaloriesUnder3({
      sex: 'female',
      ageMonths: 11,
      weightKg: 8,
      heightCm: 70,
    });
    const f12 = calculateChildCaloriesUnder3({
      sex: 'female',
      ageMonths: 12,
      weightKg: 9,
      heightCm: 74,
    });
    expect(f11.kcalPerDay).toBe(643);
    expect(f12.kcalPerDay).toBe(709);
    expect(f11.notes.join(' ')).toContain('20 kkal/hari');
    expect(f12.notes.join(' ')).toContain('15 kkal/hari');
  });

  it('memakai energi pertumbuhan sesuai batas 3 dan 6 bulan', () => {
    const growth = (sex: 'male' | 'female', months: number) => {
      const r = calculateChildCaloriesUnder3({
        sex,
        ageMonths: months,
        weightKg: 6,
        heightCm: 62,
      });
      const m = r.notes.join(' ').match(/pertumbuhan: (\d+) kkal/);
      return Number(m?.[1]);
    };
    expect(growth('male', 2.99)).toBe(200);
    expect(growth('male', 3)).toBe(50);
    expect(growth('male', 5.99)).toBe(50);
    expect(growth('male', 6)).toBe(20);
    expect(growth('female', 2.99)).toBe(180);
    expect(growth('female', 3)).toBe(60);
    expect(growth('female', 6)).toBe(20);
  });

  it('menerima 0 dan 35,99 bulan; menolak 36 bulan dan negatif', () => {
    const base = { sex: 'male' as const, weightKg: 8, heightCm: 70 };
    expect(() =>
      calculateChildCaloriesUnder3({ ...base, ageMonths: 0 }),
    ).not.toThrow();
    expect(() =>
      calculateChildCaloriesUnder3({ ...base, ageMonths: 35.99 }),
    ).not.toThrow();
    expect(() =>
      calculateChildCaloriesUnder3({ ...base, ageMonths: 36 }),
    ).toThrow(/0 sampai kurang dari 36/);
    expect(() =>
      calculateChildCaloriesUnder3({ ...base, ageMonths: -1 }),
    ).toThrow();
  });

  it('menolak berat tidak masuk akal untuk bayi (40 kg)', () => {
    expect(() =>
      calculateChildCaloriesUnder3({
        sex: 'male',
        ageMonths: 6,
        weightKg: 40,
        heightCm: 67,
      }),
    ).toThrow(/Berat badan/);
  });
});

// ======================================================
// 3. USIA 3 - <19 TAHUN
// ======================================================
describe('calculateChildCalories3to18', () => {
  it('laki-laki 15 tahun aktif (TEE + 20)', () => {
    const r = calculateChildCalories3to18({
      sex: 'male',
      ageYears: 15,
      weightKg: 66,
      heightCm: 170,
      activityLevel: 'active',
    });
    expect(r.kcalPerDay).toBe(3190);
  });

  it('laki-laki 3 tahun inaktif (TEE + 20)', () => {
    const r = calculateChildCalories3to18({
      sex: 'male',
      ageYears: 3,
      weightKg: 14,
      heightCm: 95,
      activityLevel: 'inactive',
    });
    expect(r.kcalPerDay).toBe(1004);
  });

  it('perempuan 10 tahun low active (TEE + 30)', () => {
    const r = calculateChildCalories3to18({
      sex: 'female',
      ageYears: 10,
      weightKg: 32,
      heightCm: 138,
      activityLevel: 'lowActive',
    });
    expect(r.kcalPerDay).toBe(1744);
  });

  it('perempuan 6 tahun aktif (TEE + 15)', () => {
    const r = calculateChildCalories3to18({
      sex: 'female',
      ageYears: 6,
      weightKg: 20,
      heightCm: 115,
      activityLevel: 'active',
    });
    expect(r.kcalPerDay).toBe(1409);
  });

  it('laki-laki 10 tahun very active (TEE + 25)', () => {
    const r = calculateChildCalories3to18({
      sex: 'male',
      ageYears: 10,
      weightKg: 32,
      heightCm: 138,
      activityLevel: 'veryActive',
    });
    expect(r.kcalPerDay).toBe(2256);
  });

  it('energi pertumbuhan berganti di batas usia 4, 9, dan 14', () => {
    const growth = (sex: 'male' | 'female', age: number) => {
      const r = calculateChildCalories3to18({
        sex,
        ageYears: age,
        weightKg: 40,
        heightCm: 150,
        activityLevel: 'active',
      });
      return Number(r.notes.join(' ').match(/pertumbuhan: (\d+) kkal/)?.[1]);
    };
    expect(growth('male', 3.99)).toBe(20);
    expect(growth('male', 4)).toBe(15);
    expect(growth('male', 8.99)).toBe(15);
    expect(growth('male', 9)).toBe(25);
    expect(growth('male', 13.99)).toBe(25);
    expect(growth('male', 14)).toBe(20);
    expect(growth('female', 3.99)).toBe(15);
    expect(growth('female', 9)).toBe(30);
    expect(growth('female', 14)).toBe(20);
  });

  it('menerima 3 dan 18,99; menolak 2,99 dan 19', () => {
    const base = {
      sex: 'female' as const,
      weightKg: 30,
      heightCm: 130,
      activityLevel: 'active' as ActivityLevel,
    };
    expect(() =>
      calculateChildCalories3to18({ ...base, ageYears: 3 }),
    ).not.toThrow();
    expect(() =>
      calculateChildCalories3to18({ ...base, ageYears: 18.99 }),
    ).not.toThrow();
    expect(() =>
      calculateChildCalories3to18({ ...base, ageYears: 2.99 }),
    ).toThrow();
    expect(() =>
      calculateChildCalories3to18({ ...base, ageYears: 19 }),
    ).toThrow();
  });

  it('menolak kategori aktivitas tidak dikenal', () => {
    expect(() =>
      calculateChildCalories3to18({
        sex: 'male',
        ageYears: 10,
        weightKg: 32,
        heightCm: 138,
        activityLevel: 'extreme' as unknown as ActivityLevel,
      }),
    ).toThrow(/aktivitas/);
  });
});

// ======================================================
// 4. KEHAMILAN
// ======================================================
describe('calculatePregnancyCalories', () => {
  const base = {
    ageYears: 28,
    heightCm: 160,
    currentWeightKg: 62,
    prePregnancyWeightKg: 55,
    activityLevel: 'lowActive' as ActivityLevel,
  };

  it('trimester 1 memakai persamaan nonhamil dan berat pra-hamil', () => {
    const r = asEstimate(
      calculatePregnancyCalories({ ...base, gestationalWeeks: 10 }),
    );
    expect(r.trimester).toBe(1);
    expect(r.kcalPerDay).toBe(2103);
    expect(r.energyDepositionKcalPerDay).toBe(0);
  });

  it('trimester 2 memakai berat saat ini + deposisi 200 (BMI normal)', () => {
    const r = asEstimate(
      calculatePregnancyCalories({ ...base, gestationalWeeks: 20 }),
    );
    expect(r.trimester).toBe(2);
    expect(r.kcalPerDay).toBe(2569);
    expect(r.energyDepositionKcalPerDay).toBe(200);
    expect(r.prePregnancyBmi).toBe(21.48);
  });

  it('trimester 3, BMI kurus (+300), aktivitas inactive', () => {
    const r = asEstimate(
      calculatePregnancyCalories({
        ...base,
        currentWeightKg: 55,
        prePregnancyWeightKg: 45,
        gestationalWeeks: 30,
        activityLevel: 'inactive',
      }),
    );
    expect(r.trimester).toBe(3);
    expect(r.energyDepositionKcalPerDay).toBe(300);
    // 1131.2 - 2.04*28 + 0.34*160 + 12.15*55 + 9.16*30 + 300 = 2372
    expect(r.kcalPerDay).toBe(2372);
  });

  it('BMI overweight (+150), aktivitas active', () => {
    const r = asEstimate(
      calculatePregnancyCalories({
        ...base,
        currentWeightKg: 80,
        prePregnancyWeightKg: 70,
        gestationalWeeks: 20,
        activityLevel: 'active',
      }),
    );
    expect(r.energyDepositionKcalPerDay).toBe(150);
    expect(r.kcalPerDay).toBe(2821);
  });

  it('BMI obesitas (-50), aktivitas veryActive', () => {
    const r = asEstimate(
      calculatePregnancyCalories({
        ...base,
        currentWeightKg: 90,
        prePregnancyWeightKg: 80,
        gestationalWeeks: 20,
        activityLevel: 'veryActive',
      }),
    );
    expect(r.energyDepositionKcalPerDay).toBe(-50);
    expect(r.kcalPerDay).toBe(3034);
  });

  it('batas trimester: minggu 13,9 -> T1; 14 -> T2; 27,9 -> T2; 28 -> T3', () => {
    const tri = (w: number) =>
      asEstimate(calculatePregnancyCalories({ ...base, gestationalWeeks: w }))
        .trimester;
    expect(tri(0)).toBe(1);
    expect(tri(13)).toBe(1);
    expect(tri(13.9)).toBe(1);
    expect(tri(14)).toBe(2);
    expect(tri(27.9)).toBe(2);
    expect(tri(28)).toBe(3);
    expect(tri(42)).toBe(3);
  });

  it('batas BMI deposisi: 18,5 / 25 / 30 (tinggi 200 cm agar BMI = berat/4)', () => {
    const dep = (preKg: number) =>
      asEstimate(
        calculatePregnancyCalories({
          ageYears: 28,
          heightCm: 200,
          currentWeightKg: preKg + 5,
          prePregnancyWeightKg: preKg,
          gestationalWeeks: 20,
          activityLevel: 'active',
        }),
      ).energyDepositionKcalPerDay;

    expect(dep(73.9)).toBe(300); // BMI 18,475
    expect(dep(74)).toBe(200); // BMI 18,5
    expect(dep(99.9)).toBe(200); // BMI 24,975
    expect(dep(100)).toBe(150); // BMI 25
    expect(dep(119.9)).toBe(150); // BMI 29,975
    expect(dep(120)).toBe(-50); // BMI 30
  });

  it('remaja hamil mengembalikan tinjauan klinis tanpa angka', () => {
    const r = calculatePregnancyCalories({
      ...base,
      ageYears: 17,
      gestationalWeeks: 20,
    });
    expect(r.status).toBe('clinical_review_required');
    expect(r.kcalPerDay).toBeNull();
  });

  it('usia tepat 19 tahun diperlakukan sebagai dewasa', () => {
    const r = calculatePregnancyCalories({
      ...base,
      ageYears: 19,
      gestationalWeeks: 20,
    });
    expect(r.status).toBe('estimated');
  });

  it('menolak usia kehamilan di luar 0-42 minggu dan berat tidak valid', () => {
    expect(() =>
      calculatePregnancyCalories({ ...base, gestationalWeeks: -1 }),
    ).toThrow(/0 dan 42/);
    expect(() =>
      calculatePregnancyCalories({ ...base, gestationalWeeks: 43 }),
    ).toThrow(/0 dan 42/);
    expect(() =>
      calculatePregnancyCalories({
        ...base,
        gestationalWeeks: 20,
        prePregnancyWeightKg: 0,
      }),
    ).toThrow();
  });
});

// ======================================================
// 5. PASCAOPERASI
// ======================================================
describe('calculatePostoperativeCalories', () => {
  it('tidak menghasilkan angka kalori otomatis', () => {
    const r = calculatePostoperativeCalories();
    expect(r.status).toBe('clinical_review_required');
    expect(r.kcalPerDay).toBeNull();
    expect(r.notes.length).toBeGreaterThan(0);
  });
});

// ======================================================
// 6. MAKRO
// ======================================================
describe('calculateMacros', () => {
  it('default dewasa 50/20/30 pada 2000 kkal', () => {
    const r = calculateMacros({ calories: 2000, lifeStage: 'adult19Plus' });
    expect(r.carbohydrates).toEqual({ percent: 50, grams: 250 });
    expect(r.protein).toEqual({ percent: 20, grams: 100 });
    expect(r.fat).toEqual({ percent: 30, grams: 66.7 });
    expect(r.warnings).toEqual([]);
  });

  it('default per kategori sesuai tabel', () => {
    const pct = (stage: Parameters<typeof calculateMacros>[0]['lifeStage']) => {
      const r = calculateMacros({ calories: 1000, lifeStage: stage });
      return [r.carbohydrates.percent, r.protein.percent, r.fat.percent];
    };
    expect(pct('toddler1to3')).toEqual([50, 15, 35]);
    expect(pct('child4to18')).toEqual([55, 15, 30]);
    expect(pct('pregnantAdolescent')).toEqual([55, 20, 25]);
    expect(pct('pregnantAdult')).toEqual([50, 20, 30]);
  });

  it('semua default berada dalam AMDR (tanpa peringatan)', () => {
    for (const stage of [
      'toddler1to3',
      'child4to18',
      'adult19Plus',
      'pregnantAdolescent',
      'pregnantAdult',
    ] as const) {
      expect(
        calculateMacros({ calories: 1500, lifeStage: stage }).warnings,
      ).toEqual([]);
    }
  });

  it('gram dihitung dari kalori yang sudah dibulatkan', () => {
    const r = calculateMacros({ calories: 1999.6, lifeStage: 'adult19Plus' });
    expect(r.calories).toBe(2000);
    expect(r.carbohydrates.grams).toBe(250);
  });

  it('memberi peringatan (bukan error) bila di luar AMDR', () => {
    const r = calculateMacros({
      calories: 1000,
      lifeStage: 'toddler1to3',
      carbohydratesPercent: 50,
      proteinPercent: 30,
      fatPercent: 20,
    });
    expect(r.warnings).toHaveLength(2);
    expect(r.warnings[0]).toMatch(/Protein/);
    expect(r.warnings[1]).toMatch(/Lemak/);
  });

  it('batas AMDR inklusif (tidak ada peringatan tepat di batas)', () => {
    const r = calculateMacros({
      calories: 2000,
      lifeStage: 'adult19Plus',
      carbohydratesPercent: 45,
      proteinPercent: 35,
      fatPercent: 20,
    });
    expect(r.warnings).toEqual([]);
  });

  it('bayi <1 tahun wajib persentase eksplisit dan diberi peringatan', () => {
    expect(() =>
      calculateMacros({ calories: 600, lifeStage: 'infantUnder1' }),
    ).toThrow(/eksplisit/);

    const r = calculateMacros({
      calories: 600,
      lifeStage: 'infantUnder1',
      carbohydratesPercent: 40,
      proteinPercent: 10,
      fatPercent: 50,
    });
    expect(r.warnings[0]).toMatch(/Bayi/);
  });

  it('custom wajib eksplisit dan melewati pengecekan AMDR', () => {
    expect(() =>
      calculateMacros({ calories: 1500, lifeStage: 'custom' }),
    ).toThrow(/eksplisit/);

    const r = calculateMacros({
      calories: 1500,
      lifeStage: 'custom',
      carbohydratesPercent: 10,
      proteinPercent: 30,
      fatPercent: 60,
    });
    expect(r.warnings[0]).toMatch(/custom/);
  });

  it('menolak persentase parsial, total bukan 100, atau di luar 0-100', () => {
    expect(() =>
      calculateMacros({
        calories: 2000,
        lifeStage: 'adult19Plus',
        carbohydratesPercent: 50,
      }),
    ).toThrow(/ketiga persentase/);

    expect(() =>
      calculateMacros({
        calories: 2000,
        lifeStage: 'adult19Plus',
        carbohydratesPercent: 50,
        proteinPercent: 20,
        fatPercent: 20,
      }),
    ).toThrow(/100%/);

    expect(() =>
      calculateMacros({
        calories: 2000,
        lifeStage: 'adult19Plus',
        carbohydratesPercent: 110,
        proteinPercent: -5,
        fatPercent: -5,
      }),
    ).toThrow(/antara 0 dan 100/);
  });

  it('menolak kalori tidak valid dan lifeStage tidak dikenal', () => {
    expect(() =>
      calculateMacros({ calories: 0, lifeStage: 'adult19Plus' }),
    ).toThrow(/kalori/i);
    expect(() =>
      calculateMacros({ calories: NaN, lifeStage: 'adult19Plus' }),
    ).toThrow();
    expect(() =>
      calculateMacros({
        calories: 2000,
        lifeStage: 'senior' as unknown as 'adult19Plus',
      }),
    ).toThrow(/lifeStage/);
  });
});

// ======================================================
// HELPER: getMacroLifeStage
// ======================================================
describe('getMacroLifeStage', () => {
  it('memetakan usia ke tahap kehidupan', () => {
    expect(getMacroLifeStage({ ageYears: 0.5 })).toBe('infantUnder1');
    expect(getMacroLifeStage({ ageYears: 1 })).toBe('toddler1to3');
    expect(getMacroLifeStage({ ageYears: 3.99 })).toBe('toddler1to3');
    expect(getMacroLifeStage({ ageYears: 4 })).toBe('child4to18');
    expect(getMacroLifeStage({ ageYears: 18.99 })).toBe('child4to18');
    expect(getMacroLifeStage({ ageYears: 19 })).toBe('adult19Plus');
  });

  it('mengutamakan kategori kehamilan', () => {
    expect(getMacroLifeStage({ ageYears: 17, isPregnant: true })).toBe(
      'pregnantAdolescent',
    );
    expect(getMacroLifeStage({ ageYears: 19, isPregnant: true })).toBe(
      'pregnantAdult',
    );
  });

  it('menolak usia tidak valid', () => {
    expect(() => getMacroLifeStage({ ageYears: -1 })).toThrow();
    expect(() => getMacroLifeStage({ ageYears: NaN })).toThrow();
  });
});
