import os
import sys
import numpy as np
from stl import mesh as stl_mesh
import fast_simplification

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "uploads", "models")
MODELS = ["ana_sayfa_sol.stl", "ana_sayfa_sag.stl"]
TARGET_RATIO = 0.08  # Reduce to 8% of original triangles (~24k from 300k)

for name in MODELS:
    in_path = os.path.join(MODELS_DIR, name)
    base = name.replace(".stl", "")
    out_path = os.path.join(MODELS_DIR, f"{base}-optimized.stl")

    print(f"\n--- {name} ---")
    orig_size = os.path.getsize(in_path)

    # Load STL
    m = stl_mesh.Mesh.from_file(in_path)
    orig_tri = len(m.vectors)
    print(f"  Original: {orig_tri:,} triangles, {orig_size / 1024 / 1024:.2f} MB")

    if orig_tri <= 50000:
        print("  Already small enough, copying...")
        import shutil
        shutil.copy2(in_path, out_path)
        print(f"  -> {os.path.basename(out_path)}")
        continue

    target_tri = max(int(orig_tri * TARGET_RATIO), 10000)

    # fast_simplification works on flat vertex arrays
    # STL has flat triangles (no shared vertices), so each vertex is unique
    vertices = m.vectors.reshape(-1, 3).astype(np.float64)
    # Each group of 3 vertices forms a triangle
    triangles = np.arange(len(vertices), dtype=np.uint32).reshape(-1, 3)

    print(f"  Simplifying {orig_tri:,} -> {target_tri:,} triangles...")

    vertices_out, triangles_out = fast_simplification.simplify(
        vertices, triangles, target_count=target_tri
    )

    actual_tri = len(triangles_out)
    print(f"  Result: {actual_tri:,} triangles")

    # Build output mesh
    out_mesh = stl_mesh.Mesh(np.zeros(actual_tri, dtype=stl_mesh.Mesh.dtype))
    for i in range(actual_tri):
        idx = triangles_out[i]
        out_mesh.vectors[i] = vertices_out[idx]

    # Compute normals
    out_mesh.update_normals()

    out_mesh.save(out_path, mode=0)  # 0 = BINARY, 1 = ASCII
    new_size = os.path.getsize(out_path)
    reduction = (1 - new_size / orig_size) * 100
    print(f"  Size: {new_size / 1024 / 1024:.2f} MB ({reduction:.1f}% smaller)")
    print(f"  -> {os.path.basename(out_path)}")

print("\nDone!")
