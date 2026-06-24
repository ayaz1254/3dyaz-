"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

interface ModelViewerProps {
  url: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ModelViewer({ url, className, style }: ModelViewerProps) {
  return (
    <div
      className={className}
      style={{ width: "100%", height: 400, background: "#f5f5f5", borderRadius: 12, overflow: "hidden", ...style }}
    >
      <Canvas camera={{ position: [3, 3, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <directionalLight position={[-5, -3, -5]} intensity={0.2} />
        <Suspense fallback={<LoadingPlaceholder />}>
          <ModelLoader url={url} />
        </Suspense>
        <OrbitControls enablePan enableZoom autoRotate={false} />
        <gridHelper args={[3, 20, "#999", "#ccc"]} />
      </Canvas>
    </div>
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

function ModelLoader({ url }: { url: string }) {
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
        color="#7c9eff"
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
