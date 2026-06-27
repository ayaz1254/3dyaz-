"use client";

import { motion } from "motion/react";

const STEPS = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    title: "Dosyanı Yükle",
    desc: "STL, OBJ veya 3MF dosyanı yükle, biz sana özel fiyat teklifi verelim.",
    accent: "from-cyan-500 to-blue-600",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7V5a2 2 0 012-2h12a2 2 0 012 2v2M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M4 7h16m-6 5h-4m-1 4h6" />
      </svg>
    ),
    title: "Malzemeyi Seç",
    desc: "PLA, Reçine veya PETG arasından seçim yap, rengini belirle. Renkler dans ediyor!",
    accent: "from-amber-500 to-orange-600",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Kapında",
    desc: "Profesyonel baskı kalitesiyle ürünün hızlıca kapında. Kargo takibi SMS ile bildirilir.",
    accent: "from-green-500 to-teal-600",
  },
];

export function NasilCalisirAnimated() {
  return (
    <section className="relative px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">Nasıl Çalışır?</h2>
          <p className="mt-2 text-gray-400">3 boyutlu baskı siparişin 3 adımda kapında</p>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* connecting lines */}
          <div className="pointer-events-none absolute left-1/2 top-16 hidden h-px w-[calc(100%-4rem)] -translate-x-1/2 bg-gradient-to-r from-cyan-500/0 via-cyan-500/40 to-teal-500/0 md:block" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.2, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step number */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 + 0.2, type: "spring", stiffness: 200 }}
                className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.accent} shadow-lg`}
              >
                <div className="text-white">{step.icon}</div>
              </motion.div>

              {/* Step badge */}
              <div className="mb-2 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-0.5 text-[11px] font-medium text-gray-400 backdrop-blur-sm">
                Adım {i + 1}
              </div>

              <h3 className="mb-2 text-lg font-bold text-white">{step.title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-gray-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <a
            href="/magaza"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40"
          >
            <span className="relative z-10">Hemen Başla</span>
            <svg className="relative z-10 h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan-400 to-blue-500 transition group-hover:translate-x-0" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
