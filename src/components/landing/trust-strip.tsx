'use client';

import { trustItems } from '@/components/landing/landing-data';
import { motion } from 'framer-motion';

export function TrustStrip() {
  return (
    <section id="fitur" className="relative bg-white px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl border border-emerald-950/10 bg-white shadow-xl shadow-emerald-950/5 md:grid-cols-2 lg:grid-cols-5"
      >
        {trustItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="flex gap-4 border-emerald-950/10 p-5 md:border-r lg:min-h-32"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  {item.title}
                </h2>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {item.description}
                </p>
              </div>
              {index === trustItems.length - 1 ? null : (
                <span className="sr-only">Berikutnya</span>
              )}
            </article>
          );
        })}
      </motion.div>
    </section>
  );
}
