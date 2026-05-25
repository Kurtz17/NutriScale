'use client';

import { motion } from 'framer-motion';
import { Apple, ArrowRight, Leaf, MessageCircle, Salad } from 'lucide-react';

type CTASectionProps = {
  onStartAnalysis: () => void;
};

export function CTASection({ onStartAnalysis }: CTASectionProps) {
  return (
    <section className="bg-[#fbfdf8] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.6rem] bg-linear-to-br from-emerald-800 via-emerald-700 to-teal-700 p-6 text-white shadow-2xl shadow-emerald-950/15 sm:p-10 lg:p-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(255,255,255,0.22),transparent_22%),radial-gradient(circle_at_86%_34%,rgba(189,255,211,0.25),transparent_26%)]" />
        <Leaf className="absolute left-8 top-8 size-16 rotate-12 text-white/10" />
        <Apple className="absolute bottom-6 right-10 size-24 text-lime-100/20" />
        <Salad className="absolute bottom-8 left-7 hidden size-24 text-lime-100/20 md:block" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-black text-emerald-50 ring-1 ring-white/20">
              <Leaf className="size-3.5" aria-hidden="true" />
              Mulai perubahan hari ini
            </div>
            <h2 className="max-w-2xl text-3xl font-black leading-tight sm:text-4xl">
              Siap Transformasi Kesehatan Anda?
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/90 sm:text-base">
              Mulai pahami kebutuhan nutrisi tubuh Anda dan temukan rekomendasi
              makanan yang lebih tepat bersama NutriScale.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <button
              type="button"
              onClick={onStartAnalysis}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-emerald-800 shadow-lg shadow-emerald-950/15 transition hover:-translate-y-0.5 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/60"
            >
              Mulai Analisis Gratis
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <a
              href="mailto:hello@nutriscale.id"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/50 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/40"
            >
              Hubungi Spesialis
              <MessageCircle className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
