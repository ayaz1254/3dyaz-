"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { getCartCount } from "@/lib/cart";

function WhatsAppIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-1.102-1.03-1.847-2.263-2.062-2.645-.215-.382-.022-.59.16-.779.163-.169.362-.442.543-.663.181-.222.241-.374.362-.623.121-.249.06-.468-.03-.65-.092-.182-.667-1.607-.914-2.2-.24-.577-.485-.478-.668-.48-.172-.002-.37-.003-.568-.003s-.519.074-.79.372c-.272.297-1.036 1.009-1.036 2.46 0 1.452 1.057 2.854 1.204 3.052.148.197 2.08 3.176 5.04 4.454.704.303 1.254.485 1.683.623.709.227 1.354.195 1.864.118.57-.086 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getCartCount());
    const handler = () => setCartCount(getCartCount());
    window.addEventListener("cart-update", handler);
    return () => window.removeEventListener("cart-update", handler);
  }, []);

  const navLinks = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/urunler", label: "Ürünler" },
    { href: "/ozel-figur", label: "Özel Figür" },
    { href: "/blog", label: "Blog" },
    { href: "/yukle", label: "STL Yükle" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50">
        <div className="absolute inset-0 border-b border-white/10 bg-[#0a0a0f]/70 backdrop-blur-2xl" />
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="group flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition group-hover:shadow-cyan-500/40">
              3D
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              Magza
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Social Icons */}
            <a
              href="https://www.instagram.com/3dmagza"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-pink-400"
              title="Instagram"
            >
              <InstagramIcon />
            </a>

            {/* Sepet */}
            <Link
              href="/sepet"
              className="relative rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
            >
              Sepet
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-[10px] font-bold text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-lg px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                >
                  Hesabım
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="rounded-lg px-3 py-2 text-sm text-amber-400 transition hover:bg-amber-400/10"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-400/10"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                >
                  Giriş
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-50 rounded-lg p-2 text-gray-300 hover:bg-white/5 md:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="relative border-t border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl"
            >
              <nav className="flex flex-col gap-1 px-4 py-4">
                {[
                  ...navLinks,
                  { href: "/sepet", label: `Sepet${cartCount > 0 ? ` (${cartCount})` : ""}` },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Social */}
                <div className="mt-3 flex items-center gap-3 border-t border-white/5 pt-3">
                  <span className="text-xs text-gray-500">Sosyal:</span>
                  <a href="https://www.instagram.com/3dmagza" target="_blank" rel="noopener noreferrer" className="rounded-lg p-1.5 text-gray-400 transition hover:text-pink-400">
                    <InstagramIcon />
                  </a>
                </div>

                {session?.user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5">Hesabım</Link>
                    {session.user.role === "ADMIN" && <Link href="/admin" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-amber-400 hover:bg-amber-400/10">Admin</Link>}
                    <button onClick={() => signOut({ callbackUrl: "/" })} className="rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-400/10">Çıkış</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5">Giriş</Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)} className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-center text-sm font-medium text-white">Kayıt Ol</Link>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/905555555555?text=Merhaba%2C%203D%20bask%C4%B1%20ile%20ilgili%20bir%20sorum%20var."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg shadow-green-500/30 transition-all hover:scale-110 hover:shadow-green-500/50"
        title="WhatsApp"
      >
        <WhatsAppIcon />
      </a>
    </>
  );
}
