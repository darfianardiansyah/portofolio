import { describe, expect, it } from "vitest";
import { movePlayer, nearestLocation, normalizeMovement } from "./collision";
import { COLLIDERS, LOCATIONS, PLAYER_RADIUS, SPAWN, WORLD_BOUNDS } from "./worldConfig";
import type { Collider, Point } from "./types";

const bounds: Collider = { minX: -10, maxX: 10, minZ: -10, maxZ: 10 };
const obstacle: Collider = { minX: 1, maxX: 3, minZ: -1, maxZ: 1 };
describe("player movement", () => {
  it("normalizes diagonals without speeding up cardinal movement", () => {
    expect(Math.hypot(...Object.values(normalizeMovement(1, 1)))).toBeCloseTo(1);
    expect(normalizeMovement(0, -1)).toEqual({ x: 0, z: -1 });
    expect(normalizeMovement(0, 0)).toEqual({ x: 0, z: 0 });
  });
  it("clamps to each map edge accounting for player size", () => {
    expect(movePlayer({ x: 0, z: 0 }, { x: 100, z: -100 }, [], bounds, 0.4)).toEqual({ x: 9.6, z: -9.6 });
    expect(movePlayer({ x: 0, z: 0 }, { x: -100, z: 100 }, [], bounds, 0.4)).toEqual({ x: -9.6, z: 9.6 });
  });
  it("stops before an obstacle even for a large step", () => {
    expect(movePlayer({ x: 0, z: 0 }, { x: 6, z: 0 }, [obstacle], bounds, 0.4)).toEqual({ x: 0.6, z: 0 });
    expect(movePlayer({ x: 5, z: 0 }, { x: -6, z: 0 }, [obstacle], bounds, 0.4)).toEqual({ x: 3.4, z: 0 });
  });
  it("slides along a wall instead of stopping both axes", () => {
    const result = movePlayer({ x: 0.6, z: 0 }, { x: 0.2, z: 0.2 }, [obstacle], bounds, 0.4);
    expect(result.x).toBeCloseTo(0.6); expect(result.z).toBeCloseTo(0.2);
  });
  it("permits movement around the end of an obstacle", () => {
    expect(movePlayer({ x: 0, z: 2 }, { x: 4, z: 0 }, [obstacle], bounds, 0.4)).toEqual({ x: 4, z: 2 });
  });
});

describe("location selection", () => {
  it("does not select distant locations", () => expect(nearestLocation(SPAWN, LOCATIONS)).toBeNull());
  it("includes the interaction radius boundary", () => {
    const location = LOCATIONS[0];
    expect(nearestLocation({ x: location.entrance.x + location.radius, z: location.entrance.z }, [location])?.id).toBe(location.id);
  });
  it("chooses the closest and keeps the first on equal distance", () => {
    const locations = [{ ...LOCATIONS[0], entrance: { x: -1, z: 0 } }, { ...LOCATIONS[1], entrance: { x: 1, z: 0 } }];
    expect(nearestLocation({ x: 0.8, z: 0 }, locations)?.id).toBe("projects");
    expect(nearestLocation({ x: 0, z: 0 }, locations)?.id).toBe("home");
  });
  it("all five entrances are reachable from spawn through actual colliders", () => {
    const queue: Point[] = [SPAWN];
    const visited = new Set([`${SPAWN.x},${SPAWN.z}`]);
    for (let index = 0; index < queue.length; index++) {
      for (const direction of [{ x: 1, z: 0 }, { x: -1, z: 0 }, { x: 0, z: 1 }, { x: 0, z: -1 }]) {
        const next = movePlayer(queue[index], direction, COLLIDERS, WORLD_BOUNDS, PLAYER_RADIUS);
        if (!Number.isInteger(next.x) || !Number.isInteger(next.z)) continue;
        const key = `${next.x},${next.z}`;
        if (!visited.has(key)) { visited.add(key); queue.push(next); }
      }
    }
    for (const location of LOCATIONS) expect(visited.has(`${location.entrance.x},${location.entrance.z}`), location.label).toBe(true);
  });
});
