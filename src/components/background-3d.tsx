"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) return;
    } catch {
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const idleCallback = window.requestIdleCallback || ((cb: IdleRequestCallback) => setTimeout(cb, 200));

    idleCallback(() => {
      if (cancelled || !container) return;

      try {
        let w = window.innerWidth;
        let h = window.innerHeight;
        const clock = new THREE.Clock();

        const scene = new THREE.Scene();
        scene.background = null;
        scene.fog = new THREE.FogExp2(0x06060c, 0.006);

        const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 60);
        camera.position.set(0, 1.8, 7);
        camera.lookAt(0, 0.8, -3);

        let renderer: THREE.WebGLRenderer;
        try {
          renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: false,
            powerPreference: "low-power",
            failIfMajorPerformanceCaveat: false,
          });
        } catch {
          return;
        }

        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        const HUE = 0.62;
        const mainColor = new THREE.Color().setHSL(HUE, 0.5, 0.35);
        const darkColor = new THREE.Color().setHSL(HUE, 0.4, 0.18);
        const lightColor = new THREE.Color().setHSL(HUE, 0.6, 0.45);

        // Lights
        const ambient = new THREE.AmbientLight(0x222244, 0.6);
        scene.add(ambient);

        const keyLight = new THREE.DirectionalLight(new THREE.Color().setHSL(HUE, 0.4, 0.3), 0.8);
        keyLight.position.set(-3, 6, 2);
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(new THREE.Color().setHSL(HUE, 0.3, 0.15), 0.3);
        fillLight.position.set(3, 2, 4);
        scene.add(fillLight);

        const rimLight1 = new THREE.PointLight(new THREE.Color().setHSL(HUE, 0.6, 0.2), 0.3, 10);
        rimLight1.position.set(-4, 3, -8);
        scene.add(rimLight1);

        const rimLight2 = new THREE.PointLight(new THREE.Color().setHSL(HUE, 0.6, 0.2), 0.3, 10);
        rimLight2.position.set(4, 3, -8);
        scene.add(rimLight2);

        function stoneMat(color: THREE.Color, opacity: number) {
          return new THREE.MeshStandardMaterial({
            color, roughness: 0.85, metalness: 0.05,
            transparent: true, opacity, side: THREE.DoubleSide,
          });
        }

        // Floor
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 22), stoneMat(darkColor, 0.25));
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(0, -0.3, -4);
        scene.add(floor);

        const grid = new THREE.GridHelper(12, 16, lightColor, darkColor);
        grid.position.set(0, -0.28, -4);
        grid.material.transparent = true;
        grid.material.opacity = 0.18;
        scene.add(grid);

        // Floor rings
        const ringMat = new THREE.MeshBasicMaterial({
          color: lightColor, transparent: true, opacity: 0.12, side: THREE.DoubleSide,
        });
        [1.0, 1.8].forEach((r) => {
          const ring = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.12, 48), ringMat);
          ring.rotation.x = -Math.PI / 2;
          ring.position.set(0, -0.27, -3);
          scene.add(ring);
        });

        // Walls
        for (const x of [-4.0, 4.0]) {
          const wall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5, 20), stoneMat(darkColor, 0.25));
          wall.position.set(x, 2.0, -3);
          scene.add(wall);
        }

        const backWall = new THREE.Mesh(new THREE.BoxGeometry(8, 5, 0.2), stoneMat(darkColor, 0.22));
        backWall.position.set(0, 2.0, -14);
        scene.add(backWall);

        // Pillars
        function createPillar(x: number, z: number) {
          const g = new THREE.Group();
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.33, 4.0, 10), stoneMat(mainColor, 0.30));
          col.position.y = 1.9;
          g.add(col);

          const baseMat = stoneMat(darkColor, 0.28);
          const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.15, 10), baseMat);
          b1.position.y = 0.0;
          g.add(b1);
          const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.1, 10), baseMat);
          b2.position.y = 0.15;
          g.add(b2);

          const capMat = stoneMat(lightColor, 0.26);
          const c1 = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.42, 0.1, 10), capMat);
          c1.position.y = 3.7;
          g.add(c1);
          const c2 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.55, 0.15, 10), capMat);
          c2.position.y = 3.85;
          g.add(c2);

          g.position.set(x, -0.3, z);
          scene.add(g);
        }

        const pillarZ = [-2, -4.5, -7, -9.5, -12];
        for (const z of pillarZ) {
          createPillar(-3.2, z);
          createPillar(3.2, z);
        }

        // Arches
        function createArch(z: number) {
          const span = 2.8;
          const m = stoneMat(lightColor, 0.20);
          const geo = new THREE.BoxGeometry(0.06, 1.8, 0.06);

          const left = new THREE.Mesh(geo, m);
          left.position.set(-span * 0.5, 3.6, z);
          left.rotation.z = 0.32;
          scene.add(left);

          const right = new THREE.Mesh(geo, m);
          right.position.set(span * 0.5, 3.6, z);
          right.rotation.z = -0.32;
          scene.add(right);

          const key = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), stoneMat(lightColor, 0.22));
          key.position.set(0, 4.1, z);
          scene.add(key);

          const top = new THREE.Mesh(new THREE.BoxGeometry(span, 0.03, 0.05), stoneMat(mainColor, 0.14));
          top.position.set(0, 4.1, z);
          scene.add(top);
        }
        for (const z of pillarZ) createArch(z);

        // Ribbed vault ceiling
        const ribMat = stoneMat(lightColor, 0.14);
        for (const z of pillarZ) {
          if (z > -11) {
            for (const sign of [-1, 1]) {
              const dx = 3.2;
              const len = Math.sqrt(dx * dx + 1.0 * 1.0);
              const rib = new THREE.Mesh(new THREE.BoxGeometry(len, 0.03, 0.04), ribMat);
              rib.position.set(sign * dx / 2, 4.0, z);
              rib.rotation.z = sign * Math.atan2(1.0, dx);
              scene.add(rib);
            }
          }
        }

        // Ridge beams
        const ridgeMat = stoneMat(lightColor, 0.10);
        for (const x of [-1.5, 0, 1.5]) {
          const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 12), ridgeMat);
          ridge.position.set(x, 4.2, -5);
          scene.add(ridge);
        }

        // Window niches
        function createWindowNiche(x: number, z: number) {
          const m = stoneMat(lightColor, 0.12);
          const arch = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.03, 6, 10, Math.PI), m);
          arch.position.set(x, 2.2, z);
          arch.rotation.y = Math.PI / 2;
          scene.add(arch);
          for (const s of [-1, 1]) {
            const side = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.8, 0.03), stoneMat(mainColor, 0.10));
            side.position.set(x, 1.6, z + s * 0.45);
            scene.add(side);
          }
        }
        for (const z of [-3, -6, -9]) {
          createWindowNiche(-3.95, z);
          createWindowNiche(3.95, z);
        }

        // Distant throne
        const dais = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, 0.8), stoneMat(mainColor, 0.22));
        dais.position.set(0, -0.05, -13);
        scene.add(dais);

        for (let i = 1; i <= 2; i++) {
          const step = new THREE.Mesh(new THREE.BoxGeometry(2.4 + i * 0.2, 0.1, 0.5), stoneMat(darkColor, 0.18));
          step.position.set(0, -0.3 + i * 0.1, -12.5 + i * 0.5);
          scene.add(step);
        }

        const throne = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.06), stoneMat(lightColor, 0.16));
        throne.position.set(0, 0.4, -13.3);
        scene.add(throne);

        // Glow
        function makeGlowTex() {
          const c = document.createElement("canvas");
          c.width = 64;
          c.height = 80;
          const ctx = c.getContext("2d")!;
          const grad = ctx.createRadialGradient(32, 40, 0, 32, 40, 45);
          const col = `hsla(${HUE * 360}, 70%, 65%, 0.7)`;
          grad.addColorStop(0, col);
          grad.addColorStop(0.5, col.replace("0.7", "0.25"));
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 64, 80);
          return new THREE.CanvasTexture(c);
        }

        const glow = new THREE.Sprite(new THREE.SpriteMaterial({
          map: makeGlowTex(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
        }));
        glow.position.set(0, 1.8, -14);
        glow.scale.set(6, 7.5, 1);
        scene.add(glow);

        // Dust
        const dustCount = 80;
        const dustGeo = new THREE.BufferGeometry();
        const dustPos = new Float32Array(dustCount * 3);
        const dustData: { phase: number; speed: number }[] = [];
        for (let i = 0; i < dustCount; i++) {
          dustPos[i * 3] = (Math.random() - 0.5) * 12;
          dustPos[i * 3 + 1] = Math.random() * 4;
          dustPos[i * 3 + 2] = -Math.random() * 16;
          dustData.push({ phase: Math.random() * Math.PI * 2, speed: 0.1 + Math.random() * 0.2 });
        }
        dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
        const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
          color: lightColor, size: 0.015, transparent: true, opacity: 0.10, blending: THREE.AdditiveBlending, depthWrite: false,
        }));
        scene.add(dust);

        // Resize
        const resizeHandler = () => {
          w = window.innerWidth;
          h = window.innerHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener("resize", resizeHandler);

        // Animation loop
        let animId: number;

        function draw() {
          const t = clock.getElapsedTime();

          camera.position.x = Math.sin(t * 0.008) * 0.2;
          camera.position.y = 1.8 + Math.sin(t * 0.015) * 0.02;
          camera.lookAt(0, 0.8 + Math.sin(t * 0.01) * 0.03, -3);

          rimLight1.intensity = 0.15 + Math.sin(t * 0.2) * 0.05;
          rimLight2.intensity = 0.15 + Math.sin(t * 0.2 + Math.PI) * 0.05;

          const gp = 5 + Math.sin(t * 0.15) * 0.8;
          glow.scale.set(gp, gp * 1.2, 1);

          const pos = dust.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < dustCount; i++) {
            pos[i * 3] += Math.sin(t * dustData[i].speed + dustData[i].phase) * 0.0002;
            pos[i * 3 + 1] += Math.cos(t * dustData[i].speed * 0.8 + dustData[i].phase * 1.3) * 0.0002;
            pos[i * 3 + 2] -= 0.0003;
            if (pos[i * 3 + 2] < -16) {
              pos[i * 3 + 2] = 0;
              pos[i * 3] = (Math.random() - 0.5) * 12;
              pos[i * 3 + 1] = Math.random() * 4;
            }
          }
          dust.geometry.attributes.position.needsUpdate = true;

          renderer.render(scene, camera);
          animId = requestAnimationFrame(draw);
        }

        draw();

        cleanup = () => {
          cancelAnimationFrame(animId);
          window.removeEventListener("resize", resizeHandler);
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        };
      } catch {
        // WebGL unavailable or Three.js init failed — silently skip background
      }
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[0]"
    />
  );
}
