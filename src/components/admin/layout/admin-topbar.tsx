'use client';

import { authClient } from '@/lib/auth-client';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminTopbar() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  async function handleLogout() {
    await authClient.signOut();
    router.push('/login');
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
      {/* Kiri: breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">NutriScale</span>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-700">Admin Panel</span>
      </div>

      {/* Kanan: info user + logout */}
      <div className="flex items-center gap-4">
        {/* Nama dan email */}
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800 leading-none">
            {session?.user?.name ?? 'Admin'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {session?.user?.email ?? ''}
          </p>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-semibold">
          {session?.user?.name?.charAt(0).toUpperCase() ?? 'A'}
        </div>

        {/* Tombol logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
