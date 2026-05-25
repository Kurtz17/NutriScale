import { footerColumns } from '@/components/landing/landing-data';
import { Mail, MapPin, Phone, UsersRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const contactItems = [
  {
    label: 'hello@nutriscale.id',
    href: 'mailto:hello@nutriscale.id',
    icon: Mail,
  },
  {
    label: '+62 812-3456-7890',
    href: 'tel:+6281234567890',
    icon: Phone,
  },
  {
    label: 'Jl. Sehat No. 10, Jakarta, Indonesia',
    href: '#beranda',
    icon: MapPin,
  },
];

const socialItems = [
  { label: 'Komunitas NutriScale', icon: UsersRound, href: '#beranda' },
  {
    label: 'Newsletter NutriScale',
    icon: Mail,
    href: 'mailto:hello@nutriscale.id',
  },
];

const footerLinkTargets: Record<string, string> = {
  Fitur: '#fitur',
  Kategori: '#kategori',
  'Cara Kerja': '#cara-kerja',
  Harga: '#beranda',
  'Tentang Kami': '#tentang',
  Blog: '#artikel',
  Kontak: 'mailto:hello@nutriscale.id',
  FAQ: '#artikel',
  'Kebijakan Privasi': '#artikel',
  'Syarat & Ketentuan': '#artikel',
};

export function LandingFooter() {
  return (
    <footer id="artikel" className="bg-white px-4 pb-8 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-t border-emerald-950/10 pt-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.75fr_0.9fr_1.25fr]">
          <div>
            <Link href="#beranda" className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center overflow-hidden rounded-full bg-emerald-50 ring-1 ring-emerald-100">
                <Image
                  src="/logo.png"
                  alt="Logo NutriScale"
                  width={44}
                  height={44}
                  className="size-full object-cover"
                />
              </span>
              <span className="text-xl font-black text-slate-950">
                NutriScale
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-slate-500">
              Solusi cerdas untuk manajemen gizi dan kesehatan berbasis AI,
              pendekatan medis, serta rekomendasi makanan yang personal.
            </p>
            <div className="mt-5 flex gap-3">
              {socialItems.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-emerald-700 hover:text-white"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-black text-slate-950">
                {column.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href={footerLinkTargets[link]}
                      className="text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="text-sm font-black text-slate-950">Kontak</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {contactItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="flex items-start gap-3 text-sm font-semibold leading-6 text-slate-500 transition hover:text-emerald-700"
                    >
                      <Icon
                        className="mt-0.5 size-4 shrink-0 text-emerald-700"
                        aria-hidden="true"
                      />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-emerald-950/10 pt-6 text-xs font-semibold text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 NutriScale. All rights reserved.</p>
          <p>AI-powered nutrition assistant for healthier everyday choices.</p>
        </div>
      </div>
    </footer>
  );
}
