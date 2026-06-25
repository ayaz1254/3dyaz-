import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { AnimatedBackground } from "@/components/animated-background";
import { Header } from "./header";
import { Footer } from "./footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <head>
          <meta name="theme-color" content="#0a0a0f" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
      <body className="relative flex min-h-full flex-col">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-1 flex-col">
          <SessionProvider>
            <Header />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
