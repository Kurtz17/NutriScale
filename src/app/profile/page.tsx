import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
// Instance BetterAuth (Server)
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import ProfileForm from './profile-form';

// Import Client Component-nya

export default async function ProfileSettingsPage() {
  // 1. Ambil session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  // 2. Fetch data dari DB
  const userDetail = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      accounts: { select: { providerId: true }, take: 1 },
      profiles: { orderBy: { updatedAt: 'desc' }, take: 1 },
    },
  });

  if (!userDetail) return <div>User tidak ditemukan</div>;

  const activeProfile = userDetail.profiles[0];

  // 3. Mapping data ke object sederhana yang bisa dikirim ke Client
  const initialData = {
    name: userDetail.name,
    email: userDetail.email,
    image: userDetail.image,
    providerId: userDetail.accounts[0]?.providerId || 'Credentials',
    umur: activeProfile?.umur || 0,
    jenisKelamin: activeProfile?.jenisKelamin || 'LAKI_LAKI',
    tinggiBadan: activeProfile ? Number(activeProfile.tinggiBadan) : 0,
    beratBadan: activeProfile ? Number(activeProfile.beratBadan) : 0,
  };

  // 4. Kirim Data lewat Props ke Client Component ✨
  return (
    <div className="min-h-screen bg-[#DDE5D6] px-6 md:px-20 py-12 font-sans antialiased">
      <ProfileForm initialData={initialData} />
    </div>
  );
}
