export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  createdAt: string;
  lastOnline: string | null;
}

export type UserStatus = 'All' | 'Aktif' | 'Nonaktif' | 'Banned';
