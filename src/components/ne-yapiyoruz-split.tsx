"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Lazy3D } from "./lazy-3d";
import { DynamicModelViewer } from "./dynamic-model-viewer";

interface SplitItem {
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
  modelUrl: string;
  modelColor?: string;
}

const SECTIONS: SplitItem[] = [
  {
    title: "Hayal Et — 3D'ye Dönüştürelim",
    badge: "3D Model Dönüşümü",
    badgeColor: "from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/20",
    description:
      "İster hazır koleksiyonumuzdan seç, ister kendi STL dosyanı yükle. Profesyonel 3D baskı teknolojimizle hayalindeki ürünü gerçeğe dönüştürüyoruz.",
    features: [
      "Yüksek çözünürlüklü 3D baskı",
      "Geniş malzeme ve renk seçenekleri",
      "Hızlı teslimat süreçleri",
    ],
    cta: { label: "Koleksiyonu İncele →", href: "/magaza" },
    modelUrl: "/uploads/models/ejderha.stl",
    modelColor: "#7c9eff",
  },
  {
    title: "Tasarla — Kendi Modelini Oluştur",
    badge: "Kişiselleştirme",
    badgeColor: "from-amber-500/20 to-orange-600/20 text-amber-300 border-amber-500/20",
    description:
      "Sevdiklerinin fotoğraflarını 3D modele dönüştürüp baskısını alıyoruz. Doğum günü, yıldönümü veya özel anılar için eşsiz hediyeler.",
    features: [
      "Fotoğraftan 3D model çıkarma",
      "İstediğin boyut ve renk seçeneği",
      "7-10 iş günü hızlı teslimat",
    ],
    cta: { label: "Detaylı Bilgi →", href: "/ozel-figur" },
    modelUrl: "/uploads/models/satranc-sah.stl",
    modelColor: "#f59e0b",
  },
  {
    title: "Bas — Profesyonel Baskı",
    badge: "Özel Sipariş",
    badgeColor: "from-green-500/20 to-teal-600/20 text-green-300 border-green-500/20",
    description:
      "STL, OBJ veya 3MF dosyanı yükle, sana özel fiyat teklifi verelim. Endüstriyel kalitede 3D yazıcılarımızla prototip veya son ürün baskısı yapıyoruz.",
    features: [
      "STL / OBJ / 3MF desteği",
      "Anında fiyat teklifi",
      "Profesyonel baskı kalitesi",
    ],
    cta: { label: "Dosyanı Yükle →", href: "/yukle" },
    modelUrl: "/uploads/models/test-benchy.stl",
    modelColor: "#10b981",
  },
];

export function NeYapiyoruzSplit() {
  return (
    <section className="relative border-t border-white/5 px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Ne <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">Yapıyoruz</span>?
          </h2>
          <p className="mt-3 text-gray-400">3D baskı dünyasında hayalini gerçeğe dönüştürüyoruz</p>
        </motion.div>

        <div className="space-y-24">
          {SECTIONS.map((item, i) => (
            <SplitRow key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SplitRow({ item, index }: { item: SplitItem; index: number }) {
  const isReversed = index % 2 === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`grid items-center gap-10 lg:grid-cols-2 ${isReversed ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      {/* Text side */}
      <div>
        <div
          className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium backdrop-blur-sm ${item.badgeColor}`}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          {item.badge}
        </div>
        <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">{item.title}</h3>
        <p className="mb-6 leading-relaxed text-gray-400">{item.description}</p>
        <ul className="mb-8 space-y-3">
          {item.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
              <svg className="h-4 w-4 shrink-0 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
        <Link
          href={item.cta.href}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40"
        >
          <span className="relative z-10">{item.cta.label}</span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan-400 to-blue-500 transition group-hover:translate-x-0" />
        </Link>
      </div>

      {/* 3D Model side */}
      <div className="relative">
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-600/5 blur-3xl" />
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
          <Lazy3D height={320}>
            <DynamicModelViewer
              url={item.modelUrl}
              modelColor={item.modelColor}
              className="h-72 sm:h-80 md:h-96 w-full"
            />
          </Lazy3D>
        </div>
      </div>
    </motion.div>
  );
}
