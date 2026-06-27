import fs from "node:fs";
import path from "node:path";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import { SimplifyModifier } from "three/examples/jsm/modifiers/SimplifyModifier.js";

const TARGET_TRIANGLES = 25000; // ~90% reduction from ~300k
const MODELS_DIR = path.resolve("public/uploads/models");
const MODELS = ["ana_sayfa_sol.stl", "ana_sayfa_sag.stl"];

const exporter = new STLExporter();
const modifier = new SimplifyModifier();

for (const name of MODELS) {
  const inPath = path.join(MODELS_DIR, name);
  const base = name.replace(/\.stl$/i, "");
  const outPath = path.join(MODELS_DIR, `${base}-optimized.stl`);

  console.log(`\n--- ${name} ---`);
  const raw = fs.readFileSync(inPath);
  const origSize = raw.length;

  const loader = new STLLoader();
  const geom = loader.parse(raw.buffer);

  // Get triangle count
  const posAttr = geom.getAttribute("position");
  const origTriangles = posAttr ? posAttr.count / 3 : 0;
  console.log(`  Original: ${origTriangles.toLocaleString()} triangles, ${(origSize / 1024 / 1024).toFixed(2)} MB`);

  // Skip if already small enough
  if (origTriangles <= TARGET_TRIANGLES * 1.5) {
    console.log("  Already small enough, copying as-is...");
    fs.copyFileSync(inPath, outPath);
    console.log(`  → ${path.basename(outPath)}`);
    continue;
  }

  // Simplify
  const targetCount = Math.min(TARGET_TRIANGLES, Math.floor(origTriangles * 0.1));
  console.log(`  Simplifying to ${targetCount.toLocaleString()} triangles...`);

  const simplified = modifier.modify(geom, targetCount);

  // Build a Mesh for export
  const mat = new THREE.MeshStandardMaterial();
  const mesh = new THREE.Mesh(simplified, mat);
  mesh.geometry.computeVertexNormals();

  // Export to binary STL
  const stlBuffer = exporter.parse(mesh, { binary: true });
  const newSize = stlBuffer.length;
  const reduction = ((1 - newSize / origSize) * 100).toFixed(1);

  fs.writeFileSync(outPath, Buffer.from(stlBuffer));
  console.log(`  Result: ${(targetCount).toLocaleString()} triangles, ${(newSize / 1024 / 1024).toFixed(2)} MB (${reduction}% smaller)`);
  console.log(`  → ${path.basename(outPath)}`);
}

console.log("\n✅ Done!");
