import * as THREE from "three";
import { movePlayer, nearestLocation } from "./collision";
import { createInput } from "./input";
import { createPlayer } from "./player";
import { createWorld, disposeScene } from "./world";
import { COLLIDERS, LOCATIONS, PLAYER_RADIUS, PLAYER_SPEED, SPAWN, WORLD_BOUNDS } from "./worldConfig";
import type { GameLocation, Point } from "./types";

type EngineOptions = {
  onLocation: (location: GameLocation | null) => void;
  onInteract: (location: GameLocation) => void;
  onError: (message: string) => void;
};

export function createEngine(canvas: HTMLCanvasElement, options: EngineOptions) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#ece6d0");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const camera = new THREE.OrthographicCamera(-20, 20, 14, -14, 0.1, 140);
  scene.add(new THREE.HemisphereLight("#fff7e2", "#879862", 2.4));
  const sunlight = new THREE.DirectionalLight("#fff1d5", 2);
  sunlight.position.set(-15, 25, 15); scene.add(sunlight);
  let player: ReturnType<typeof createPlayer>;
  try {
    scene.add(createWorld());
    player = createPlayer(); scene.add(player.object);
  } catch (error) {
    disposeScene(scene); renderer.dispose(); throw error;
  }
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = motionQuery.matches;
  let position: Point = { ...SPAWN };
  const target = new THREE.Vector3(SPAWN.x, 0, SPAWN.z);
  let near: GameLocation | null = null;
  let paused = false;
  let disposed = false;
  let failed = false;
  let frame = 0;
  let last = performance.now();
  let elapsed = 0;
  const input = createInput(canvas, () => { if (!paused && !failed && near) options.onInteract(near); });
  function aim() { camera.position.set(target.x, 26, target.z + 28); camera.lookAt(target); }
  function resize() {
    if (disposed || failed) return;
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    const halfHeight = aspect < 0.9 ? 16 : 18.5;
    camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect;
    camera.top = halfHeight; camera.bottom = -halfHeight; camera.updateProjectionMatrix();
  }
  function fail(message: string) {
    if (disposed || failed) return;
    failed = true; input.setPaused(true); cancelAnimationFrame(frame);
    near = null; options.onLocation(null); options.onError(message);
  }
  function tick(now: number) {
    if (disposed || failed || document.hidden) return;
    const delta = Math.min(Math.max((now - last) / 1000, 0), 0.05); last = now;
    const movement = input.movement();
    const previous = position;
    position = movePlayer(position, { x: movement.x * PLAYER_SPEED * delta, z: movement.z * PLAYER_SPEED * delta }, COLLIDERS, WORLD_BOUNDS, PLAYER_RADIUS);
    const actualMovement = { x: position.x - previous.x, z: position.z - previous.z };
    if (!paused) elapsed += delta;
    player.update(position, actualMovement, elapsed, reducedMotion);
    const next = nearestLocation(position, LOCATIONS);
    if (next?.id !== near?.id) { near = next; options.onLocation(near); }
    const desired = new THREE.Vector3(Math.max(-14, Math.min(14, position.x)), 0, Math.max(-9, Math.min(9, position.z)));
    target.lerp(desired, reducedMotion ? 1 : 1 - Math.exp(-5 * delta)); aim();
    try { renderer.render(scene, camera); }
    catch { fail("Dunia tidak dapat dirender. Anda tetap bisa membuka informasi lewat Daftar Lokasi."); return; }
    frame = requestAnimationFrame(tick);
  }
  function visibility() {
    cancelAnimationFrame(frame); input.reset(); last = performance.now();
    if (!document.hidden && !disposed && !failed) frame = requestAnimationFrame(tick);
  }
  function contextLost(event: Event) {
    event.preventDefault();
    fail("Tampilan dunia terputus. Buka informasi lewat Daftar Lokasi atau coba muat ulang dunia.");
  }
  const motionChange = () => { reducedMotion = motionQuery.matches; };
  const observer = new ResizeObserver(resize); observer.observe(canvas);
  document.addEventListener("visibilitychange", visibility);
  canvas.addEventListener("webglcontextlost", contextLost);
  motionQuery.addEventListener("change", motionChange);
  resize(); aim(); player.update(position, { x: 0, z: 0 }, 0, reducedMotion);
  if (!document.hidden) frame = requestAnimationFrame(tick);
  return {
    input,
    setPaused(value: boolean) { paused = value; input.setPaused(value); },
    interact() { if (!paused && !failed && near) options.onInteract(near); },
    dispose() {
      if (disposed) return;
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); input.dispose();
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", contextLost);
      motionQuery.removeEventListener("change", motionChange);
      disposeScene(scene); renderer.renderLists.dispose(); renderer.dispose(); renderer.forceContextLoss();
    },
  };
}

export type GameEngine = ReturnType<typeof createEngine>;
