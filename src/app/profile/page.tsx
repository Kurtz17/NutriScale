import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import ProfileForm from './profile-form';
import { AddressData } from './types';

export default async function ProfileSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const userDetail = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!userDetail) return <div>User tidak ditemukan</div>;

  const initialData = {
    id: userDetail.id,
    name: userDetail.name || '',
    email: userDetail.email || '',
    image: userDetail.image || '',
    username: userDetail.username || '',
    tanggalLahir: userDetail.tanggalLahir || '',
    phone: userDetail.phone || '',
    address: (userDetail.address as AddressData) || {},
    notification: userDetail.notification ?? true,
  };

  return (
    <div className="min-h-screen bg-[#DDE5D6] px-6 md:px-20 py-12">
      <ProfileForm initialData={initialData} />
    </div>
  );
}
