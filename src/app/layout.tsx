import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
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
  title: "3D Magza - 3D Baskı Ürünleri",
  description:
    "3D baskı teknolojisiyle üretilmiş özel tasarım ürünler. Kendi 3D modelinizi yükleyin, size özel basalım.",
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
      <body className="flex min-h-full flex-col">
        <SessionProvider>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
