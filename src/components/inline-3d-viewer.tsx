"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type GeometryType = "torusKnot" | "icosahedron" | "cylinder" | "box" | "sphere" | "cone" | "torus";

interface Props {
  geometry?: GeometryType;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const GEOMETRIES: Record<GeometryType, [type: string, args: unknown[]]> = {
  torusKnot: ["torusKnotGeometry", [0.7, 0.25, 64, 16]],
  icosahedron: ["icosahedronGeometry", [0.8, 0]],
  cylinder: ["cylinderGeometry", [0.5, 0.5, 1, 32]],
  box: ["boxGeometry", [0.9, 0.9, 0.9]],
  sphere: ["sphereGeometry", [0.7, 32, 32]],
  cone: ["coneGeometry", [0.6, 1, 32]],
  torus: ["torusGeometry", [0.6, 0.25, 16, 32]],
};

function Mesh({ geometry, color }: { geometry: GeometryType; color: string }) {
  const geo = GEOMETRIES[geometry];
  if (!geo) return null;

  const [type, args] = geo;

  const meshProps: Record<string, unknown> = {};
  if (type === "torusKnotGeometry") meshProps.args = [0.7, 0.25, 64, 16];
  else if (type === "icosahedronGeometry") meshProps.args = [0.8, 0];
  else if (type === "cylinderGeometry") meshProps.args = [0.5, 0.5, 1, 32];
  else if (type === "boxGeometry") meshProps.args = [0.9, 0.9, 0.9];
  else if (type === "sphereGeometry") meshProps.args = [0.7, 32, 32];
  else if (type === "coneGeometry") meshProps.args = [0.6, 1, 32];
  else if (type === "torusGeometry") meshProps.args = [0.6, 0.25, 16, 32];

  let meshElement: React.ReactElement;

  switch (type) {
    case "torusKnotGeometry":
      meshElement = <torusKnotGeometry args={[0.7, 0.25, 64, 16]} />;
      break;
    case "icosahedronGeometry":
      meshElement = <icosahedronGeometry args={[0.8, 0]} />;
      break;
    case "cylinderGeometry":
      meshElement = <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
      break;
    case "boxGeometry":
      meshElement = <boxGeometry args={[0.9, 0.9, 0.9]} />;
      break;
    case "sphereGeometry":
      meshElement = <sphereGeometry args={[0.7, 32, 32]} />;
      break;
    case "coneGeometry":
      meshElement = <coneGeometry args={[0.6, 1, 32]} />;
      break;
    case "torusGeometry":
      meshElement = <torusGeometry args={[0.6, 0.25, 16, 32]} />;
      break;
    default:
      meshElement = <boxGeometry args={[0.9, 0.9, 0.9]} />;
  }

  return (
    <mesh rotation={[0.3, 0.5, 0]} castShadow>
      {meshElement}
      <meshStandardMaterial
        color={color}
        metalness={0.15}
        roughness={0.65}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function Inline3DViewer({ geometry = "torusKnot", color = "#7c9eff", className = "", style }: Props) {
  return (
    <div className={className} style={{ position: "relative", width: "100%", background: "#111", borderRadius: 12, overflow: "hidden", ...style }}>
      <Canvas camera={{ position: [2.5, 2.5, 3.5], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <directionalLight position={[-5, -3, -5]} intensity={0.2} />
        <Mesh geometry={geometry} color={color} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}
