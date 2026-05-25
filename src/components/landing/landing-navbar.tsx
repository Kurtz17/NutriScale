'use client';

import { navItems } from '@/components/landing/landing-data';
import { ArrowRight, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type LandingNavbarProps = {
  isLoggedIn: boolean;
  onLogin: () => void;
  onStartAnalysis: () => void;
};

export function LandingNavbar({
  isLoggedIn,
  onLogin,
  onStartAnalysis,
}: LandingNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/10 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="#beranda"
          className="flex items-center gap-3"
          onClick={closeMenu}
        >
          <span className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-emerald-50 ring-1 ring-emerald-100">
            <Image
              src="/logo.png"
              alt="Logo NutriScale"
              width={40}
              height={40}
              className="size-full object-cover"
              priority
            />
          </span>
          <span className="text-xl font-black text-[#142018]">NutriScale</span>
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-8 lg:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-700 transition-colors hover:text-emerald-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={onLogin}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-200"
          >
            {isLoggedIn ? 'Dashboard' : 'Masuk'}
          </button>
          <button
            type="button"
            onClick={onStartAnalysis}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-200"
          >
            Mulai Analisis Gratis
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((value) => !value)}
          className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-emerald-200 lg:hidden"
        >
          {isMenuOpen ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-emerald-950/10 bg-white px-4 py-4 shadow-xl shadow-emerald-950/5 lg:hidden">
          <nav aria-label="Navigasi mobile" className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-3">
            <button
              type="button"
              onClick={() => {
                closeMenu();
                onLogin();
              }}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800"
            >
              {isLoggedIn ? 'Dashboard' : 'Masuk'}
            </button>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                onStartAnalysis();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white"
            >
              Mulai Analisis Gratis
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
