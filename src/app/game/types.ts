export type Point = { x: number; z: number };
export type Collider = { minX: number; maxX: number; minZ: number; maxZ: number };
export type LocationId = "home" | "projects" | "skills" | "museum" | "contact";
export type GameLocation = {
  id: LocationId;
  label: string;
  subtitle: string;
  number: string;
  position: Point;
  entrance: Point;
  radius: number;
  color: string;
};
export type Direction = "up" | "down" | "left" | "right";
