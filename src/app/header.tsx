"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white dark:bg-gray-950">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          3D Magza
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium hover:text-blue-600">
            Ana Sayfa
          </Link>
          <Link href="/urunler" className="text-sm font-medium hover:text-blue-600">
            Ürünler
          </Link>
          <Link href="/yukle" className="text-sm font-medium hover:text-blue-600">
            STL Yükle
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:text-blue-600"
              >
                Hesabım
              </Link>
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/sepet"
                className="relative rounded-lg border px-3 py-1.5 text-sm"
              >
                Sepet
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium hover:text-blue-600"
              >
                Giriş
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 md:hidden"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="/" onClick={() => setMobileOpen(false)}>Ana Sayfa</Link>
            <Link href="/urunler" onClick={() => setMobileOpen(false)}>Ürünler</Link>
            <Link href="/yukle" onClick={() => setMobileOpen(false)}>STL Yükle</Link>
            <Link href="/sepet" onClick={() => setMobileOpen(false)}>Sepet</Link>
            {session?.user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>Hesabım</Link>
                {session.user.role === "ADMIN" && <Link href="/admin" onClick={() => setMobileOpen(false)}>Admin</Link>}
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-left text-red-600">Çıkış</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>Giriş</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>Kayıt Ol</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
