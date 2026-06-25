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
        className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl dark:bg-gray-950/40"
        style={{ boxShadow: `0 8px 32px ${glowColor}` }}
        whileHover={{
          boxShadow: `0 12px 48px ${glowColor}`,
          borderColor: "rgba(255,255,255,0.2)",
          transition: { duration: 0.3 },
        }}
      >
        {/* subtle corner glow */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-30 blur-3xl"
          style={{ background: glowColor }}
        />
        {children}
      </motion.div>
    </div>
  );
}
