import type { Direction } from "../types";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

const DIRECTIONS = [
  { direction: "up", label: "Berjalan ke atas", Icon: ArrowUp },
  { direction: "left", label: "Berjalan ke kiri", Icon: ArrowLeft },
  { direction: "down", label: "Berjalan ke bawah", Icon: ArrowDown },
  { direction: "right", label: "Berjalan ke kanan", Icon: ArrowRight },
] as const;

type Props = { disabled: boolean; canInteract: boolean; onPointer: (id: number, direction: Direction | null) => void; onInteract: () => void };
export default function TouchControls({ disabled, canInteract, onPointer, onInteract }: Props) {
  return <div className="village-touch">
    <div className="village-dpad" aria-label="Kontrol arah">
      {DIRECTIONS.map(({ direction, label, Icon }) => <button key={direction} className={`village-direction village-direction-${direction}`} aria-label={label} disabled={disabled}
        onPointerDown={(event) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); onPointer(event.pointerId, direction); }}
        onPointerUp={(event) => onPointer(event.pointerId, null)} onPointerCancel={(event) => onPointer(event.pointerId, null)} onLostPointerCapture={(event) => onPointer(event.pointerId, null)}><Icon size={23} /></button>)}
    </div>
    <button className="village-touch-interact" disabled={disabled || !canInteract} onClick={onInteract} aria-label="Berinteraksi dengan lokasi terdekat">E<span>Interaksi</span></button>
  </div>;
}
