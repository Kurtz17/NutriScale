'use client';
import { authClient } from '@/lib/auth-client';
import {
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  UserCircle,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
  };

  // Daftar Menu Navigasi sesuai Mockup Desain
  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      path: '/admin/dashboard',
    },
    {
      icon: <UserCircle size={20} />,
      label: 'User Management',
      path: '/admin/user-management',
    },
    {
      icon: <Package size={20} />,
      label: 'Orders Management',
      path: '/admin/orders',
    },
    {
      icon: <Settings size={20} />,
      label: 'Product Catalog',
      path: '/admin/catalogues',
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#E1EEDD]">
      {/* SIDEBAR: Style Gelap #1A1A1B sesuai Desain */}
      <aside className="w-72 bg-[#1A1A1B] text-white flex flex-col sticky top-0 h-screen shadow-2xl">
        {/* Brand Identity */}
        <div className="p-8 flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <img
              src="/logo.png"
              alt="NutriScale"
              className="w-7 h-7 object-contain"
            />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter leading-none">
              NutriScale
            </h1>
            <p className="text-[10px] text-[#7CB342] font-bold uppercase tracking-widest mt-1">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 px-4 py-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-4 w-full px-6 py-4 rounded-[1.25rem] transition-all font-bold text-sm ${
                pathname === item.path
                  ? 'bg-white text-[#1A1A1B] shadow-xl scale-105'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span className="tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer Sidebar: Logout */}
        <div className="p-6 border-t border-gray-800/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:text-red-400 transition-all font-bold text-sm w-full px-4 py-3 rounded-2xl hover:bg-red-400/10"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* AREA KONTEN UTAMA (Page.tsx maneh bakal muncul di sini) */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
