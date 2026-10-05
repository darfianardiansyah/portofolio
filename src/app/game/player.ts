import * as THREE from "three";
import type { Point } from "./types";

// Original 16 x 24 pixel character, four directions and three animation frames.
function makeSpriteSheet() {
  const canvas = document.createElement("canvas");
  canvas.width = 64; canvas.height = 72;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D tidak tersedia");
  for (let direction = 0; direction < 4; direction++) {
    for (let frame = 0; frame < 3; frame++) {
      const x = direction * 16, y = frame * 24;
      const rect = (color: string, rx: number, ry: number, w: number, h: number) => { ctx.fillStyle = color; ctx.fillRect(x + rx, y + ry, w, h); };
      const side = direction === 1 || direction === 3;
      const back = direction === 2;
      const stride = frame === 1 ? 1 : frame === 2 ? -1 : 0;
      rect("#263e43", 4, 17, 3, 5 + stride);
      rect("#263e43", 9, 17, 3, 5 - stride);
      rect("#493a32", 3, 21 + stride, 4, 2);
      rect("#493a32", 9, 21 - stride, 4, 2);
      rect("#365e62", 3, 11, 10, 7);
      rect("#548e8c", 4, 11, 8, 5);
      rect("#efba88", 2, 12 + stride, 2, 5);
      rect("#efba88", 12, 12 - stride, 2, 5);
      rect("#eeb886", side ? 5 : 4, 4, side ? 7 : 8, 7);
      rect("#4e3a31", 4, 3, 8, 3);
      if (back) { rect("#4e3a31", 4, 5, 8, 5); rect("#c5a567", 5, 12, 6, 5); }
      else {
        rect("#e4a374", 5, 9, 6, 2);
        rect("#263e43", direction === 3 ? 5 : 7, 7, 1, 1);
        if (!side) rect("#263e43", 10, 7, 1, 1);
      }
      rect("#d3b371", 3, 2, 10, 3);
      rect("#efda98", 4, 0, 8, 3);
      rect("#9d794e", direction === 3 ? 1 : 3, 4, 12, 1);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.repeat.set(1 / 4, 1 / 3);
  return texture;
}

export function createPlayer() {
  const texture = makeSpriteSheet();
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  sprite.scale.set(1.3, 1.95, 1);
  sprite.name = "player";
  const group = new THREE.Group();
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.48, 20), new THREE.MeshBasicMaterial({ color: "#314c36", transparent: true, opacity: 0.2, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.06;
  group.add(shadow, sprite);
  let direction = 0;
  return {
    object: group,
    update(position: Point, movement: Point, elapsed: number, reducedMotion: boolean) {
      const moving = movement.x !== 0 || movement.z !== 0;
      if (moving) direction = Math.abs(movement.x) > Math.abs(movement.z) ? (movement.x > 0 ? 1 : 3) : (movement.z < 0 ? 2 : 0);
      const frame = moving && !reducedMotion ? 1 + Math.floor(elapsed * 8) % 2 : 0;
      texture.offset.set(direction / 4, (2 - frame) / 3);
      sprite.position.y = 1.12 + (moving && !reducedMotion ? Math.sin(elapsed * 16) * 0.035 : 0);
      group.position.set(position.x, 0, position.z);
    },
  };
}
