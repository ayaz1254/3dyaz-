"use client";

import { type ReactNode, useRef } from "react";
import { motion, useInView } from "motion/react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "a" | "button";
  href?: string;
  delay?: number;
  glowColor?: string;
  hover3d?: boolean;
}

export function GlassCard({
  children,
  className = "",
  as = "div",
  href,
  delay = 0,
  glowColor = "rgba(56, 189, 248, 0.15)",
  hover3d = false,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const Component = motion[as as "div" | "a"];

  const mouseMove = (e: React.MouseEvent) => {
    if (!hover3d || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(600px) rotateX(${y * -6}deg) rotateY(${x * 6}deg)`;
  };

  const mouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={mouseMove}
      onMouseLeave={mouseLeave}
      style={{ transformStyle: "preserve-3d" }}
      className={`transition-transform duration-200 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-500 dark:bg-gray-950/30"
        style={{ boxShadow: `0 8px 32px ${glowColor}` }}
        whileHover={{
          boxShadow: `0 16px 56px ${glowColor.replace("0.15", "0.25")}`,
          borderColor: "rgba(255,255,255,0.15)",
          y: -2,
          transition: { duration: 0.3 },
        }}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-20 blur-3xl transition-all duration-700 group-hover:opacity-40 group-hover:scale-150"
          style={{ background: glowColor }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-24 w-24 rounded-full opacity-0 blur-2xl transition-all duration-700 group-hover:opacity-20"
          style={{ background: glowColor }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, transparent 40%, ${glowColor.replace("0.15", "0.04")} 100%)`,
            }}
          />
        </div>
        <div className="relative z-10">{children}</div>
      </motion.div>
    </div>
  );
}
