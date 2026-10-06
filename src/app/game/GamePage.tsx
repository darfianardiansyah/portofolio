import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowUpRight, Compass, Map, Sprout } from "lucide-react";
import GameCanvas from "./GameCanvas";
import LocationPanel from "./components/LocationPanel";
import TouchControls from "./components/TouchControls";
import { LOCATIONS } from "./worldConfig";
import type { GameEngine } from "./engine";
import type { GameLocation } from "./types";
import "./village.css";

export default function GamePage() {
  const engine = useRef<GameEngine | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [near, setNear] = useState<GameLocation | null>(null);
  const [location, setLocation] = useState<GameLocation | null>(null);
  const [menu, setMenu] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuElement = useRef<HTMLDivElement>(null);
  const openLocation = useCallback((next: GameLocation) => {
    returnFocus.current = document.activeElement as HTMLElement;
    engine.current?.setPaused(true); setLocation(next);
  }, []);
  const onEngine = useCallback((next: GameEngine | null) => { engine.current = next; if (next) setReady(true); }, []);
  const onError = useCallback((message: string) => { setError(message); setReady(false); engine.current?.setPaused(true); }, []);
  useEffect(() => { window.scrollTo(0, 0); const title = document.title; document.title = "Desa Darfian — Portofolio"; return () => { document.title = title; }; }, []);
  useEffect(() => { engine.current?.setPaused(Boolean(location) || menu || Boolean(error)); }, [location, menu, error, ready]);
  useEffect(() => {
    if (!menu) return;
    const closeMenu = (event: KeyboardEvent) => {
      // A dialog may close synchronously before this event reaches window.
      // Do not let the same Escape also close its underlying location menu.
      if (event.defaultPrevented || (event.target instanceof Element && event.target.closest('[role="dialog"]'))) return;
      if (event.key === "Escape" && !location) { setMenu(false); menuButton.current?.focus(); }
    };
    const outside = (event: PointerEvent) => {
      if (!location && !menuElement.current?.contains(event.target as Node) && !menuButton.current?.contains(event.target as Node)) setMenu(false);
    };
    window.addEventListener("keydown", closeMenu); window.addEventListener("pointerdown", outside);
    return () => { window.removeEventListener("keydown", closeMenu); window.removeEventListener("pointerdown", outside); };
  }, [menu, location]);
  function retry() { setError(""); setNear(null); setReady(false); setAttempt((value) => value + 1); }
  return <main className="village-page">
    <GameCanvas key={attempt} onEngine={onEngine} onLocation={setNear} onInteract={openLocation} onError={onError} />
    <header className="village-topbar">
      <Link to="/" className="village-back"><ArrowLeft size={16} /><span>Kembali ke Portofolio</span></Link>
      <div className="village-brand"><Sprout size={20} /><span>DESA DARFIAN</span><span className="village-brand-dot" /></div>
      <button ref={menuButton} className="village-menu-button" aria-expanded={menu} aria-controls="village-locations" onClick={() => setMenu((value) => !value)}><Map size={17} />Daftar Lokasi</button>
    </header>
    <section className="village-intro" aria-label="Selamat datang"><span className="village-eyebrow">Sebuah tempat untuk mengenal saya</span><h1>Langkah kecil,<br />cerita besar.</h1><p>Jelajahi desa. Temukan karya,<br />keahlian, dan perjalanan saya.</p><span className="village-season"><span />Musim bertumbuh</span></section>
    {menu && <nav ref={menuElement} id="village-locations" className="village-location-menu" aria-label="Daftar lokasi portofolio"><span className="village-eyebrow">Mau mampir ke mana?</span>{LOCATIONS.map((item) => <button key={item.id} onClick={() => openLocation(item)}><span className="village-location-number" style={{ background: item.color }}>{item.number}</span><span><strong>{item.label}</strong><small>{item.subtitle}</small></span><ArrowUpRight size={16} /></button>)}</nav>}
    {!ready && !error && <div className="village-loading" role="status"><Sprout size={26} /><p>Menyiapkan desa…</p></div>}
    {error && <section className="village-error" role="status"><h2>Dunia sedang beristirahat</h2><p>{error}</p><div><button className="village-button" onClick={retry}>Muat ulang dunia</button><button className="village-inline-link" onClick={() => setMenu(true)}>Daftar Lokasi <ArrowUpRight size={16} /></button></div></section>}
    <div className="village-bottom">
      <div className="village-controls" id="village-controls">
        <Compass size={19} />
        <div>
          <strong>Pelan-pelan, jelajahi saja.</strong>
          <p className="village-desktop-hint"><kbd>W A S D</kbd> / panah untuk berjalan · <kbd>E</kbd> untuk mampir</p>
          <p className="village-mobile-hint">Gunakan kontrol sentuh · Tekan [E] untuk mampir</p>
        </div>
      </div>
      <div className="village-near" aria-live="polite">
        {near && !error ? (
          <button onClick={() => openLocation(near)} disabled={Boolean(location) || menu}>
            <span className="village-location-number" style={{ background: near.color }}>{near.number}</span>
            <span>
              <strong>{near.label}</strong>
              <small className="village-desktop-hint">Tekan E untuk mampir</small>
              <small className="village-mobile-hint">Ketuk [E] atau kartu untuk mampir</small>
            </span>
            <ArrowUpRight size={18} />
          </button>
        ) : (
          <span>
            <span className="village-desktop-hint">Ikuti jalan menuju rumah dengan penanda.</span>
            <span className="village-mobile-hint">Gunakan kontrol sentuh untuk menuju rumah bertanda.</span>
          </span>
        )}
      </div>
    </div>
    <TouchControls
      disabled={!ready || Boolean(error) || Boolean(location) || menu}
      canInteract={Boolean(near)}
      onPointer={(id, direction) => engine.current?.input.setPointer(id, direction)}
      onMove={(vector) => engine.current?.input.setVector(vector)}
      onInteract={() => { if (near) openLocation(near); }}
    />
    <LocationPanel location={location} onClose={() => setLocation(null)} restoreFocus={() => { const element = returnFocus.current; if (element?.isConnected) element.focus({ preventScroll: true }); }} />
  </main>;
}
