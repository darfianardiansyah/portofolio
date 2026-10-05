import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { LOCATIONS, TREES } from "./worldConfig";

export function createWorld() {
  const world = new THREE.Group();
  const cube = new THREE.BoxGeometry(1, 1, 1);
  const materials = new Map<string, THREE.MeshLambertMaterial>();
  function material(color: string) {
    if (!materials.has(color)) materials.set(color, new THREE.MeshLambertMaterial({ color }));
    return materials.get(color)!;
  }
  function box(x: number, y: number, z: number, w: number, h: number, d: number, color: string) {
    const mesh = new THREE.Mesh(cube, material(color));
    mesh.position.set(x, y, z); mesh.scale.set(w, h, d); world.add(mesh); return mesh;
  }
  function patch(x: number, z: number, w: number, d: number, color = "#ddc993") { box(x, 0.018, z, w, 0.025, d, color); }
  function label(text: string, x: number, z: number, y: number) {
    const canvas = document.createElement("canvas"); canvas.width = 512; canvas.height = 80;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D tidak tersedia");
    ctx.fillStyle = "#fff8e7"; ctx.beginPath(); ctx.roundRect(3, 3, 506, 74, 16); ctx.fill();
    ctx.strokeStyle = "#d4c6a5"; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = "#334c3d"; ctx.font = "600 30px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, 256, 40);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    const sign = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthWrite: false }));
    sign.position.set(x, y, z); sign.scale.set(6, 0.94, 1); world.add(sign);
  }
  box(0, -0.65, 0, 48, 1.3, 36, "#bdc486");
  box(0, -1.6, 0, 47, 0.6, 35, "#b39d70");
  patch(0, -3.7, 33, 2.8); patch(0, 9, 33, 2.8); patch(0, 1, 2.8, 26);
  patch(0, 0, 8, 7.5, "#e5d6aa");
  for (const location of LOCATIONS) patch(location.entrance.x, location.entrance.z - 0.5, 2.1, 3.2);
  // Small paving stones, deterministic so the same village returns every visit.
  for (let i = 0; i < 22; i++) box(-15.5 + i * 1.45, 0.04, -3.65 + (i % 3 - 1) * 0.18, 0.6, 0.025, 0.5, "#e9dab0");

  for (const location of LOCATIONS) {
    const { x, z } = location.position;
    const color = location.color;
    patch(x, z + 0.2, 7.2, 6.3, "#aeb77b");
    box(x, 0.22, z, 6.4, 0.4, 5.2, "#c5b895");
    box(x, 1.8, z, 6, 3.2, 4.8, "#f6e8c7");
    box(x, 0.7, z + 2.43, 6, 0.6, 0.1, color);
    const roofShape = new THREE.Shape();
    roofShape.moveTo(-3.5, 0); roofShape.lineTo(0, 1.7); roofShape.lineTo(3.5, 0); roofShape.closePath();
    const roof = new THREE.Mesh(new THREE.ExtrudeGeometry(roofShape, { depth: 5.6, bevelEnabled: false }), material(color));
    roof.position.set(x, 3.4, z - 2.8); world.add(roof);
    box(x + 1.8, 4.3, z - 1, 0.65, 1.4, 0.7, "#a58c70");
    box(x, 1.12, z + 2.45, 1.15, 2, 0.12, "#78583e");
    box(x + 0.35, 1.1, z + 2.55, 0.12, 0.12, 0.1, "#e6c87e");
    for (const dx of [-1.95, 1.95]) {
      box(x + dx, 1.95, z + 2.46, 1.05, 1.05, 0.12, "#a38a66");
      box(x + dx, 1.95, z + 2.54, 0.82, 0.8, 0.06, "#7db9b2");
      box(x + dx, 1.95, z + 2.59, 0.07, 0.84, 0.05, "#f4dfb4");
      box(x + dx, 1.95, z + 2.59, 0.85, 0.07, 0.05, "#f4dfb4");
      box(x + dx, 1.35, z + 2.65, 1.2, 0.2, 0.45, color);
      for (const flowerX of [-0.3, 0, 0.3]) box(x + dx + flowerX, 1.52, z + 2.66, 0.17, 0.22, 0.17, "#dda45d");
    }
    box(x, 0.12, z + 2.95, 1.65, 0.2, 0.8, "#ead8b0");
    label(`${location.number}  ${location.label}`, x, z, 6);
    // A small marker at the reachable entrance.
    const marker = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.64, 24), new THREE.MeshBasicMaterial({ color: "#fff5d3", side: THREE.DoubleSide }));
    marker.rotation.x = -Math.PI / 2; marker.position.set(location.entrance.x, 0.08, location.entrance.z); world.add(marker);
    if (location.id === "contact") {
      box(x + 3.8, 0.65, z + 2.8, 0.18, 1.3, 0.18, "#765b40");
      box(x + 3.8, 1.25, z + 2.8, 0.75, 0.6, 0.65, color);
      box(x + 3.8, 1.3, z + 3.14, 0.45, 0.07, 0.04, "#f5e9d0");
    }
  }
  const foliage = new THREE.IcosahedronGeometry(1, 0);
  const shadeGeometry = new THREE.CircleGeometry(1, 20);
  const shadeMaterial = new THREE.MeshBasicMaterial({ color: "#50673b", transparent: true, opacity: 0.12, depthWrite: false });
  for (let i = 0; i < TREES.length; i++) {
    const { x, z } = TREES[i];
    const scale = 1 + (i % 3) * 0.14;
    box(x, 0.8, z, 0.45, 1.6, 0.45, "#8c6f45");
    const crown = new THREE.Mesh(foliage, material(i % 2 ? "#64824e" : "#799552"));
    crown.position.set(x, 2.1, z); crown.scale.set(1.65 * scale, 1.9 * scale, 1.65 * scale); world.add(crown);
    const shade = new THREE.Mesh(shadeGeometry, shadeMaterial); shade.rotation.x = -Math.PI / 2; shade.scale.setScalar(1.65 * scale); shade.position.set(x, 0.055, z); world.add(shade);
  }
  // Square flower garden.
  box(0, 0.2, 0, 4, 0.35, 2.8, "#b49568");
  box(0, 0.4, 0, 3.6, 0.12, 2.4, "#6d884e");
  for (let i = 0; i < 15; i++) box((i % 5 - 2) * 0.65, 0.59, (Math.floor(i / 5) - 1) * 0.65, 0.24, 0.3, 0.24, i % 2 ? "#e8b269" : "#d18876");
  // A pond and its bank, away from the path.
  box(6.5, 0.09, 5.5, 4, 0.16, 3, "#a5ae79");
  box(6.5, 0.19, 5.5, 3.6, 0.05, 2.6, "#7fb5ac");
  for (let i = 0; i < 3; i++) box(5.3 + i * 0.8, 0.23, 5 + i * 0.45, 0.6, 0.025, 0.12, "#b3d4bd");
  // Fences around the skill garden (front remains open).
  for (let i = 0; i <= 8; i++) box(-16 + i, 0.55, 2.12, 0.2, 1.1, 0.2, "#f0e1b9");
  box(-12, 0.45, 2.12, 8, 0.12, 0.12, "#f0e1b9");
  box(-12, 0.85, 2.12, 8, 0.12, 0.12, "#f0e1b9");
  for (let i = 0; i <= 5; i++) box(-16.12, 0.55, 2 + i, 0.2, 1.1, 0.2, "#f0e1b9");
  box(-16.12, 0.55, 4.75, 0.12, 0.12, 5.5, "#f0e1b9");
  // Low bushes and flowers around the edges, outside walkable paths.
  for (let i = 0; i < 26; i++) {
    const x = -22 + i * 1.7;
    box(x, 0.18, 16.5, 0.35, 0.3, 0.35, i % 3 ? "#91a25d" : "#f0cd7a");
    box(x, 0.18, -16.5, 0.4, 0.3, 0.4, i % 4 ? "#91a25d" : "#d9987f");
  }
  // Static scenery shares a material per color. Merge it once to avoid hundreds
  // of draw calls on mobile; sprites and translucent shadows stay independent.
  const batches = new Map<THREE.Material, THREE.Mesh[]>();
  const originalGeometry = new Set<THREE.BufferGeometry>();
  for (const child of world.children) {
    if (!(child instanceof THREE.Mesh) || !(child.material instanceof THREE.MeshLambertMaterial)) continue;
    const meshes = batches.get(child.material) ?? [];
    meshes.push(child); batches.set(child.material, meshes);
  }
  for (const [material, meshes] of batches) {
    const copies = meshes.map((mesh) => {
      mesh.updateMatrix(); originalGeometry.add(mesh.geometry);
      const copy = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
      copy.applyMatrix4(mesh.matrix); return copy;
    });
    const merged = mergeGeometries(copies);
    copies.forEach((copy) => copy.dispose());
    if (!merged) throw new Error("Geometri desa gagal disiapkan");
    meshes.forEach((mesh) => world.remove(mesh));
    world.add(new THREE.Mesh(merged, material));
  }
  originalGeometry.forEach((geometry) => geometry.dispose());
  return world;
}

export function disposeScene(scene: THREE.Scene) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) geometries.add(object.geometry);
    if (object instanceof THREE.Mesh || object instanceof THREE.Sprite) {
      const list = Array.isArray(object.material) ? object.material : [object.material];
      list.forEach((material) => {
        materials.add(material);
        Object.values(material).forEach((value) => { if (value instanceof THREE.Texture) textures.add(value); });
      });
    }
  });
  geometries.forEach((geometry) => geometry.dispose());
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  scene.clear();
}
