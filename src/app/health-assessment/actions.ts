'use server';

import { JenisKelamin, KategoriKondisi } from '@/app/generated/prisma/client';
import { HealthFormData } from '@/components/health-assessment/types/health';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function saveHealthAssessment(
  formData: HealthFormData,
  userId: string,
) {
  try {
    if (!userId) {
      return { success: false, error: 'Unauthorized. User ID is missing.' };
    }

    // Mapping enum Gender
    let jenisKelamin: JenisKelamin = JenisKelamin.LAKI_LAKI;
    if (formData.gender === 'female') {
      jenisKelamin = JenisKelamin.PEREMPUAN;
    }

    // Mapping enum Kategori
    let kategoriKondisi: KategoriKondisi = KategoriKondisi.UMUM;
    if (formData.category === 'balita') {
      kategoriKondisi = KategoriKondisi.ANAK_BALITA;
    } else if (formData.category === 'ibu_hamil') {
      kategoriKondisi = KategoriKondisi.IBU_HAMIL;
    } else if (formData.category === 'pasca_operasi') {
      kategoriKondisi = KategoriKondisi.PASCA_OPERASI;
    }

    // Format pantangan medis jika ada (Hanya untuk Pasca Operasi)
    const pantanganMedis =
      formData.category === 'pasca_operasi' &&
      Array.isArray(formData.larangan) &&
      formData.larangan.length > 0
        ? formData.larangan.join(', ')
        : null;

    // Usia kehamilan (Hanya untuk Ibu Hamil)
    const usiaKehamilanMinggu =
      formData.category === 'ibu_hamil' && formData.gestasi !== ''
        ? Number(formData.gestasi)
        : null;

    // Menghasilkan ID unik untuk profil
    const profilId = crypto.randomUUID();

    // Cek profil pertama user ini
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
