import { normalizeMovement } from "./collision";
import type { Direction, Point } from "./types";

const KEY_DIRECTION: Record<string, Direction> = {
  w: "up", ArrowUp: "up", s: "down", ArrowDown: "down",
  a: "left", ArrowLeft: "left", d: "right", ArrowRight: "right",
};

export function createInput(canvas: HTMLCanvasElement, interact: () => void) {
  const keyboard = new Map<string, Direction>();
  const pointers = new Map<number, Direction>();
  let touchVector: Point | null = null;
  let paused = false;
  const reset = () => { keyboard.clear(); pointers.clear(); touchVector = null; };
  const keyDown = (event: KeyboardEvent) => {
    // Controls only own the keyboard while the world itself has focus.
    if (paused || document.activeElement !== canvas || event.ctrlKey || event.metaKey || event.altKey) return;
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (KEY_DIRECTION[key]) { event.preventDefault(); keyboard.set(key, KEY_DIRECTION[key]); }
    if (key === "e") { event.preventDefault(); if (!event.repeat) interact(); }
  };
  const keyUp = (event: KeyboardEvent) => keyboard.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key);
  const visibility = () => { if (document.hidden) reset(); };
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
  window.addEventListener("blur", reset);
  document.addEventListener("visibilitychange", visibility);
  canvas.addEventListener("blur", reset);
  return {
    reset,
    setPaused(value: boolean) { paused = value; reset(); },
    setPointer(id: number, direction: Direction | null) {
      if (direction === null) pointers.delete(id);
      else if (!paused) pointers.set(id, direction);
    },
    setVector(vector: Point | null) {
      if (paused || !vector) touchVector = null;
      else touchVector = vector;
    },
    movement() {
      if (paused) return { x: 0, z: 0 };
      if (touchVector) {
        return normalizeMovement(touchVector.x, touchVector.z);
      }
      const held = new Set([...keyboard.values(), ...pointers.values()]);
      return normalizeMovement(Number(held.has("right")) - Number(held.has("left")), Number(held.has("down")) - Number(held.has("up")));
    },
    dispose() {
      reset();
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("blur", reset);
    },
  };
}
