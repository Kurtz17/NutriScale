'use client';
import { authClient } from '@/lib/auth-client';
import { useCartStore } from '@/lib/store/useCartStore';
import { LogOut, Package, ShoppingCart, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  username?: string | null;
}

export default function Navbar() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { cart, fetchCart } = useCartStore();

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchCart();
    // Fetch fresh user data from DB (bypasses session cache)
    fetch('/api/user/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !data.error) setUserProfile(data);
      })
      .catch(() => {});
  }, [isLoggedIn, fetchCart]);

  const handleLogout = async () => {
    await authClient.signOut();
    setIsDropdownOpen(false);
    setUserProfile(null);
    router.push('/');
  };

  // Use userProfile (fresh from DB) if available, fallback to session
  // Guard with isLoggedIn so stale data isn't shown after logout
  const displayName =
    (isLoggedIn && (userProfile?.name || session?.user?.name)) || 'User';
  const displayEmail =
    (isLoggedIn && (userProfile?.email || session?.user?.email)) || '';
  const displayImage =
    (isLoggedIn && (userProfile?.image || session?.user?.image)) || null;
  const displayInitial = displayName?.[0]?.toUpperCase() || 'U';

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
          {isLoggedIn && (
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
                onClick={() => router.push('/health-dashboard')}
                className="text-gray-600 hover:text-black font-semibold transition-colors"
              >
                Dashboard
              </button>
            </div>
          )}

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
                  onClick={() => router.push('/marketplace')}
                  className="relative p-2.5 bg-gray-50 rounded-2xl group"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-black" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                      {cart.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </button>

                {/* Profil Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-10 h-10 rounded-xl bg-[#E1EEDD] flex items-center justify-center font-bold text-green-700 border-2 border-white shadow-sm hover:ring-2 hover:ring-green-500 transition-all overflow-hidden"
                  >
                    {displayImage ? (
                      <Image
                        src={displayImage}
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      displayInitial
                    )}
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                      <div className="px-3 py-2 border-b border-slate-100 mb-2">
                        <p className="font-bold text-sm text-slate-900 truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {displayEmail}
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
                        onClick={() => {
                          setIsDropdownOpen(false);
                          router.push('/order-history');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 font-medium hover:bg-slate-50 rounded-xl"
                      >
                        <Package className="w-4 h-4 text-slate-500" /> Order
                        History
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
