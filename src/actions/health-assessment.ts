'use server';

import { JenisKelamin } from '@/app/generated/prisma/client';
import {
  formatPantanganMedis,
  formatUsiaKehamilan,
  mapCategory,
  mapGender,
} from '@/lib/health-assessment-utils';
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

    const profilId = crypto.randomUUID();

    // Check for existing profile
    const existingProfile = await prisma.profilKesehatan.findFirst({
      where: { userId: userId },
    });

    if (existingProfile) {
      await prisma.profilKesehatan.update({
        where: { id: existingProfile.id },
        data: {
          jenisKelamin,
          umur: formData.age !== '' ? Number(formData.age) : undefined,
          beratBadan:
            formData.weight !== '' ? Number(formData.weight) : undefined,
          tinggiBadan:
            formData.height !== '' ? Number(formData.height) : undefined,
          kategoriKondisi,
          usiaKehamilanMinggu,
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
          umur: formData.age !== '' ? Number(formData.age) : undefined,
          beratBadan:
            formData.weight !== '' ? Number(formData.weight) : undefined,
          tinggiBadan:
            formData.height !== '' ? Number(formData.height) : undefined,
          kategoriKondisi,
          usiaKehamilanMinggu,
          pantanganMedis,
        },
      });
    }

    // --- INTEGRASI AI ENGINE ---
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
            umur: formData.age !== '' ? Number(formData.age) : 20,
            jenisKelamin:
              jenisKelamin === JenisKelamin.LAKI_LAKI
                ? 'LAKI_LAKI'
                : 'PEREMPUAN',
            beratBadan: formData.weight !== '' ? Number(formData.weight) : 0,
            tinggiBadan: formData.height !== '' ? Number(formData.height) : 0,
            kategoriKondisi,
            usiaKehamilanMinggu,
            pantanganMedis,
          }),
        },
      );

      if (aiResponse.ok) {
        const aiResult = await aiResponse.json();
        const { riwayat_analisis, meal_plan } = aiResult.data;

        const targetProfilId = existingProfile?.id || profilId;
        const analisisId = crypto.randomUUID();

        // 1. Simpan Riwayat Analisis
        await prisma.riwayatAnalisis.create({
          data: {
            id: analisisId,
            profilId: targetProfilId,
            haz: riwayat_analisis.haz,
            whz: riwayat_analisis.whz,
            bmi: riwayat_analisis.bmi,
            statusNutrisi: riwayat_analisis.statusNutrisi,
          },
        });

        // 2. Simpan Meal Plan
        await prisma.mealPlan.create({
          data: {
            id: crypto.randomUUID(),
            analisisId: analisisId,
            detailRencanaMakan: {
              ...meal_plan.detailRencanaMakan,
              narasiAI: riwayat_analisis.narasiAI,
            },
          },
        });
      }
    } catch (aiError) {
      console.error('AI Engine Integration Failed:', aiError);
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
