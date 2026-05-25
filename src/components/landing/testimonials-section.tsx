'use client';

import { testimonials } from '@/components/landing/landing-data';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <section className="bg-[#fbfdf8] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">
            Dipercaya oleh pengguna NutriScale
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.5,
                delay: index * 0.06,
                ease: 'easeOut',
              }}
              className="relative min-h-64 rounded-[1.35rem] border border-emerald-950/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10"
            >
              <Quote
                className="absolute right-5 top-5 size-8 text-emerald-100"
                aria-hidden="true"
              />
              <div className="flex gap-1" aria-label="Rating 5 dari 5">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className="size-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-600">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-full bg-emerald-50 text-sm font-black text-emerald-800 ring-1 ring-emerald-100">
                  {testimonial.initials}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-950">
                    {testimonial.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
