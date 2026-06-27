"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

interface ModelViewerProps {
  url: string;
  className?: string;
  style?: React.CSSProperties;
  modelColor?: string;
}

function ModelCanvas({ url, color }: { url: string; color?: string }) {
  return (
    <Canvas camera={{ position: [3, 3, 5], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <directionalLight position={[-5, -3, -5]} intensity={0.2} />
      <Suspense fallback={<LoadingPlaceholder />}>
        <ModelLoader url={url} color={color} />
      </Suspense>
      <OrbitControls enablePan enableZoom autoRotate autoRotateSpeed={0.8} />
      <gridHelper args={[3, 20, "#999", "#ccc"]} />
    </Canvas>
  );
}

export default function ModelViewer({ url, className, style, modelColor }: ModelViewerProps) {
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    setFullscreen((f) => !f);
  }, []);

  return (
    <>
      {/* Normal view */}
      <div
        className={className}
        style={{ position: "relative", width: "100%", background: "#111", borderRadius: 12, overflow: "hidden", ...style }}
      >
            <ModelCanvas url={url} color={modelColor} />
        {/* Tam Ekran butonu */}
        <button
          onClick={toggleFullscreen}
          className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm transition hover:bg-black/70 hover:text-white"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <span className="hidden sm:inline">Tam Ekran</span>
        </button>
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div style={{ width: "100vw", height: "100vh" }}>
        <ModelCanvas url={url} color={modelColor} />
          </div>
          <button
            onClick={toggleFullscreen}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
            aria-label="Tam Ekran Kapat"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

function LoadingPlaceholder() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial wireframe color="#999" />
    </mesh>
  );
}

function ModelLoader({ url, color }: { url: string; color?: string }) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const ext = url.split(".").pop()?.toLowerCase() || "";

    async function load() {
      if (ext === "stl") {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Dosya yüklenemedi");
        const buffer = await res.arrayBuffer();
        const geom = new STLLoader().parse(buffer);
        normalizeGeometry(geom);
        if (!cancelled) setGeometry(geom);
      } else if (ext === "obj") {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Dosya yüklenemedi");
        const text = await res.text();
        const obj = new OBJLoader().parse(text);

        const geometries: THREE.BufferGeometry[] = [];
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const g = child.geometry.clone();
            g.applyMatrix4(child.matrixWorld);
            geometries.push(g);
          }
        });

        if (geometries.length === 0) throw new Error("Modelde geometri bulunamadı");

        const merged = mergeBufferGeometries(geometries);
        normalizeGeometry(merged);
        if (!cancelled) setGeometry(merged);
      } else {
        throw new Error("Desteklenmeyen format: " + ext);
      }
    }

    setGeometry(null);
    setError(null);
    load().catch((err) => {
      if (!cancelled) setError(err.message);
    });

    return () => { cancelled = true; };
  }, [url]);

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#ff4444" />
      </mesh>
    );
  }

  if (!geometry) return <LoadingPlaceholder />;

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color={color || "#7c9eff"}
        metalness={0.15}
        roughness={0.65}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function normalizeGeometry(geom: THREE.BufferGeometry) {
  geom.center();
  geom.computeBoundingSphere();
  const radius = geom.boundingSphere?.radius || 1;
  const s = 1 / radius;
  geom.scale(s, s, s);
  geom.computeVertexNormals();
}

function mergeBufferGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  // Count total vertices
  let totalVerts = 0;
  for (const g of geometries) {
    const pos = g.getAttribute("position");
    if (pos) totalVerts += pos.count;
  }

  if (totalVerts === 0) return new THREE.BufferGeometry();

  // Merge all geometries into one
  const mergedPositions: number[] = [];
  const mergedNormals: number[] = [];

  for (const g of geometries) {
    const pos = g.getAttribute("position");
    const norm = g.getAttribute("normal");
    if (!pos) continue;

    for (let i = 0; i < pos.count; i++) {
      mergedPositions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
      if (norm) {
        mergedNormals.push(norm.getX(i), norm.getY(i), norm.getZ(i));
      }
    }
  }

  const result = new THREE.BufferGeometry();
  result.setAttribute("position", new THREE.Float32BufferAttribute(mergedPositions, 3));
  if (mergedNormals.length > 0) {
    result.setAttribute("normal", new THREE.Float32BufferAttribute(mergedNormals, 3));
  }
  return result;
}
