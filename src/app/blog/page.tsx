"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { GlassCard } from "@/components/glass-card";
import { ScrollReveal } from "@/components/scroll-reveal";

const posts = [
  {
    title: "3D Baskı Teknolojisi Nedir? Nasıl Çalışır?",
    excerpt:
      "3D baskı teknolojisinin temel prensiplerini, kullanılan malzemeleri ve endüstriyel uygulamalarını detaylıca inceliyoruz.",
    image: "https://placehold.co/800x500/0a0a0f/cyan?text=3D+Baski+Teknolojisi",
    date: "15 Mayıs 2024",
    category: "Teknoloji",
    readTime: "5 dk",
    slug: "3d-baski-teknolojisi-nedir",
  },
  {
    title: "PLA vs PETG vs ABS: Doğru Filament Seçimi",
    excerpt:
      "Projeniz için en uygun filament türünü seçmenize yardımcı olacak kapsamlı bir rehber. PLA, PETG ve ABS filamentlerinin karşılaştırması.",
    image: "https://placehold.co/800x500/0a0a0f/cyan?text=Filament+Rehberi",
    date: "8 Mayıs 2024",
    category: "Malzeme",
    readTime: "7 dk",
    slug: "pla-vs-petg-vs-abs",
  },
  {
    title: "3D Baskı ile Özel Hediye Fikirleri",
    excerpt:
      "Sevdikleriniz için 3D baskı ile hazırlayabileceğiniz yaratıcı ve kişiselleştirilmiş hediye fikirlerini keşfedin.",
    image: "https://placehold.co/800x500/0a0a0f/cyan?text=Hediye+Fikirleri",
    date: "1 Mayıs 2024",
    category: "İlham",
    readTime: "4 dk",
    slug: "3d-baski-ozel-hediye-fikirleri",
  },
  {
    title: "FDM vs SLA: Hangisi Sizin İçin Uygun?",
    excerpt:
      "İki popüler 3D baskı teknolojisini karşılaştırıyoruz: FDM (filament) ve SLA (reçine). Hangisi ihtiyaçlarınıza daha uygun?",
    image: "https://placehold.co/800x500/0a0a0f/cyan?text=FDM+vs+SLA",
    date: "24 Nisan 2024",
    category: "Teknoloji",
    readTime: "6 dk",
    slug: "fdm-vs-sla-karsilastirmasi",
  },
  {
    title: "3D Modelleme İçin En İyi Ücretsiz Yazılımlar",
    excerpt:
      "Hiçbir ücret ödemeden 3D modelleme yapabileceğiniz en iyi ücretsiz yazılımları ve başlangıç rehberini sizler için derledik.",
    image: "https://placehold.co/800x500/0a0a0f/cyan?text=3D+Yazilim",
    date: "17 Nisan 2024",
    category: "Eğitim",
    readTime: "5 dk",
    slug: "ucretsiz-3d-modelleme-yazilimlari",
  },
  {
    title: "3D Baskıda Başarılı Çıktı İçin 10 İpucu",
    excerpt:
      "İlk 3D baskı deneyiminizden en iyi sonucu almak için bilmeniz gereken 10 önemli ipucu ve püf noktası.",
    image: "https://placehold.co/800x500/0a0a0f/cyan?text=Baski+Ipuclari",
    date: "10 Nisan 2024",
    category: "İpucu",
    readTime: "6 dk",
    slug: "basarili-3d-baski-icin-ipuclari",
  },
];

export default function BlogPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[35vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/3 h-72 w-72 animate-float rounded-full bg-cyan-500/10 blur-[100px]" />
          <div className="absolute right-1/3 top-1/4 h-64 w-64 animate-float rounded-full bg-blue-600/10 blur-[120px]" style={{ animationDelay: "-2s" }} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-300 backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" />
              3D Baskı Blogu
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Blog
            </h1>
            <p className="mx-auto max-w-xl text-lg text-gray-400">
              3D baskı dünyasından haberler, rehberler ve ilham verici içerikler.
            </p>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
      </section>

      {/* Posts Grid */}
      <section className="relative px-4 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <ScrollReveal key={post.slug} delay={i * 0.08}>
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <GlassCard glowColor="rgba(56, 189, 248, 0.08)" hover3d>
                    <div className="aspect-[8/5] overflow-hidden rounded-xl bg-gray-800/50">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-medium text-cyan-400">
                          {post.category}
                        </span>
                        <span className="text-[11px] text-gray-500">{post.readTime}</span>
                      </div>
                      <h3 className="font-semibold text-white transition-colors group-hover:text-cyan-300">
                        {post.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-400">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-gray-500">{post.date}</span>
                        <span className="text-xs font-medium text-cyan-400 transition-colors group-hover:text-cyan-300">
                          Devamını Oku →
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
