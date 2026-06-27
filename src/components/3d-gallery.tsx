"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Inline3DViewer } from "./inline-3d-viewer";

interface GalleryProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
}

const SHAPES = [
  { bg: "from-cyan-500/30 to-blue-600/30", border: "border-cyan-400/30", icon: "◆", geo: "torusKnot" as const, color: "#7c9eff" },
  { bg: "from-amber-500/30 to-orange-600/30", border: "border-amber-400/30", icon: "●", geo: "sphere" as const, color: "#f59e0b" },
  { bg: "from-green-500/30 to-teal-600/30", border: "border-green-400/30", icon: "■", geo: "box" as const, color: "#10b981" },
  { bg: "from-red-500/30 to-rose-600/30", border: "border-red-400/30", icon: "⬢", geo: "cylinder" as const, color: "#ef4444" },
  { bg: "from-purple-500/30 to-pink-600/30", border: "border-purple-400/30", icon: "▲", geo: "cone" as const, color: "#a78bfa" },
  { bg: "from-pink-500/30 to-rose-600/30", border: "border-pink-400/30", icon: "❋", geo: "torus" as const, color: "#ec4899" },
];

interface Props {
  products: GalleryProduct[];
}

export function ThreeDGallery({ products }: Props) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (products.length === 0) return null;

  const displayItems = products.slice(0, 6);

  return (
    <section className="relative border-t border-white/5 px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            3D <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">Ürün Galerisi</span>
          </h2>
          <p className="mt-2 text-gray-400">Modeli döndür, ürünü keşfet — {isDesktop ? "masaüstünde 3D" : "dokun ve kaydır"}</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {displayItems.map((product, i) => {
            const shape = SHAPES[i % SHAPES.length];
            const desktop3d = mounted && isDesktop;

            return (
              <motion.a
                key={product.id}
                href={`/magaza/${product.slug}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10">
                  <div className="flex aspect-square items-center justify-center">
                    {desktop3d ? (
                      /* Desktop: gerçek 3D viewport */
                      <div className="h-full w-full">
                        <Inline3DViewer
                          geometry={shape.geo}
                          color={shape.color}
                          className="h-full w-full"
                        />
                      </div>
                    ) : (
                      /* Mobile/tablet: CSS animasyon */
                      <div
                        className={`flex h-20 w-20 items-center justify-center rounded-2xl border-2 ${shape.border} bg-gradient-to-br ${shape.bg} shadow-xl`}
                        style={{
                          animation: `gallery-spin 6s ease-in-out infinite`,
                          animationDelay: `${i * 0.3}s`,
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <span className="text-3xl text-white/80 drop-shadow-lg" style={{
                          animation: `gallery-icon 6s ease-in-out infinite`,
                          animationDelay: `${i * 0.3}s`,
                        }}>
                          {shape.icon}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/[0.06] p-2.5">
                    <h3 className="truncate text-xs font-medium text-white transition-colors group-hover:text-cyan-300">
                      {product.name}
                    </h3>
                    <p className="mt-0.5 text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                      {product.price.toFixed(2)} ₺
                    </p>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes gallery-spin {
          0%, 100% { transform: perspective(400px) rotateY(0deg) rotateX(8deg); }
          25% { transform: perspective(400px) rotateY(90deg) rotateX(15deg); }
          50% { transform: perspective(400px) rotateY(180deg) rotateX(8deg); }
          75% { transform: perspective(400px) rotateY(270deg) rotateX(0deg); }
        }
        @keyframes gallery-icon {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
          50% { transform: scale(1.3) rotate(180deg); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
