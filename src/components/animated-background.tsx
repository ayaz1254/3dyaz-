"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  hue: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const particles: Particle[] = [];
    const PARTICLE_COUNT = Math.min(60, Math.floor((w * h) / 30000));

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 120 + 60,
        alpha: Math.random() * 0.08 + 0.02,
        hue: Math.random() * 60 + 180, // cyan to teal range
      });
    }

    function resize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);

    const mouseHandler = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / w, y: e.clientY / h };
    };
    window.addEventListener("mousemove", mouseHandler);

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      for (const p of particles) {
        // slow drift toward mouse
        const dx = mouseRef.current.x * w - p.x;
        const dy = mouseRef.current.y * h - p.y;
        p.vx += dx * 0.00004;
        p.vy += dy * 0.00004;

        // dampen
        p.vx *= 0.99;
        p.vy *= 0.99;

        // speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0.5) {
          p.vx = (p.vx / speed) * 0.5;
          p.vy = (p.vy / speed) * 0.5;
        }

        p.x += p.vx;
        p.y += p.vy;

        // wrap around edges
        if (p.x < -p.radius) p.x = w + p.radius;
        if (p.x > w + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = h + p.radius;
        if (p.y > h + p.radius) p.y = -p.radius;

        const gradient = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `hsla(${p.hue}, 70%, 55%, ${p.alpha})`);
        gradient.addColorStop(0.5, `hsla(${p.hue + 20}, 60%, 45%, ${p.alpha * 0.5})`);
        gradient.addColorStop(1, `hsla(${p.hue + 40}, 50%, 35%, 0)`);

        ctx!.fillStyle = gradient;
        ctx!.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", mouseHandler);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
