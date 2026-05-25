'use client';

import {
  benefitChecklist,
  featureCards,
} from '@/components/landing/landing-data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CheckCircle2, Leaf } from 'lucide-react';

export function BenefitsSection() {
  return (
    <section
      id="tentang"
      className="relative overflow-hidden bg-[#f7fbf4] px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-black text-emerald-700 shadow-sm ring-1 ring-emerald-100">
            <Leaf className="size-3.5" aria-hidden="true" />
            Health-tech yang terpercaya
          </div>
          <h2 className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
            Kenapa Memilih <span className="text-emerald-700">NutriScale?</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
            Kami menggabungkan kecerdasan AI dengan pendekatan medis agar Anda
            mendapatkan panduan gizi paling akurat, relevan, dan mudah
            diterapkan.
          </p>

          <ul className="mt-7 flex flex-col gap-3">
            {benefitChecklist.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-emerald-700"
                  aria-hidden="true"
                />
                <span className="text-sm font-bold leading-6 text-slate-700">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                  ease: 'easeOut',
                }}
                className={cn(
                  'min-h-40 rounded-[1.35rem] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10',
                  feature.surface,
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'flex size-14 shrink-0 items-center justify-center rounded-2xl',
                      feature.iconSurface,
                    )}
                  >
                    <Icon className="size-7" aria-hidden="true" />
                  </div>
                  <div>
                    <h3
                      className={cn('text-base font-black', feature.titleColor)}
                    >
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
