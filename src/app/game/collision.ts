import type { Collider, GameLocation, Point } from "./types";

export function normalizeMovement(x: number, z: number): Point {
  const length = Math.hypot(x, z);
  return length > 1 ? { x: x / length, z: z / length } : { x, z };
}

export function movePlayer(position: Point, movement: Point, colliders: readonly Collider[], bounds: Collider, radius: number): Point {
  const result = { ...position };
  for (const axis of ["x", "z"] as const) {
    const other = axis === "x" ? "z" : "x";
    const minKey = axis === "x" ? "minX" : "minZ";
    const maxKey = axis === "x" ? "maxX" : "maxZ";
    const otherMin = other === "x" ? "minX" : "minZ";
    const otherMax = other === "x" ? "maxX" : "maxZ";
    const delta = movement[axis];
    let target = Math.max(bounds[minKey] + radius, Math.min(bounds[maxKey] - radius, result[axis] + delta));
    for (const obstacle of colliders) {
      if (result[other] + radius <= obstacle[otherMin] || result[other] - radius >= obstacle[otherMax]) continue;
      if (delta > 0 && result[axis] + radius <= obstacle[minKey]) target = Math.min(target, obstacle[minKey] - radius);
      if (delta < 0 && result[axis] - radius >= obstacle[maxKey]) target = Math.max(target, obstacle[maxKey] + radius);
    }
    result[axis] = target;
  }
  return result;
}

export function nearestLocation(position: Point, locations: readonly GameLocation[]): GameLocation | null {
  let nearest: GameLocation | null = null;
  let distance = Infinity;
  for (const location of locations) {
    const current = Math.hypot(position.x - location.entrance.x, position.z - location.entrance.z);
    if (current <= location.radius && current < distance) { nearest = location; distance = current; }
  }
  return nearest;
}
