import { useCallback, useEffect, useRef, useState } from "react";
import type { Direction, Point } from "../types";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

const DIRECTIONS = [
  { direction: "up" as const, label: "Berjalan ke atas", Icon: ArrowUp },
  { direction: "left" as const, label: "Berjalan ke kiri", Icon: ArrowLeft },
  { direction: "down" as const, label: "Berjalan ke bawah", Icon: ArrowDown },
  { direction: "right" as const, label: "Berjalan ke kanan", Icon: ArrowRight },
] as const;

type Props = {
  disabled: boolean;
  canInteract: boolean;
  onPointer?: (id: number, direction: Direction | null) => void;
  onMove?: (vector: Point | null) => void;
  onInteract: () => void;
};

const MAX_RADIUS = 28;
const DEADZONE = 0.12;

export default function TouchControls({ disabled, canInteract, onPointer, onMove, onInteract }: Props) {
  const padRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [activeDirection, setActiveDirection] = useState<Direction | null>(null);

  const stopMovement = useCallback(() => {
    activePointerId.current = null;
    setIsDragging(false);
    setKnobPos({ x: 0, y: 0 });
    setActiveDirection(null);
    onMove?.(null);
    onPointer?.(0, null);
  }, [onMove, onPointer]);

  useEffect(() => {
    if (disabled) {
      stopMovement();
    }
  }, [disabled, stopMovement]);

  const updateFromCoords = useCallback((clientX: number, clientY: number) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    let clampedX = dx;
    let clampedY = dy;
    if (dist > MAX_RADIUS) {
      clampedX = (dx / dist) * MAX_RADIUS;
      clampedY = (dy / dist) * MAX_RADIUS;
    }

    setKnobPos({ x: clampedX, y: clampedY });

    const normalizedDist = Math.min(dist / MAX_RADIUS, 1);
    if (normalizedDist < DEADZONE) {
      onMove?.(null);
      onPointer?.(0, null);
      setActiveDirection(null);
    } else {
      const factor = (normalizedDist - DEADZONE) / (1 - DEADZONE);
      const vx = (dx / (dist || 1)) * factor;
      const vz = (dy / (dist || 1)) * factor;
      onMove?.({ x: vx, z: vz });

      if (Math.abs(dx) > Math.abs(dy)) {
        const dir = dx > 0 ? "right" : "left";
        setActiveDirection(dir);
        onPointer?.(0, dir);
      } else {
        const dir = dy > 0 ? "down" : "up";
        setActiveDirection(dir);
        onPointer?.(0, dir);
      }
    }
  }, [onMove, onPointer]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();
    activePointerId.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    updateFromCoords(event.clientX, event.clientY);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || activePointerId.current !== event.pointerId) return;
    event.preventDefault();
    updateFromCoords(event.clientX, event.clientY);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current === event.pointerId) {
      stopMovement();
    }
  };

  return (
    <div className="village-touch">
      <div
        ref={padRef}
        className={`village-joystick ${disabled ? "is-disabled" : ""}`}
        role="group"
        aria-label="Kontrol arah joystick"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onLostPointerCapture={handlePointerUp}
      >
        {DIRECTIONS.map(({ direction, label, Icon }) => (
          <div
            key={direction}
            className={`village-joystick-arrow village-joystick-arrow-${direction} ${
              activeDirection === direction ? "is-active" : ""
            }`}
            aria-label={label}
          >
            <Icon size={16} />
          </div>
        ))}
        <div
          className={`village-joystick-knob ${!isDragging ? "is-idle" : ""}`}
          style={{ transform: `translate(${knobPos.x}px, ${knobPos.y}px)` }}
          aria-hidden="true"
        >
          <span className="village-joystick-knob-dot" />
        </div>
      </div>

      <button
        className={`village-touch-interact ${canInteract ? "village-touch-interact-active" : ""}`}
        disabled={disabled || !canInteract}
        onClick={onInteract}
        aria-label={canInteract ? "Mampir ke lokasi terdekat" : "Tombol interaksi"}
      >
        <span className="village-interact-key">E</span>
        <span className="village-interact-label">Mampir</span>
      </button>
    </div>
  );
}
