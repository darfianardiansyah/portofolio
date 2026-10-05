import { useEffect, useRef } from "react";
import { createEngine, type GameEngine } from "./engine";
import type { GameLocation } from "./types";

type Props = {
  onEngine: (engine: GameEngine | null) => void;
  onLocation: (location: GameLocation | null) => void;
  onInteract: (location: GameLocation) => void;
  onError: (message: string) => void;
};

export default function GameCanvas(props: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const callbacks = useRef(props); callbacks.current = props;
  useEffect(() => {
    const element = canvas.current!;
    let engine: GameEngine | undefined;
    try {
      engine = createEngine(element, {
        onLocation: (location) => callbacks.current.onLocation(location),
        onInteract: (location) => callbacks.current.onInteract(location),
        onError: (message) => callbacks.current.onError(message),
      });
      callbacks.current.onEngine(engine);
      if (document.activeElement === document.body) element.focus({ preventScroll: true });
    } catch {
      callbacks.current.onError("Dunia 3D belum dapat ditampilkan pada perangkat ini. Informasi tetap tersedia melalui Daftar Lokasi.");
    }
    return () => { callbacks.current.onEngine(null); engine?.dispose(); };
  }, []);
  return <canvas ref={canvas} className="village-canvas" tabIndex={0} aria-label="Dunia portofolio. Gunakan WASD atau tombol panah untuk berjalan dan E untuk berinteraksi." aria-describedby="village-controls" onPointerDown={() => canvas.current?.focus({ preventScroll: true })} />;
}
