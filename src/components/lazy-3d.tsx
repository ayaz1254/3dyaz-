"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

interface Lazy3DProps {
  children: ReactNode;
  height?: number;
  className?: string;
}

/**
 * IntersectionObserver wrapper – Three.js Canvas'ı sadece
 * görünüm alanına yaklaştığında render eder.
 * rootMargin: 250px = ekran görmeden 250px önce yüklemeye başla.
 */
export function Lazy3D({ children, height = 320, className = "" }: Lazy3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{ minHeight: height }}>
      {inView ? children : <div style={{ height }} />}
    </div>
  );
}
