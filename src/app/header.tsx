"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getCartCount } from "@/lib/cart";
import { getWishlistCount } from "@/lib/wishlist";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setCartCount(getCartCount());
    setWishlistCount(getWishlistCount());
    const cartHandler = () => setCartCount(getCartCount());
    const wishlistHandler = () => setWishlistCount(getWishlistCount());
    window.addEventListener("cart-update", cartHandler);
    window.addEventListener("wishlist-update", wishlistHandler);
    return () => {
      window.removeEventListener("cart-update", cartHandler);
      window.removeEventListener("wishlist-update", wishlistHandler);
    };
  }, []);

  const isHome = pathname === "/";
  const isMagaza = pathname.startsWith("/magaza") || pathname.startsWith("/urunler");
  const isAdmin = session?.user?.role === "admin";

  const navigate = (href: string) => {
    if (href.startsWith("#") && isHome) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(href);
    }
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0c0d]/70 backdrop-blur-xl py-4 shadow-lg border-b border-white/5"
            : "bg-transparent py-6"
        }`}
        style={{ zIndex: 9999, top: "var(--announcement-height, 0px)" }}
      >
        <div className="mx-auto max-w-6xl px-6 flex justify-between items-center">
          {/* Logo */}
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative overflow-hidden rounded-lg bg-[#181a1b] p-1 border border-white/5">
              <img
                alt="Logo"
                className={`w-auto object-contain transition-all duration-300 ${scrolled ? "h-8" : "h-10"}`}
                src="/assets/logo-aVgpWd04.webp"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className={`font-bold tracking-tight transition-all duration-300 ${scrolled ? "text-lg" : "text-xl"}`}>
                <span className="text-white">3D</span>
                <span className="text-[#05cc47]">Magza</span>
              </span>
            </div>
          </div>

          {/* ─── DESKTOP NAV ─── */}
          {isMagaza ? (
            /* ── MAĞAZA MODU ── */
            <div className="hidden md:flex items-center gap-8 flex-1 justify-end">
              {/* Özel Figür — solid green CTA */}
              <Link
                href="/ozel-figur"
                className="bg-[#05cc47] hover:bg-[#4dc47d] text-black font-bold px-6 py-2 rounded-full transition-all hover:scale-105 animate-pulse-glow whitespace-nowrap"
              >
                Özel Figür
              </Link>

              {/* STL Yükle */}
              <Link
                href="/yukle"
                className="text-sm font-medium text-white/60 hover:text-white transition-colors whitespace-nowrap"
              >
                STL Yükle
              </Link>

              {/* Sipariş Takip */}
              <Link
                href="/siparis-takip"
                className="text-sm font-medium text-white/60 hover:text-white transition-colors whitespace-nowrap"
              >
                Sipariş Takip
              </Link>

              {/* ── Sağ ikon grubu ── */}
              <div className="flex items-center gap-2 ml-4">
                {/* Favoriler */}
                <Link
                  href="/favoriler"
                  className="relative flex items-center justify-center w-9 h-9 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#05cc47] text-[7px] font-bold text-black">
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Sepet */}
                <Link
                  href="/sepet"
                  className="relative flex items-center justify-center w-9 h-9 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#05cc47] text-[7px] font-bold text-black">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* Kullanıcı */}
                <Link
                  href={session?.user ? "/dashboard" : "/login"}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </Link>

                {/* Admin (yalnızca admin) */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Admin</span>
                  </Link>
                )}
              </div>

              {/* Ana Sayfa — outlined */}
              <Link
                href="/"
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 text-white/80 font-medium text-sm hover:bg-white/5 hover:text-white hover:border-white/30 transition-all whitespace-nowrap"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span>Ana Sayfa</span>
              </Link>
            </div>
          ) : (
            /* ── NORMAL MOD ── */
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => navigate(isHome ? "#hizmetler" : "/#hizmetler")}
                className="text-sm font-medium hover:text-[#05cc47] transition-colors bg-transparent border-none cursor-pointer text-white"
              >
                <span>Hizmetler</span>
              </button>
              <button
                onClick={() => navigate(isHome ? "#surec" : "/#surec")}
                className="text-sm font-medium hover:text-[#05cc47] transition-colors bg-transparent border-none cursor-pointer text-white"
              >
                <span>Süreç</span>
              </button>
              <button
                onClick={() => navigate(isHome ? "#hakkimizda" : "/#hakkimizda")}
                className="text-sm font-medium hover:text-[#05cc47] transition-colors bg-transparent border-none cursor-pointer text-white"
              >
                <span>Hakkımızda</span>
              </button>
              <button
                onClick={() => navigate("/iletisim")}
                className="text-sm font-medium hover:text-[#05cc47] transition-colors bg-transparent border-none cursor-pointer text-white"
              >
                <span>İletişim</span>
              </button>
              <button
                onClick={() => navigate("/blog")}
                className="text-sm font-medium hover:text-[#05cc47] transition-colors bg-transparent border-none cursor-pointer text-white"
              >
                <span>Blog</span>
              </button>

              {/* ── Sağ ikon grubu ── */}
              <div className="flex items-center gap-2 ml-4">
                {/* Favoriler */}
                <Link
                  href="/favoriler"
                  className="relative flex items-center justify-center w-9 h-9 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#05cc47] text-[7px] font-bold text-black">
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Sepet */}
                <Link
                  href="/sepet"
                  className="relative flex items-center justify-center w-9 h-9 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#05cc47] text-[7px] font-bold text-black">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* Kullanıcı */}
                <Link
                  href={session?.user ? "/dashboard" : "/login"}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </Link>

                {/* Admin (yalnızca admin) */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Admin</span>
                  </Link>
                )}
              </div>

              {/* Mağaza — outlined green pill */}
              <a
                href="/magaza"
                className="group flex items-center gap-2 px-5 py-2 rounded-full border border-[#05cc47]/30 bg-[#05cc47]/5 text-[#05cc47] font-bold text-sm tracking-wide hover:bg-[#05cc47] hover:text-black hover:border-[#05cc47] transition-all duration-300 hover:shadow-[0_0_20px_rgba(5,204,71,0.3)]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:animate-bounce"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span>Mağaza</span>
              </a>

              {/* Sipariş Ver — solid green CTA */}
              <button
                onClick={() => router.push("/sepet")}
                className="bg-[#05cc47] hover:bg-[#4dc47d] text-black font-bold px-6 py-2 rounded-full transform transition-all hover:scale-105 animate-pulse-glow btn-shimmer"
              >
                Sipariş Ver
              </button>
            </div>
          )}

          {/* Mobile Hamburger */}
          <div className="md:hidden relative z-50">
            <button
              className="hamburger-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className={`hamburger-bar ${mobileOpen ? "bg-white" : ""}`} />
              <span className={`hamburger-bar ${mobileOpen ? "bg-white" : ""}`} />
              <span className={`hamburger-bar ${mobileOpen ? "bg-white" : ""}`} />
            </button>
          </div>
        </div>


      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 right-0 bg-[#0a0c0d]/95 backdrop-blur-xl border-b border-white/5 pt-24 pb-8">
            <div className="flex flex-col gap-2 px-6">
              {isMagaza ? (
                <>
                  {/* Mağaza mobil menü */}
                  <Link
                    href="/ozel-figur"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/5 text-left"
                  >
                    <svg className="h-5 w-5 text-[#05cc47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <span className="text-sm font-medium text-white">Özel Figür</span>
                  </Link>
                  <Link
                    href="/yukle"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/5 text-left"
                  >
                    <svg className="h-5 w-5 text-[#05cc47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-sm font-medium text-white">STL Yükle</span>
                  </Link>
                  <Link
                    href="/siparis-takip"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/5 text-left"
                  >
                    <svg className="h-5 w-5 text-[#05cc47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                    <span className="text-sm font-medium text-white">Sipariş Takip</span>
                  </Link>
                  {/* ── Mobil ikon satırı (Favori / Sepet / Hesap / Admin) ── */}
                  <div className="flex items-center justify-around gap-2 mt-4 pt-4 border-t border-white/10">
                    <Link
                      href="/favoriler"
                      onClick={() => setMobileOpen(false)}
                      className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/5 text-white/70"
                    >
                      <span className="relative">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        {wishlistCount > 0 && (
                          <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#05cc47] text-[7px] font-bold text-black">
                            {wishlistCount > 9 ? "9+" : wishlistCount}
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] font-medium">Favoriler</span>
                    </Link>
                    <Link
                      href="/sepet"
                      onClick={() => setMobileOpen(false)}
                      className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/5 text-white/70"
                    >
                      <span className="relative">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        {cartCount > 0 && (
                          <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#05cc47] text-[7px] font-bold text-black">
                            {cartCount > 9 ? "9+" : cartCount}
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] font-medium">Sepet</span>
                    </Link>
                    <Link
                      href={session?.user ? "/dashboard" : "/login"}
                      onClick={() => setMobileOpen(false)}
                      className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/5 text-white/70"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      <span className="text-[10px] font-medium">{session?.user ? "Hesabım" : "Giriş"}</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-amber-500/10 text-amber-400"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992.007.085.007.17 0 .255-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124-.074.04-.147.083-.22.128-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87-.074-.04-.147-.083-.22-.127-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-[10px] font-medium">Admin</span>
                      </Link>
                    )}
                  </div>

                  {isMagaza && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <Link
                        href="/"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-white/20 text-white/80 font-medium text-sm hover:bg-white/5 transition-all"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        <span>Ana Sayfa</span>
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Normal mobil menü */}
                  <button onClick={() => navigate(isHome ? "#hizmetler" : "/#hizmetler")} className="text-sm font-medium text-white/80 hover:text-[#05cc47] transition-colors py-3 px-4 rounded-lg hover:bg-white/5 text-left">Hizmetler</button>
                  <button onClick={() => navigate(isHome ? "#surec" : "/#surec")} className="text-sm font-medium text-white/80 hover:text-[#05cc47] transition-colors py-3 px-4 rounded-lg hover:bg-white/5 text-left">Süreç</button>
                  <button onClick={() => navigate(isHome ? "#hakkimizda" : "/#hakkimizda")} className="text-sm font-medium text-white/80 hover:text-[#05cc47] transition-colors py-3 px-4 rounded-lg hover:bg-white/5 text-left">Hakkımızda</button>
                  <button onClick={() => navigate("/iletisim")} className="text-sm font-medium text-white/80 hover:text-[#05cc47] transition-colors py-3 px-4 rounded-lg hover:bg-white/5 text-left">İletişim</button>
                  <button onClick={() => navigate("/blog")} className="text-sm font-medium text-white/80 hover:text-[#05cc47] transition-colors py-3 px-4 rounded-lg hover:bg-white/5 text-left">Blog</button>

                  {/* ── Mobil ikon satırı (Favori / Sepet / Hesap / Admin) ── */}
                  <div className="flex items-center justify-around gap-2 mt-6 pt-6 border-t border-white/10">
                    <Link
                      href="/favoriler"
                      onClick={() => setMobileOpen(false)}
                      className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/5 text-white/70"
                    >
                      <span className="relative">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        {wishlistCount > 0 && (
                          <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#05cc47] text-[7px] font-bold text-black">
                            {wishlistCount > 9 ? "9+" : wishlistCount}
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] font-medium">Favoriler</span>
                    </Link>
                    <Link
                      href="/sepet"
                      onClick={() => setMobileOpen(false)}
                      className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/5 text-white/70"
                    >
                      <span className="relative">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        {cartCount > 0 && (
                          <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#05cc47] text-[7px] font-bold text-black">
                            {cartCount > 9 ? "9+" : cartCount}
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] font-medium">Sepet</span>
                    </Link>
                    <Link
                      href={session?.user ? "/dashboard" : "/login"}
                      onClick={() => setMobileOpen(false)}
                      className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/5 text-white/70"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      <span className="text-[10px] font-medium">{session?.user ? "Hesabım" : "Giriş"}</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-amber-500/10 text-amber-400"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992.007.085.007.17 0 .255-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124-.074.04-.147.083-.22.128-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87-.074-.04-.147-.083-.22-.127-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-[10px] font-medium">Admin</span>
                      </Link>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
                    <a href="/magaza" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[#05cc47]/30 text-[#05cc47] font-bold text-sm tracking-wide">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      <span>Mağaza</span>
                    </a>
                    <button onClick={() => navigate("/sepet")} className="flex items-center justify-center bg-[#05cc47] text-black font-bold px-5 py-3 rounded-full text-sm">Sipariş Ver</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/905555555555?text=Merhaba%2C%203D%20bask%C4%B1%20ile%20ilgili%20bir%20sorum%20var."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#05cc47] text-black shadow-lg shadow-[#05cc47]/20 transition-all hover:scale-110 hover:shadow-[#05cc47]/30"
        title="WhatsApp"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-1.102-1.03-1.847-2.263-2.062-2.645-.215-.382-.022-.59.16-.779.163-.169.362-.442.543-.663.181-.222.241-.374.362-.623.121-.249.06-.468-.03-.65-.092-.182-.667-1.607-.914-2.2-.24-.577-.485-.478-.668-.48-.172-.002-.37-.003-.568-.003s-.519.074-.79.372c-.272.297-1.036 1.009-1.036 2.46 0 1.452 1.057 2.854 1.204 3.052.148.197 2.08 3.176 5.04 4.454.704.303 1.254.485 1.683.623.709.227 1.354.195 1.864.118.57-.086 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  );
}
