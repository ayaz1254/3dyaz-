"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { GlassCard } from "@/components/glass-card";
import { ScrollReveal } from "@/components/scroll-reveal";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  category: { name: string; slug: string } | null;
  createdAt: string;
}

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Props {
  featuredProducts: ProductData[];
  categories: CategoryData[];
}

function FadeInSection({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

function ProductBadgesInline({ product }: { product: ProductData }) {
  const hasDiscount = product.comparePrice != null && Number(product.comparePrice) > Number(product.price);
  const discountPercent = hasDiscount ? Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100) : 0;
  const isNew = Date.now() - new Date(product.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;

  return (
    <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-2">
      {isNew && (
        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/20">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Yeni
        </span>
      )}
      {hasDiscount && (
        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-rose-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-red-500/20">
          %{discountPercent} İndirim
        </span>
      )}
    </div>
  );
}

export function HomeClient({ featuredProducts, categories }: Props) {
  return (
    <div className="flex flex-1 flex-col">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4">
        {/* floating orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-72 w-72 animate-float rounded-full bg-cyan-500/10 blur-[100px]" />
          <div className="absolute right-1/4 top-1/3 h-96 w-96 animate-float rounded-full bg-blue-600/10 blur-[120px]" style={{ animationDelay: "-2s" }} />
          <div className="absolute bottom-1/4 left-1/3 h-64 w-64 animate-float rounded-full bg-teal-400/10 blur-[80px]" style={{ animationDelay: "-4s" }} />
        </div>

        {/* gradient mesh overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.08),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(45,212,191,0.05),transparent_60%)]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            {/* badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-300 backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-glow-pulse" />
              3D Baskı & Tasarım
            </div>

            <h1 className="mb-4 text-5xl font-bold tracking-tight text-white md:text-7xl">
              Hayalini
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-teal-300 bg-clip-text text-transparent">
                Basıyoruz
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">
              3D baskı teknolojisiyle üretilmiş özel tasarım ürünler.
              Kendi modelini yükle, sana özel basalım.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/urunler"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40"
              >
                <span className="relative z-10">Ürünleri İncele</span>
                <span className="relative z-10 transition group-hover:translate-x-1">→</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan-400 to-blue-500 transition group-hover:translate-x-0" />
              </Link>
              <Link
                href="/yukle"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/10"
              >
                Kendi Tasarımını Yükle
              </Link>
            </div>
          </motion.div>
        </div>

        {/* bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
      </section>

      {/* ── Featured Products ── */}
      <section className="relative px-4 py-24">
        <FadeInSection>
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">Öne Çıkan Ürünler</h2>
                <p className="mt-2 text-gray-400">En popüler 3D baskı ürünleri</p>
              </div>
              <Link
                href="/urunler"
                className="hidden items-center gap-1 text-sm text-cyan-400 transition hover:text-cyan-300 md:flex"
              >
                Tümünü Gör →
              </Link>
            </div>

            {featuredProducts.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-8 py-20 text-center backdrop-blur-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10">
                  <svg className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-300">Henüz ürün bulunmuyor</h3>
                <p className="text-sm text-gray-500">Yeni ürünler yakında eklenecek.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProducts.map((product, i) => (
                  <ScrollReveal key={product.id} delay={i * 0.1} direction="up">
                    <Link href={`/urunler/${product.slug}`} className="group block">
                      <GlassCard glowColor="rgba(56, 189, 248, 0.1)" hover3d>
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-800/50">
                          {/* Badges */}
                          <ProductBadgesInline product={product} />
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <div className="flex flex-col items-center gap-2 text-gray-500">
                                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs">Görsel Yok</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 space-y-1">
                          {product.category && (
                            <p className="text-xs font-medium text-cyan-400">{product.category.name}</p>
                          )}
                          <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                            {product.price.toFixed(2)} ₺
                          </p>
                        </div>
                      </GlassCard>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            )}

            <Link
              href="/urunler"
              className="mt-8 flex items-center justify-center gap-1 text-sm text-cyan-400 transition hover:text-cyan-300 md:hidden"
            >
              Tümünü Gör →
            </Link>
          </div>
        </FadeInSection>
      </section>

      {/* ── Categories ── */}
      {categories.length > 0 && (
        <section className="relative border-t border-white/5 px-4 py-24">
          <FadeInSection>
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-white">Kategoriler</h2>
                <p className="mt-2 text-gray-400">İlginizi çekecek ürünleri keşfedin</p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {categories.map((cat, i) => (
                  <ScrollReveal key={cat.id} delay={i * 0.08} direction="up">
                    <Link
                      href={`/urunler?category=${cat.slug}`}
                      className="group block"
                    >
                      <GlassCard glowColor="rgba(45, 212, 191, 0.08)" hover3d>
                        <div className="flex flex-col items-center py-6 text-center">
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400/20 to-cyan-500/20 text-xl">
                            <div className="h-6 w-6 rounded border border-teal-400/40" />
                          </div>
                          <h3 className="font-semibold text-white group-hover:text-teal-300 transition-colors">
                            {cat.name}
                          </h3>
                          {cat.description && (
                            <p className="mt-1 text-xs text-gray-500">{cat.description}</p>
                          )}
                        </div>
                      </GlassCard>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </FadeInSection>
        </section>
      )}

      {/* ── Stats ── */}
      <section className="relative border-t border-white/5 px-4 py-20">
        <FadeInSection>
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "Mutlu Müşteri", value: "500+", icon: "😊" },
                { label: "Ürün Çeşidi", value: "1.000+", icon: "🎯" },
                { label: "Aynı Gün Kargo", value: "Saat 15:00'e", icon: "🚚" },
                { label: "Başarılı Baskı", value: "10.000+", icon: "🏆" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-8 text-center backdrop-blur-sm"
                >
                  <span className="mb-2 block text-2xl">{stat.icon}</span>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ── How It Works ── */}
      <section className="relative px-4 py-24">
        <FadeInSection>
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-bold text-white">Nasıl Çalışır?</h2>
              <p className="mt-2 text-gray-400">3D baskı siparişiniz 4 adımda kapınızda</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {[
                { step: "01", title: "Model Seç", desc: "Koleksiyonumuzdan ürün seç veya kendi modelini yükle." },
                { step: "02", title: "Özelleştir", desc: "Boyut, renk ve malzeme seçeneklerini belirle." },
                { step: "03", title: "Sipariş Ver", desc: "Güvenli ödeme ile siparişini tamamla." },
                { step: "04", title: "Kapında", desc: "Profesyonel baskı kalitesiyle ürünün kapında." },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="relative text-center"
                >
                  {i < 3 && (
                    <div className="pointer-events-none absolute left-[calc(50%+2rem)] top-8 hidden h-px w-[calc(100%-4rem)] bg-gradient-to-r from-cyan-500/40 to-transparent md:block" />
                  )}
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-xl font-bold text-cyan-300">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ── Özel Figür CTA ── */}
      <section className="relative border-t border-white/5 px-4 py-24">
        <FadeInSection>
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-300 backdrop-blur-sm">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Yeni Hizmet
                </div>
                <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
                  Fotoğraflarını{" "}
                  <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                    3D Figüre
                  </span>{" "}
                  Dönüştürelim
                </h2>
                <p className="mb-6 text-lg leading-relaxed text-gray-400">
                  Sevdiklerinin fotoğraflarını gönder, biz 3D modele dönüştürelim.
                  Özel günler için benzersiz hediyeler. Doğum günü, yıldönümü veya
                  özel anılar için kişiselleştirilmiş 3D baskı figürler.
                </p>
                <ul className="mb-8 space-y-3">
                  {[
                    "Fotoğraftan 3D model çıkarma",
                    "İstediğin boyut ve renkte baskı",
                    "Hızlı teslimat - 7-10 iş günü",
                    "Memnuniyet garantisi",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="h-4 w-4 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/ozel-figur"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/40"
                >
                  <span className="relative z-10">Detaylı Bilgi</span>
                  <span className="relative z-10 transition group-hover:translate-x-1">→</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-amber-400 to-orange-500 transition group-hover:translate-x-0" />
                </Link>
              </div>
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/10 via-transparent to-orange-600/10 blur-3xl" />
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 text-4xl">
                      🎨
                    </div>
                    <p className="mb-2 text-2xl font-bold text-white">Özel Figür</p>
                    <p className="mb-6 text-gray-400">Fotoğraftan 3D baskı</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-center">
                        <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">599 ₺</p>
                        <p className="text-xs text-gray-500">Küçük (10cm)</p>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-center">
                        <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">999 ₺</p>
                        <p className="text-xs text-gray-500">Orta (15cm)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ── Testimonials ── */}
      <section className="relative border-t border-white/5 px-4 py-24">
        <FadeInSection>
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-white">Müşteri Yorumları</h2>
              <p className="mt-2 text-gray-400">Müşterilerimizin memnuniyeti bizim için önemli</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  name: "Ahmet Y.",
                  text: "Çok kaliteli baskı, tam istediğim gibi oldu. Sipariş sürecindeki iletişim de çok iyiydi. Herkese tavsiye ederim.",
                  rating: 5,
                  role: "Teknik Çizim",
                },
                {
                  name: "Elif K.",
                  text: "Oğlumun fotoğrafından heykelcik yaptırdım, harika oldu! Doğum günü hediyesi olarak verdim, çok mutlu oldu. Teşekkürler 3D Magza.",
                  rating: 5,
                  role: "Özel Figür",
                },
                {
                  name: "Mehmet D.",
                  text: "İlk 3D baskı deneyimimdi, süreç çok kolaydı. STL dosyamı yükledim, 3 gün içinde kapımdaydı. Fiyat/performans harika.",
                  rating: 5,
                  role: "STL Yükleme",
                },
              ].map((review, i) => (
                <motion.div
                  key={review.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <GlassCard glowColor="rgba(250, 204, 21, 0.05)">
                    <div className="p-6">
                      <div className="mb-3 flex items-center gap-1 text-yellow-400">
                        {[...Array(review.rating)].map((_, j) => (
                          <svg key={j} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="mb-4 text-sm leading-relaxed text-gray-400">
                        "{review.text}"
                      </p>
                      <div className="flex items-center gap-2 border-t border-white/5 pt-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-xs font-medium text-cyan-300">
                          {review.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{review.name}</p>
                          <p className="text-xs text-gray-500">{review.role}</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ── Blog Teaser ── */}
      <section className="relative border-t border-white/5 px-4 py-24">
        <FadeInSection>
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">Blog</h2>
                <p className="mt-2 text-gray-400">3D baskı dünyasından haberler ve ipuçları</p>
              </div>
              <Link
                href="/blog"
                className="hidden items-center gap-1 text-sm text-cyan-400 transition hover:text-cyan-300 md:flex"
              >
                Tümünü Gör →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  title: "3D Baskı Teknolojisi Nedir? Nasıl Çalışır?",
                  excerpt: "3D baskı teknolojisinin temel prensiplerini ve kullanım alanlarını keşfedin.",
                  image: "https://placehold.co/800x500/1a1a2e/cyan?text=3D+Baski",
                  date: "15 Mayıs 2024",
                  slug: "3d-baski-teknolojisi-nedir",
                },
                {
                  title: "PLA vs PETG vs ABS: Doğru Filament Seçimi",
                  excerpt: "Projeniz için en uygun filament türünü seçmenize yardımcı olacak rehber.",
                  image: "https://placehold.co/800x500/1a1a2e/cyan?text=Filament",
                  date: "8 Mayıs 2024",
                  slug: "pla-vs-petg-vs-abs",
                },
                {
                  title: "3D Baskı ile Özel Hediye Fikirleri",
                  excerpt: "Sevdikleriniz için 3D baskı ile hazırlayabileceğiniz yaratıcı hediye fikirleri.",
                  image: "https://placehold.co/800x500/1a1a2e/cyan?text=Hediye",
                  date: "1 Mayıs 2024",
                  slug: "3d-baski-ozel-hediye-fikirleri",
                },
              ].map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <GlassCard glowColor="rgba(56, 189, 248, 0.06)" hover3d>
                      <div className="aspect-[8/5] overflow-hidden rounded-xl bg-gray-800/50">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="mt-4 space-y-2">
                        <p className="text-xs text-gray-500">{post.date}</p>
                        <h3 className="font-semibold text-white transition-colors group-hover:text-cyan-300">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-400">{post.excerpt}</p>
                        <p className="mt-2 text-xs font-medium text-cyan-400 transition-colors group-hover:text-cyan-300">
                          Devamını Oku →
                        </p>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
            <Link
              href="/blog"
              className="mt-8 flex items-center justify-center gap-1 text-sm text-cyan-400 transition hover:text-cyan-300 md:hidden"
            >
              Tümünü Gör →
            </Link>
          </div>
        </FadeInSection>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative px-4 py-24">
        <FadeInSection>
          <div className="mx-auto max-w-3xl">
            <GlassCard glowColor="rgba(56, 189, 248, 0.15)">
              <div className="flex flex-col items-center px-6 py-14 text-center">
                <div className="mb-6 inline-flex rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-600/20 p-3">
                  <svg className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <h2 className="mb-4 text-3xl font-bold text-white">
                  Kendi Tasarımını Bas
                </h2>
                <p className="mb-8 max-w-lg text-gray-400">
                  STL, OBJ veya 3MF dosyanı yükle, sana özel fiyat teklifi verelim.
                  Profesyonel 3D baskı kalitesiyle tasarımını gerçeğe dönüştürelim.
                </p>
                <Link
                  href="/yukle"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40"
                >
                  <span className="relative z-10">Hemen Yükle</span>
                  <svg className="relative z-10 h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan-400 to-blue-500 transition group-hover:translate-x-0" />
                </Link>
              </div>
            </GlassCard>
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}
