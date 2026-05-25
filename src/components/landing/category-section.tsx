'use client';

import { categories } from '@/components/landing/landing-data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowUpRight, Leaf } from 'lucide-react';

type CategorySectionProps = {
  onStartAnalysis: () => void;
};

export function CategorySection({ onStartAnalysis }: CategorySectionProps) {
  return (
    <section
      id="kategori"
      className="relative overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-emerald-50/70 to-white" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
            <Leaf className="size-3.5" aria-hidden="true" />
            Profil nutrisi personal
          </div>
          <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">
            Kategori Nutrisi Khusus
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-500">
            Pilih profil yang sesuai dengan kondisi dan kebutuhan Anda.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.button
                key={category.title}
                type="button"
                onClick={onStartAnalysis}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                  ease: 'easeOut',
                }}
                className={cn(
                  'group relative min-h-[17rem] overflow-hidden rounded-[1.35rem] border p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-200',
                  category.tint,
                )}
              >
                <span className="absolute right-4 top-4 size-16 rounded-full bg-white/60 blur-xl" />
                <span
                  className={cn(
                    'relative flex size-16 items-center justify-center rounded-2xl',
                    category.iconWrap,
                  )}
                >
                  <Icon className="size-8" aria-hidden="true" />
                </span>
                <span className="mt-10 block">
                  <span className="block text-xl font-black text-slate-950">
                    {category.title}
                  </span>
                  <span className="mt-3 block text-sm leading-6 text-slate-600">
                    {category.description}
                  </span>
                </span>
                <span
                  className={cn(
                    'absolute bottom-5 right-5 flex size-10 items-center justify-center rounded-full transition group-hover:scale-105',
                    category.accent,
                  )}
                  aria-hidden="true"
                >
                  <ArrowUpRight className="size-4" />
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
