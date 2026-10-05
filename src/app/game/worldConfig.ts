import type { Collider, GameLocation, Point } from "./types";

export const WORLD_BOUNDS: Collider = { minX: -24, maxX: 24, minZ: -18, maxZ: 18 };
export const SPAWN: Point = { x: 0, z: 4 };
export const PLAYER_RADIUS = 0.38;
export const PLAYER_SPEED = 5;
export const LOCATIONS: GameLocation[] = [
  { id: "home", label: "Rumah Karakter", subtitle: "Kenalan dulu, yuk", number: "01", position: { x: -12, z: -8 }, entrance: { x: -12, z: -4 }, radius: 2.5, color: "#ba674b" },
  { id: "projects", label: "Balai Proyek", subtitle: "Karya & eksperimen", number: "02", position: { x: 0, z: -11 }, entrance: { x: 0, z: -7 }, radius: 2.5, color: "#537f79" },
  { id: "skills", label: "Kebun Keahlian", subtitle: "Yang terus bertumbuh", number: "03", position: { x: -12, z: 5 }, entrance: { x: -12, z: 9 }, radius: 2.5, color: "#77894c" },
  { id: "museum", label: "Museum Sertifikasi", subtitle: "Jejak belajar", number: "04", position: { x: 12, z: -8 }, entrance: { x: 12, z: -4 }, radius: 2.5, color: "#bd9450" },
  { id: "contact", label: "Kantor Pos", subtitle: "Mari terhubung", number: "05", position: { x: 12, z: 5 }, entrance: { x: 12, z: 9 }, radius: 2.5, color: "#977386" },
];

export const TREES: Point[] = [
  { x: -20, z: -13 }, { x: -17, z: -14 }, { x: -6, z: -14 }, { x: 6, z: -14 },
  { x: 19, z: -13 }, { x: 21, z: -9 }, { x: -20, z: -1 }, { x: -19, z: 3 },
  { x: 20, z: 1 }, { x: 20, z: 5 }, { x: -21, z: 13 }, { x: -18, z: 14 },
  { x: -6, z: 14 }, { x: 6, z: 14 }, { x: 18, z: 14 }, { x: 21, z: 12 },
];

export const COLLIDERS: Collider[] = [
  ...LOCATIONS.map(({ position: { x, z } }) => ({ minX: x - 3.2, maxX: x + 3.2, minZ: z - 2.6, maxZ: z + 2.6 })),
  ...TREES.map(({ x, z }) => ({ minX: x - 0.6, maxX: x + 0.6, minZ: z - 0.6, maxZ: z + 0.6 })),
  // Flower bed in the square, pond, and decorative fence lines.
  { minX: -2, maxX: 2, minZ: -1.4, maxZ: 1.4 },
  { minX: 4.5, maxX: 8.5, minZ: 4, maxZ: 7 },
  { minX: -16, maxX: -8, minZ: 2, maxZ: 2.25 },
  { minX: -16.25, maxX: -16, minZ: 2, maxZ: 7.5 },
];
