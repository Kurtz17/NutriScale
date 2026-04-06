'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function updateProfile(formData: FormData) {
  // 1. Dapatkan sesi pengguna yang sedang login
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Tidak ada akses (Unauthorized)');
  }

  const userId = session.user.id;

  // 2. Ambil data dari input form
  const name = formData.get('name') as string;
  const umur = Number(formData.get('umur'));
  const jenisKelamin = formData.get('jenisKelamin') as
    | 'LAKI_LAKI'
    | 'PEREMPUAN';
  const tinggiBadan = Number(formData.get('tinggiBadan'));
  const beratBadan = Number(formData.get('beratBadan'));

  // 3. Update tabel User (Nama Lengkap)
  await prisma.user.update({
    where: { id: userId },
    data: { name: name },
  });

  // 4. Update atau Buat data Profil Kesehatan
  const existingProfile = await prisma.profilKesehatan.findFirst({
    where: { userId: userId },
    orderBy: { updatedAt: 'desc' },
  });

  if (existingProfile) {
    // Jika sudah ada, update profil lama
    await prisma.profilKesehatan.update({
      where: { id: existingProfile.id },
      data: {
        umur,
        jenisKelamin,
        tinggiBadan,
        beratBadan,
      },
    });
  } else {
    // Jika baru pertama kali diisi, buat record baru
    await prisma.profilKesehatan.create({
      data: {
        id: crypto.randomUUID(),
        userId: userId,
        namaProfil: 'Profil Utama',
        umur,
        jenisKelamin,
        tinggiBadan,
        beratBadan,
      },
    });
  }

  // 5. Refresh halaman agar data terbaru langsung muncul
  revalidatePath('/profile');
}
