'use client';

import { heroTrustChips } from '@/components/landing/landing-data';
import { motion } from 'framer-motion';
import { Apple, ArrowRight, Leaf, Play, Salad, Sparkles } from 'lucide-react';

type HeroSectionProps = {
  onLearnMore: () => void;
  onStartAnalysis: () => void;
};

const floatingCards = [
  {
    label: 'Protein',
    value: 'Cukup',
    icon: Salad,
    position: 'right-0 top-[4.5rem] sm:-right-8',
    delay: 0,
  },
  {
    label: 'Vitamin D',
    value: 'Baik',
    icon: Sparkles,
    position: 'right-3 top-40 sm:-right-12',
    delay: 0.35,
  },
  {
    label: 'Serat',
    value: 'Cukup',
    icon: Leaf,
    position: 'right-0 top-[15.5rem] sm:-right-6',
    delay: 0.7,
  },
];

export function HeroSection({
  onLearnMore,
  onStartAnalysis,
}: HeroSectionProps) {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-[#fbfdf8] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(178,224,180,0.42),transparent_34%),radial-gradient(circle_at_84%_18%,rgba(142,210,184,0.34),transparent_30%),linear-gradient(180deg,#f7fbf1_0%,#fbfdf8_72%,#ffffff_100%)]" />
      <div className="absolute left-0 top-28 h-56 w-56 rounded-full bg-emerald-100/40 blur-3xl" />
      <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-lime-100/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm">
            <Sparkles className="size-4" aria-hidden="true" />
            AI Powered Nutrition
          </div>
          <h1 className="text-4xl font-black leading-tight text-[#0f1f16] sm:text-5xl lg:text-6xl">
            Kelola Gizi & Kesehatan{' '}
            <span className="text-emerald-700">Lebih Cerdas, Hasil Nyata</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            NutriScale membantu Anda memahami kondisi nutrisi, mendapatkan
            rekomendasi personal, dan memilih makanan sehat sesuai kebutuhan
            tubuh.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onStartAnalysis}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-black text-white shadow-xl shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-200 sm:w-auto"
            >
              Mulai Analisis Gratis
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onLearnMore}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-700/40 bg-white/80 px-6 py-3 text-sm font-black text-[#143b24] shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-700 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-200 sm:w-auto"
            >
              Pelajari Lebih Lanjut
              <Play className="size-4 fill-current" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {heroTrustChips.map((chip) => {
              const Icon = chip.icon;

              return (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm"
                >
                  <Icon
                    className="size-4 text-emerald-700"
                    aria-hidden="true"
                  />
                  {chip.label}
                </span>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="relative mx-auto w-full max-w-2xl pb-12 pt-4"
        >
          <DashboardMockup />
          {floatingCards.map((card) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.label}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4.5,
                  delay: card.delay,
                  ease: 'easeInOut',
                  repeat: Infinity,
                }}
                className={`absolute ${card.position} z-20 hidden min-w-[8.5rem] items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-xl shadow-emerald-950/10 backdrop-blur sm:flex`}
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs font-black text-slate-800">
                    {card.label}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    {card.value}
                  </span>
                </span>
              </motion.div>
            );
          })}
          <FoodDecoration />
        </motion.div>
      </div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-emerald-100/50 blur-2xl" />
      <div className="relative rounded-[1.75rem] border border-slate-900/10 bg-slate-950 p-2 shadow-2xl shadow-emerald-950/15">
        <div className="rounded-[1.35rem] bg-white p-4 sm:p-5">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Leaf className="size-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-black text-slate-900">
                NutriScale
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span className="size-2 rounded-full bg-emerald-400" />
              Tersinkron
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs font-bold uppercase text-emerald-700">
              Dasbor Gizi Personal
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              Halo, Selamat Pagi!
            </h2>
            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
              Berikut ringkasan kesehatan dan nutrisi Anda hari ini.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard
              label="Skor Gizi"
              value="87"
              suffix="/100"
              tone="green"
            />
            <MetricCard
              label="Kecukupan Nutrisi"
              value="85%"
              suffix=""
              tone="teal"
            />
            <MetricCard
              label="Kalori Harian"
              value="1.850"
              suffix=" / 2.200 kcal"
              tone="amber"
            />
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-slate-100 bg-[#f8fcf9] p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-slate-800">
                  Rencana Nutrisi Anda
                </p>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                  Hari ini
                </span>
              </div>
              <div className="mt-4 flex items-end gap-2">
                {[54, 82, 68, 42, 75].map((height, index) => (
                  <span
                    key={height}
                    className="flex-1 rounded-full bg-emerald-200"
                    style={{ height: `${height}px` }}
                    aria-hidden="true"
                  >
                    <span
                      className="block rounded-full bg-emerald-600"
                      style={{ height: `${height * (0.45 + index * 0.08)}px` }}
                    />
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-xs font-black text-slate-800">
                Rekomendasi Hari Ini
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {[
                  'Tambahkan sayur hijau',
                  'Perbanyak serat & buah',
                  'Penuhi protein makan siang',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex size-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                      <Leaf className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-8 left-3 hidden w-28 rounded-[1.8rem] border-[6px] border-slate-950 bg-white p-3 shadow-2xl shadow-emerald-950/15 sm:block">
        <div className="mx-auto mb-3 h-1 w-8 rounded-full bg-slate-200" />
        <div className="rounded-2xl bg-emerald-50 p-3">
          <ProgressRing />
          <p className="mt-2 text-center text-[10px] font-black text-slate-700">
            1.850 kcal
          </p>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <span className="h-2 rounded-full bg-emerald-200" />
          <span className="h-2 rounded-full bg-amber-200" />
          <span className="h-2 rounded-full bg-teal-200" />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  suffix,
  tone,
  value,
}: {
  label: string;
  suffix: string;
  tone: 'amber' | 'green' | 'teal';
  value: string;
}) {
  const toneClass = {
    amber: 'text-amber-700 bg-amber-50',
    green: 'text-emerald-700 bg-emerald-50',
    teal: 'text-teal-700 bg-teal-50',
  }[tone];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-2xl font-black text-slate-950">{value}</span>
        <span className="text-xs font-bold text-slate-500">{suffix}</span>
      </div>
      <div className={`mt-3 h-2 rounded-full ${toneClass}`}>
        <span className="block h-full w-4/5 rounded-full bg-current" />
      </div>
    </div>
  );
}

function ProgressRing() {
  return (
    <div className="mx-auto grid size-16 place-items-center rounded-full bg-[conic-gradient(#059669_0_72%,#d9f5e8_72%_100%)]">
      <div className="grid size-12 place-items-center rounded-full bg-white text-sm font-black text-emerald-700">
        85%
      </div>
    </div>
  );
}

function FoodDecoration() {
  return (
    <div
      aria-hidden="true"
      className="absolute -bottom-2 right-10 z-10 hidden items-end gap-3 md:flex"
    >
      <div className="relative flex size-28 items-center justify-center rounded-full bg-white shadow-xl shadow-emerald-950/10 ring-1 ring-emerald-100">
        <span className="absolute bottom-4 h-9 w-20 rounded-b-full bg-emerald-100" />
        <span className="absolute bottom-11 left-8 size-6 rounded-full bg-lime-500" />
        <span className="absolute bottom-12 left-14 size-5 rounded-full bg-red-400" />
        <span className="absolute bottom-10 right-8 size-6 rounded-full bg-amber-300" />
        <Salad className="relative z-10 size-10 text-emerald-700" />
      </div>
      <div className="flex size-20 items-center justify-center rounded-full bg-lime-100 text-lime-700 shadow-lg shadow-lime-900/10">
        <Apple className="size-10" />
      </div>
    </div>
  );
}
