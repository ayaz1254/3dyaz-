"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { DynamicModelViewer } from "./dynamic-model-viewer";

interface FloatingModelProps {
  modelUrl: string;
  productSlug: string;
  productName: string;
  modelColor?: string;
}

export function FloatingModel({ modelUrl, productSlug, productName, modelColor = "#7c9eff" }: FloatingModelProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 3000);
    const hideTimer = setTimeout(() => setVisible(false), 23000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-24 right-4 z-40 md:bottom-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        <Link
          href={`/magaza/${productSlug}`}
          className="group block"
          title={productName}
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-gray-900/80 shadow-2xl shadow-amber-500/10 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/30 hover:shadow-amber-500/20">
            {/* Close button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDismissed(true);
              }}
              className="absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-[10px] text-white/60 backdrop-blur-sm transition hover:bg-black/70 hover:text-white"
              aria-label="Kapat"
            >
              ✕
            </button>

            {/* Mini 3D Viewer */}
            <div className="h-24 w-24 sm:h-28 sm:w-28">
              <DynamicModelViewer
                url={modelUrl}
                modelColor={modelColor}
                className="h-full w-full"
                style={{ background: "transparent", borderRadius: 0 }}
              />
            </div>

            {/* Label */}
            <div className="border-t border-white/[0.06] px-2.5 py-1.5 text-center">
              <p className="text-[10px] font-medium text-cyan-300">Günün Modeli</p>
              <p className="truncate text-[10px] text-gray-400">{productName}</p>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
