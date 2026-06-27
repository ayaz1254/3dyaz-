import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { PwaRegister } from "@/components/pwa-register";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Header } from "./header";
import { Footer } from "./footer";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "3D Magza - 3D Baskı Ürünleri",
    template: "%s | 3D Magza",
  },
  description:
    "3D baskı teknolojisiyle üretilmiş özel tasarım ürünler. STL dosyanı yükle, size özel 3D basalım. Fotoğraftan 3D figür, özel heykelcik ve hediyelik eşya üretimi.",
  keywords: [
    "3D baskı",
    "3D yazıcı",
    "özel figür",
    "fotoğraftan heykel",
    "STL yükle",
    "3D model",
    "hediyelik eşya",
    "PLA baskı",
    "kişiye özel hediye",
    "3D Magza",
  ],
  authors: [{ name: "3D Magza" }],
  creator: "3D Magza",
  publisher: "3D Magza",
  metadataBase: new URL("https://3dmagza.com"),
  openGraph: {
    title: "3D Magza - 3D Baskı Ürünleri",
    description:
      "3D baskı teknolojisiyle üretilmiş özel tasarım ürünler. Kendi modelini yükle, fotoğrafından 3D figür yapalım.",
    type: "website",
    locale: "tr_TR",
    siteName: "3D Magza",
    url: "https://3dmagza.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "3D Magza - 3D Baskı Ürünleri",
    description:
      "3D baskı teknolojisiyle üretilmiş özel tasarım ürünler. Kendi modelini yükle, fotoğrafından 3D figür yapalım.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#05cc47" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="3D Magza" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <link rel="manifest" href="/manifest" />
      </head>
      <body className="relative flex min-h-full flex-col">
        {/* Subtle grid overlay — less intrusive than the 3D background */}
        <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px]" />
        <div className="relative z-10 flex flex-1 flex-col">
          <SessionProvider>
            <Header />
            <main className="flex flex-1 flex-col pb-16 md:pb-0">{children}</main>
            <Footer />
            <MobileBottomNav />
          </SessionProvider>
          <PwaRegister />
          <PwaInstallPrompt />
        </div>
      </body>
    </html>
  );
}
