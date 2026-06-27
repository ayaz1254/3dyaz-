import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "3D Magza - 3D Baskı Ürünleri",
    short_name: "3D Magza",
    description:
      "3D baskı teknolojisiyle üretilmiş özel tasarım ürünler. STL dosyanı yükle, size özel 3D basalım.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#0a0a0f",
    orientation: "portrait-primary",
    categories: ["shopping", "3d-printing", "lifestyle"],
    lang: "tr-TR",
    icons: [
      { src: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    screenshots: [],
  };
}
