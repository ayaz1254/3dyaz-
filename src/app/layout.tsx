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
    "3D baskı teknolojisiyle üretilmiş özel tasarım ürünler. Kendi 3D modelinizi yükleyin, size özel basalım.",
  openGraph: {
    title: "3D Magza - 3D Baskı Ürünleri",
    description:
      "3D baskı teknolojisiyle üretilmiş özel tasarım ürünler. Kendi 3D modelinizi yükleyin, size özel basalım.",
    type: "website",
    locale: "tr_TR",
    siteName: "3D Magza",
  },
  twitter: {
    card: "summary_large_image",
    title: "3D Magza - 3D Baskı Ürünleri",
    description:
      "3D baskı teknolojisiyle üretilmiş özel tasarım ürünler. Kendi 3D modelinizi yükleyin, size özel basalım.",
  },
  robots: {
    index: true,
    follow: true,
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
