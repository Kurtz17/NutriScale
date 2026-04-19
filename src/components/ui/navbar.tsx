'use client';
import { authClient } from '@/lib/auth-client';
import {
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingCart,
  Store,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    setIsDropdownOpen(false);
    router.push('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <div className="w-10 h-10 bg-[#1A1A1B] rounded-xl flex items-center justify-center">
              <span className="text-xl">🥗</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#1A1A1B]">
              NutriScale
            </span>
          </div>

          {/* Menu Utama (Tengah) */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-black font-semibold transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => router.push('/marketplace')}
              className="text-gray-600 hover:text-black font-semibold transition-colors"
            >
              Marketplace
            </button>
            <button
              disabled
              onClick={() => router.push('/smart-counter')}
              className="text-gray-600 hover:text-black font-semibold transition-colors"
            >
              Smart Counter
            </button>
            <button
              onClick={() => router.push('/health-dashboard')}
              className="text-gray-600 hover:text-black font-semibold transition-colors"
            >
              Dashboard
            </button>
          </div>

          {/* Navigasi & Auth */}
          <div className="flex items-center space-x-6">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="font-bold hover:text-green-700"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="bg-[#1A1A1B] text-white px-6 py-3 rounded-2xl font-bold"
                >
                  Get Started
                </button>
              </>
            ) : (
              <div className="flex items-center gap-5" ref={dropdownRef}>
                {/* Tombol Keranjang (Tugas Arya) */}
                <button
                  onClick={() => router.push('/cart')}
                  className="relative p-2.5 bg-gray-50 rounded-2xl group"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-black" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    0
                  </span>
                </button>

                {/* Profil Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-10 h-10 rounded-xl bg-[#E1EEDD] flex items-center justify-center font-bold text-green-700 border-2 border-white shadow-sm hover:ring-2 hover:ring-green-500 transition-all"
                  >
                    {session?.user?.name?.substring(0, 1).toUpperCase() || 'U'}
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                      <div className="px-3 py-2 border-b border-slate-100 mb-2">
                        <p className="font-bold text-sm text-slate-900 truncate">
                          {session?.user?.name || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {session?.user?.email || ''}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          router.push('/profile');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 font-medium hover:bg-slate-50 rounded-xl"
                      >
                        <User className="w-4 h-4 text-slate-500" /> Profile
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 font-medium hover:bg-red-50 rounded-xl"
                      >
                        <LogOut className="w-4 h-4 text-red-500" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
