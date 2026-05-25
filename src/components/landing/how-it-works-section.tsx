'use client';

import { steps } from '@/components/landing/landing-data';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';

export function HowItWorksSection() {
  return (
    <section
      id="cara-kerja"
      className="relative bg-white px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
            <Leaf className="size-3.5" aria-hidden="true" />
            Tiga langkah mudah
          </div>
          <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">
            Cara Kerja NutriScale
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-500">
            Tiga langkah mudah menuju hidup lebih sehat.
          </p>
        </motion.div>

        <div className="relative mt-10 grid gap-5 lg:grid-cols-3">
          <div className="absolute left-[17%] right-[17%] top-1/2 hidden h-px border-t border-dashed border-emerald-300 lg:block" />
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.article
                key={step.step}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: 'easeOut',
                }}
                className="relative z-10 flex min-h-48 gap-5 rounded-[1.35rem] border border-emerald-950/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10"
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-emerald-700 text-base font-black text-white shadow-lg shadow-emerald-900/15">
                    {step.step}
                  </span>
                  <span className="grid size-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Icon className="size-8" aria-hidden="true" />
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 ? (
                  <ArrowRight
                    className="absolute -right-3 top-1/2 hidden size-6 -translate-y-1/2 rounded-full bg-white p-1 text-emerald-600 ring-1 ring-emerald-200 lg:block"
                    aria-hidden="true"
                  />
                ) : null}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
