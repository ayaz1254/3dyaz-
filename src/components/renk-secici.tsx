"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { DynamicModelViewer } from "./dynamic-model-viewer";
import { Lazy3D } from "./lazy-3d";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  fileUrl: string;
  image: string;
}

const COLORS = [
  { name: "Mavi", hex: "#7c9eff" },
  { name: "Altın", hex: "#f59e0b" },
  { name: "Yeşil", hex: "#10b981" },
  { name: "Kırmızı", hex: "#ef4444" },
  { name: "Mor", hex: "#a78bfa" },
  { name: "Pembe", hex: "#ec4899" },
  { name: "Beyaz", hex: "#e2e8f0" },
  { name: "Siyah", hex: "#1e293b" },
];

const MATERIALS = ["PLA", "Reçine", "PETG"];

interface Props {
  products: ProductData[];
}

export function RenkSecici({ products }: Props) {
  const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);

  const defaultProduct = products[0];

  if (!defaultProduct) return null;

  return (
    <section className="relative border-t border-white/5 px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Renk ve{' '}
            <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
              Malzeme
            </span>{' '}
            Seç
          </h2>
          <p className="mt-2 text-gray-400">Ürününü canlı önizle, istediğin gibi kişiselleştir</p>
        </motion.div>

        <div className="grid items-start gap-10 lg:grid-cols-2">
          {/* 3D Viewer */}
          <motion.div
            key={selectedColor + selectedMaterial}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm"
          >
            <Lazy3D height={350}>
              <DynamicModelViewer
                url={defaultProduct.fileUrl}
                modelColor={selectedColor}
                className="h-72 sm:h-80 lg:h-96 w-full"
              />
            </Lazy3D>
            <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
              {selectedMaterial}
            </div>
          </motion.div>

          {/* Controls */}
          <div>
            <div className="mb-8">
              <h3 className="mb-4 text-sm font-medium text-gray-300">Renk Seç</h3>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedColor(c.hex)}
                    className={`group relative flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all ${
                      selectedColor === c.hex
                        ? "border-cyan-400 shadow-lg shadow-cyan-500/20"
                        : "border-white/10 hover:border-white/30"
                    }`}
                    title={c.name}
                  >
                    <span
                      className="block h-6 w-6 rounded-lg"
                      style={{ backgroundColor: c.hex }}
                    />
                    {selectedColor === c.hex && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[8px] text-white">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-4 text-sm font-medium text-gray-300">Malzeme Seç</h3>
              <div className="flex flex-wrap gap-2">
                {MATERIALS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMaterial(m)}
                    className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${
                      selectedMaterial === m
                        ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-lg shadow-cyan-500/10"
                        : "border-white/10 text-gray-400 hover:border-white/30 hover:text-gray-200"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{defaultProduct.name}</p>
                  <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                    {defaultProduct.price.toFixed(2)} ₺
                  </p>
                </div>
                <span
                  className="block h-8 w-8 rounded-lg border border-white/10"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>
            </div>

            <Link
              href={`/magaza/${defaultProduct.slug}`}
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40"
            >
              <span className="relative z-10">Ürünü İncele</span>
              <svg className="relative z-10 h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan-400 to-blue-500 transition group-hover:translate-x-0" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
