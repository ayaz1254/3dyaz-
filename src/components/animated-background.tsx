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

interface Connection {
  a: Particle;
  b: Particle;
  alpha: number;
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
    const connections: Connection[] = [];
    const PARTICLE_COUNT = Math.min(40, Math.floor((w * h) / 40000));

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 100 + 50,
        alpha: Math.random() * 0.06 + 0.02,
        hue: Math.random() * 80 + 170, // cyan to teal range
      });
    }

    function buildConnections() {
      connections.length = 0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < Math.min(w, h) * 0.3) {
            connections.push({
              a: particles[i],
              b: particles[j],
              alpha: Math.max(0, 1 - dist / (Math.min(w, h) * 0.3)) * 0.04,
            });
          }
        }
      }
    }

    buildConnections();

    function resize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
      buildConnections();
    }
    window.addEventListener("resize", resize);

    const mouseHandler = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / w, y: e.clientY / h };
    };
    window.addEventListener("mousemove", mouseHandler);

    let frameCount = 0;

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      for (const p of particles) {
        const dx = mouseRef.current.x * w - p.x;
        const dy = mouseRef.current.y * h - p.y;
        p.vx += dx * 0.00003;
        p.vy += dy * 0.00003;

        p.vx *= 0.99;
        p.vy *= 0.99;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0.3) {
          p.vx = (p.vx / speed) * 0.3;
          p.vy = (p.vy / speed) * 0.3;
        }

        p.x += p.vx;
        p.y += p.vy;

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

      // Rebuild connections every 60 frames for performance
      frameCount++;
      if (frameCount % 60 === 0) {
        buildConnections();
      }

      for (const c of connections) {
        ctx!.beginPath();
        ctx!.moveTo(c.a.x, c.a.y);
        ctx!.lineTo(c.b.x, c.b.y);
        ctx!.strokeStyle = `hsla(${(c.a.hue + c.b.hue) / 2}, 60%, 50%, ${c.alpha})`;
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
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
