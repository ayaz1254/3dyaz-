"use client";

import Link from "next/link";
import { useState } from "react";

function InstagramIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-1.102-1.03-1.847-2.263-2.062-2.645-.215-.382-.022-.59.16-.779.163-.169.362-.442.543-.663.181-.222.241-.374.362-.623.121-.249.06-.468-.03-.65-.092-.182-.667-1.607-.914-2.2-.24-.577-.485-.478-.668-.48-.172-.002-.37-.003-.568-.003s-.519.074-.79.372c-.272.297-1.036 1.009-1.036 2.46 0 1.452 1.057 2.854 1.204 3.052.148.197 2.08 3.176 5.04 4.454.704.303 1.254.485 1.683.623.709.227 1.354.195 1.864.118.57-.086 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  }

  return (
    <footer className="relative mt-auto border-t border-white/10 bg-[#0a0a0f]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-white">
                3D
              </span>
              <span className="text-lg font-bold text-white">Magza</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              3D baskı teknolojisiyle üretilmiş özel tasarım ürünler.
              Kendi 3D modelinizi yükleyin, size özel basalım.
            </p>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
                Bizi Takip Edin
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/3dmagza"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition hover:border-pink-500/30 hover:bg-pink-500/10 hover:text-pink-400"
                  title="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://www.tiktok.com/@3dmagza"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-400"
                  title="TikTok"
                >
                  <TikTokIcon />
                </a>
                <a
                  href="https://www.facebook.com/3dmagza"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition hover:border-blue-600/30 hover:bg-blue-600/10 hover:text-blue-500"
                  title="Facebook"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="https://wa.me/905555555555"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
                  title="WhatsApp"
                >
                  <WhatsAppIcon />
                </a>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/905555555555?text=Merhaba%2C%203D%20bask%C4%B1%20ile%20ilgili%20bir%20sorum%20var."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-600/20 px-4 py-2.5 text-sm font-medium text-green-400 transition hover:from-green-500/30 hover:to-emerald-600/30"
            >
              <WhatsAppIcon />
              <span>WhatsApp'tan Yazın</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Hızlı Linkler
            </h3>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/", label: "Ana Sayfa" },
                { href: "/urunler", label: "Ürünler" },
                { href: "/ozel-figur", label: "Özel Figür" },
                { href: "/yukle", label: "STL Yükle" },
                { href: "/blog", label: "Blog" },
                { href: "/sss", label: "SSS" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-400 transition hover:text-cyan-400"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Account + Trust */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Hesap
            </h3>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/login", label: "Giriş Yap" },
                { href: "/register", label: "Kayıt Ol" },
                { href: "/dashboard", label: "Hesabım" },
                { href: "/sepet", label: "Sepet" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-400 transition hover:text-cyan-400"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Trust Badges */}
            <div className="mt-6">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
                Güvenli Alışveriş
              </h4>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400">
                  <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  256-bit SSL
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400">
                  <svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Kredi Kartı
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400">
                  <svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Havale/EFT
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400">
                  <svg className="h-3.5 w-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  3D Secure
                </div>
              </div>
            </div>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
              İletişim
            </h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@3dmagza.com" className="transition hover:text-cyan-400">info@3dmagza.com</a>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="https://wa.me/905555555555" target="_blank" rel="noopener noreferrer" className="transition hover:text-cyan-400">
                  0555 555 55 55
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
                Bülten
              </h4>
              <p className="mb-3 text-xs text-gray-500">
                Kampanya ve yeni ürünlerden haberdar olun.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  required
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-500/50"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  {subscribed ? (
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Tamam
                    </span>
                  ) : (
                    "Abone Ol"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/5 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-gray-600 md:flex-row md:text-left">
            <p>&copy; {new Date().getFullYear()} 3D Magza. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-4">
              <Link href="/sss" className="transition hover:text-gray-400">SSS</Link>
              <span className="text-gray-700">•</span>
              <Link href="/iletisim" className="transition hover:text-gray-400">İletişim</Link>
              <span className="text-gray-700">•</span>
              <span className="transition hover:text-gray-400 cursor-default">KVKK</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
