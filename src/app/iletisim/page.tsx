"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { GlassCard } from "@/components/glass-card";

export default function IletisimPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[30vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/3 h-72 w-72 animate-float rounded-full bg-cyan-500/10 blur-[100px]" />
          <div className="absolute right-1/4 top-1/4 h-64 w-64 animate-float rounded-full bg-blue-600/10 blur-[120px]" style={{ animationDelay: "-2s" }} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.08),transparent_60%)]" />
        <div className="relative text-center">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-300 backdrop-blur-sm">
              İletişim
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Bize Ulaşın</h1>
            <p className="mx-auto max-w-xl text-lg text-gray-400">
              Sorularınız, önerileriniz veya siparişlerinizle ilgili her konuda bize yazın.
            </p>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
      </section>

      {/* Content */}
      <section className="relative px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Contact Info */}
            <div className="space-y-6">
              <GlassCard>
                <div className="space-y-6 p-6">
                  <h2 className="text-xl font-bold text-white">İletişim Bilgileri</h2>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">E-posta</p>
                      <a href="mailto:info@3dmagza.com" className="text-sm text-gray-400 transition hover:text-cyan-400">info@3dmagza.com</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-1.102-1.03-1.847-2.263-2.062-2.645-.215-.382-.022-.59.16-.779.163-.169.362-.442.543-.663.181-.222.241-.374.362-.623.121-.249.06-.468-.03-.65-.092-.182-.667-1.607-.914-2.2-.24-.577-.485-.478-.668-.48-.172-.002-.37-.003-.568-.003s-.519.074-.79.372c-.272.297-1.036 1.009-1.036 2.46 0 1.452 1.057 2.854 1.204 3.052.148.197 2.08 3.176 5.04 4.454.704.303 1.254.485 1.683.623.709.227 1.354.195 1.864.118.57-.086 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">WhatsApp</p>
                      <a href="https://wa.me/905555555555" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 transition hover:text-green-400">0555 555 55 55</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Adres</p>
                      <p className="text-sm text-gray-400">İstanbul, Türkiye</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Çalışma Saatleri</p>
                      <p className="text-sm text-gray-400">Hafta içi: 09:00 - 18:00</p>
                      <p className="text-sm text-gray-400">Cumartesi: 10:00 - 15:00</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h3 className="mb-3 text-sm font-medium text-white">Bizi Takip Edin</h3>
                    <div className="flex gap-3">
                      {[
                        { href: "https://www.instagram.com/3dmagza", label: "Instagram", color: "hover:text-pink-400" },
                        { href: "https://www.tiktok.com/@3dmagza", label: "TikTok", color: "hover:text-purple-400" },
                        { href: "https://www.facebook.com/3dmagza", label: "Facebook", color: "hover:text-blue-500" },
                      ].map((s) => (
                        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={`rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400 transition ${s.color}`}>
                          {s.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Contact Form */}
            <div>
              <GlassCard>
                <div className="p-6">
                  <h2 className="mb-6 text-xl font-bold text-white">Mesaj Gönder</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-300">Adınız *</label>
                        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500/50" placeholder="Adınız Soyadınız" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-300">E-posta *</label>
                        <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500/50" placeholder="ornek@mail.com" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-300">Konu</label>
                      <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500/50" placeholder="Konu" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-300">Mesajınız *</label>
                      <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500/50 resize-none" placeholder="Mesajınızı yazın..." />
                    </div>
                    <button type="submit" className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40">
                      {sent ? "✓ Gönderildi" : "Mesajı Gönder"}
                    </button>
                  </form>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
