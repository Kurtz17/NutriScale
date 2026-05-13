export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  banReason?: string | null;
  banExpires?: string | null;
  createdAt: string;
  lastOnline: string | null;
}

export type UserStatus = 'Semua' | 'Aktif' | 'Nonaktif' | 'Banned';
