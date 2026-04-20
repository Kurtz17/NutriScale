'use server';

import { Prisma } from '@/app/generated/prisma/client';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { AddressData } from './types';

export async function updateProfile(data: {
  name: string;
  username: string;
  tanggalLahir: string;
  phone: string;
  address: AddressData;
  notification: boolean;
  image?: string;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check if username is taken by someone else
    if (data.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: data.username },
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return { success: false, error: 'Username is already taken' };
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        username: data.username,
        tanggalLahir: data.tanggalLahir,
        phone: data.phone,
        address: data.address as Prisma.InputJsonValue,
        notification: data.notification,
        ...(data.image ? { image: data.image } : {}),
      },
    });

    revalidatePath('/profile');
    revalidatePath('/'); // for navbar
    return { success: true };
  } catch (error) {
    console.error('Failed to update profile:', error);
    const message =
      error instanceof Error ? error.message : 'Something went wrong';
    return { success: false, error: message };
  }
}
