'use server';

import { JenisKelamin, Prisma } from '@/app/generated/prisma/client';
import {
  formatPantanganMedis,
  formatUsiaKehamilan,
  mapCategory,
  mapGender,
} from '@/lib/health-assessment-utils';
import { computeTargetNutrition } from '@/lib/nutrition/compute-target';
import prisma from '@/lib/prisma';
import { HealthFormData } from '@/types/health-assessment';
import crypto from 'crypto';

export async function saveHealthAssessment(
  formData: HealthFormData,
  userId: string,
) {
  try {
    if (!userId) {
      return { success: false, error: 'Unauthorized. User ID is missing.' };
    }

    const jenisKelamin = mapGender(formData.gender);
    const kategoriKondisi = mapCategory(formData.category);
    const pantanganMedis = formatPantanganMedis(formData);
    const usiaKehamilanMinggu = formatUsiaKehamilan(formData);

    const anjuranKaloriDokter =
      formData.kalori !== '' &&
      formData.kalori !== undefined &&
      Number(formData.kalori) > 0
        ? Math.round(Number(formData.kalori))
        : undefined;

    const umur = formData.age !== '' ? Number(formData.age) : 25;
    const beratBadan = formData.weight !== '' ? Number(formData.weight) : 60;
    const tinggiBadan = formData.height !== '' ? Number(formData.height) : 165;

    const profilId = crypto.randomUUID();

    // Check for existing profile
    const existingProfile = await prisma.profilKesehatan.findFirst({
      where: { userId: userId },
    });

    const targetProfilId = existingProfile?.id || profilId;

    if (existingProfile) {
      await prisma.profilKesehatan.update({
        where: { id: existingProfile.id },
        data: {
          jenisKelamin,
          umur,
          beratBadan,
          tinggiBadan,
          kategoriKondisi,
          usiaKehamilanMinggu,
          anjuranKaloriDokter,
          pantanganMedis,
        },
      });
    } else {
      await prisma.profilKesehatan.create({
        data: {
          id: profilId,
          userId: userId,
          namaProfil: 'User Profile',
          jenisKelamin,
          umur,
          beratBadan,
          tinggiBadan,
          kategoriKondisi,
          usiaKehamilanMinggu,
          anjuranKaloriDokter,
          pantanganMedis,
        },
      });
    }

    // --- 1. KALKULASI TARGET GIZI LOKAL (NUTRISCALE NUTRI-CALC ENGINE) ---
    // Sistem menghitung sendiri target nutrisi tanpa bergantung pada API AI eksternal.
    // Anjuran dokter menjadi prioritas utama apabila disediakan.
    const targetNutrisi = computeTargetNutrition({
      sex: jenisKelamin === JenisKelamin.LAKI_LAKI ? 'male' : 'female',
      ageYears: umur,
      weightKg: beratBadan,
      heightCm: tinggiBadan,
      category: kategoriKondisi,
      activityFactor: formData.activityFactor,
      gestationalWeeks: usiaKehamilanMinggu ?? undefined,
      anjuranKaloriDokter: anjuranKaloriDokter ?? null,
    });

    // --- 2. SIMPAN RIWAYAT ANALISIS & MEAL PLAN LOKAL (LOCAL-FIRST) ---
    const analisisId = crypto.randomUUID();
    const mealPlanId = crypto.randomUUID();

    await prisma.riwayatAnalisis.create({
      data: {
        id: analisisId,
        profilId: targetProfilId,
        haz: targetNutrisi.haz,
        whz: targetNutrisi.whz,
        bmi: targetNutrisi.bmi,
        statusNutrisi: targetNutrisi.statusNutrisi,
        kalori: targetNutrisi.calories > 0 ? targetNutrisi.calories : null,
        karbohidrat:
          targetNutrisi.carbohydrates.grams > 0
            ? targetNutrisi.carbohydrates.grams
            : null,
        protein:
          targetNutrisi.protein.grams > 0 ? targetNutrisi.protein.grams : null,
        lemak: targetNutrisi.fat.grams > 0 ? targetNutrisi.fat.grams : null,
      },
    });

    await prisma.mealPlan.create({
      data: {
        id: mealPlanId,
        analisisId: analisisId,
        detailRencanaMakan: {
          target_kalori_harian: targetNutrisi.calories,
          distribusi: {
            protein_g: targetNutrisi.protein.grams,
            fat_g: targetNutrisi.fat.grams,
            carbs_g: targetNutrisi.carbohydrates.grams,
          },
          nutrisiKalkulasi: targetNutrisi,
          statusKalkulasi: targetNutrisi.status,
          metode: targetNutrisi.method,
          notes: targetNutrisi.notes,
          warnings: targetNutrisi.warnings,
          narasiAI: '',
        } as unknown as Prisma.InputJsonValue,
      },
    });

    // --- 3. INTEGRASI AI ENGINE (HANYA UNTUK REKOMENDASI MAKANAN & NARASI NLP) ---
    // AI Engine hanya menerima target yang telah dihitung NutriScale
    if (process.env.AI_ENGINE_URL && targetNutrisi.calories > 0) {
      try {
        const aiResponse = await fetch(
          `${process.env.AI_ENGINE_URL}/api/recommend`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': process.env.AI_ENGINE_API_KEY || '',
            },
            body: JSON.stringify({
              umur,
              jenisKelamin:
                jenisKelamin === JenisKelamin.LAKI_LAKI
                  ? 'LAKI_LAKI'
                  : 'PEREMPUAN',
              beratBadan,
              tinggiBadan,
              kategoriKondisi,
              usiaKehamilanMinggu,
              pantanganMedis,
              nutrisi: {
                lifeStage: targetNutrisi.lifeStage,
                calories: targetNutrisi.calories,
                carbohydrates: targetNutrisi.carbohydrates,
                protein: targetNutrisi.protein,
                fat: targetNutrisi.fat,
                warnings: targetNutrisi.warnings,
                energyMethod: targetNutrisi.method,
              },
              asesmen: {
                bmi: targetNutrisi.bmi,
                haz: targetNutrisi.haz,
                whz: targetNutrisi.whz,
                statusNutrisi: targetNutrisi.statusNutrisi,
              },
            }),
          },
        );

        if (aiResponse.ok) {
          const aiResult = await aiResponse.json();
          const { riwayat_analisis, meal_plan } = aiResult.data || {};

          if (meal_plan?.detailRencanaMakan) {
            await prisma.mealPlan.update({
              where: { id: mealPlanId },
              data: {
                detailRencanaMakan: {
                  ...meal_plan.detailRencanaMakan,
                  // Target gizi dan makro MUTLAK berasal dari nutri-calc NutriScale
                  target_kalori_harian: targetNutrisi.calories,
                  distribusi: {
                    protein_g: targetNutrisi.protein.grams,
                    fat_g: targetNutrisi.fat.grams,
                    carbs_g: targetNutrisi.carbohydrates.grams,
                  },
                  nutrisiKalkulasi: targetNutrisi,
                  narasiAI:
                    riwayat_analisis?.narasiAI ||
                    meal_plan.detailRencanaMakan?.narasiAI ||
                    '',
                } as unknown as Prisma.InputJsonValue,
              },
            });
          }
        } else {
          console.warn(
            `AI Engine returned status ${aiResponse.status}. Melanjutkan dengan kalkulasi nutrisi lokal.`,
          );
        }
      } catch (aiError) {
        console.warn(
          'AI Engine tidak dapat dihubungi (Offline). NutriScale tetap berjalan normal dengan kalkulasi gizi mandiri:',
          aiError,
        );
      }
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error saving health assessment:', error);
    return {
      success: false,
      error: `Terjadi kesalahan sistem saat menyimpan profil: ${errorMessage}`,
    };
  }
}
