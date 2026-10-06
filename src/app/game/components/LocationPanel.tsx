import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { CERTIFICATIONS, MAIN_PROJECTS, MINI_PROJECTS, SKILLS } from "../../data/portfolio";
import { PROFILE } from "../../data/profile";
import type { GameLocation } from "../types";

type Preview = { sources: string[]; index: number; title: string };
type Props = { location: GameLocation | null; onClose: () => void; restoreFocus: () => void };

export default function LocationPanel({ location, onClose, restoreFocus }: Props) {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const previewTrigger = useRef<HTMLElement | null>(null);
  useEffect(() => { setPreview(null); }, [location?.id]);
  useEffect(() => { setImageFailed(false); }, [preview?.index, preview?.sources]);
  function showMedia(sources: string[], title: string, index = 0) {
    previewTrigger.current = document.activeElement as HTMLElement;
    setPreview({ sources, title, index });
  }
  function changeImage(delta: number) {
    setPreview((current) => current && { ...current, index: (current.index + delta + current.sources.length) % current.sources.length });
  }
  return <Dialog.Root open={Boolean(location)} onOpenChange={(open) => { if (!open) onClose(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className="village-overlay" />
      <Dialog.Content className="village-panel" onCloseAutoFocus={(event) => { event.preventDefault(); restoreFocus(); }}>
        <header className="village-panel-header">
          <div><span className="village-eyebrow">Lokasi {location?.number}</span><Dialog.Title>{location?.label}</Dialog.Title><Dialog.Description>{location?.subtitle}</Dialog.Description></div>
          <Dialog.Close className="village-icon-button" aria-label="Tutup informasi"><X size={21} /></Dialog.Close>
        </header>
        <div className="village-panel-body">
          {location?.id === "home" && <>
            <div className="village-profile"><img src={PROFILE.photo} alt={PROFILE.name} /><div><span className="village-eyebrow">Selamat datang di rumah saya</span><h3>{PROFILE.name}</h3><p>{PROFILE.hero.title}</p></div></div>
            <p>{PROFILE.hero.description}</p>
            <div className="village-stats"><div><strong>{PROFILE.experience}</strong><span>Pengalaman</span></div><div><strong>{MAIN_PROJECTS.length}</strong><span>Proyek utama</span></div><div><strong>{CERTIFICATIONS.length}</strong><span>Sertifikasi</span></div></div>
            <p className="village-note">{PROFILE.hero.eyebrow}. Jelajahi taman untuk melihat karya, teknologi, dan perjalanan belajar saya.</p>
          </>}
          {location?.id === "projects" && <>
            <p>Beberapa sistem yang saya bangun dan rawat, serta eksperimen pribadi.</p>
            <h3 className="village-section-title">Proyek utama</h3>
            {MAIN_PROJECTS.map((project) => <article className="village-card" key={project.id}>
              <div className="village-card-heading"><h3>{project.title}</h3><span>{project.year}</span></div>
              <p>{project.description}</p>
              <ul>{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
              <div className="village-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="village-gallery">{project.screenshots.map((source, index) => <button key={source} onClick={() => showMedia(project.screenshots, project.title, index)} aria-label={`Lihat screenshot ${project.title} ${index + 1}`}><img src={source} alt={`${project.title}, screenshot ${index + 1}`} loading="lazy" /><span>Lihat screenshot {index + 1} ↗</span></button>)}</div>
            </article>)}
            <h3 className="village-section-title">Proyek mini</h3>
            {MINI_PROJECTS.map((project) => <article className="village-card" key={project.id}><h3>{project.title}</h3><p>{project.description}</p><div className="village-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a className="village-inline-link" href={project.github} target="_blank" rel="noreferrer">Lihat di GitHub <ArrowUpRight size={16} /></a></article>)}
          </>}
          {location?.id === "skills" && <>
            <p>Teknologi yang saya gunakan untuk membangun dan mengelola aplikasi.</p>
            <div className="village-skill-grid">{SKILLS.map((skill) => <article className="village-card" key={skill.group}><h3>{skill.group}</h3><div className="village-tags">{skill.items.map((item) => <span key={item}>{item}</span>)}</div></article>)}</div>
          </>}
          {location?.id === "museum" && <>
            <p>Jejak belajar dalam pengembangan aplikasi, data, jaringan, dan keamanan.</p>
            <div className="village-certificate-grid">{CERTIFICATIONS.map((certificate) => <article className="village-card" key={certificate.certificate}><button className="village-certificate" onClick={() => showMedia([certificate.certificate], certificate.name)} aria-label={`Lihat sertifikat ${certificate.name}`}><img src={certificate.certificate} alt={certificate.name} loading="lazy" /><span>Lihat sertifikat ↗</span></button><h3>{certificate.name}</h3><p>{certificate.year}</p></article>)}</div>
          </>}
          {location?.id === "contact" && <>
            <div className="village-letter"><span className="village-eyebrow">Surat untuk kolaborasi berikutnya</span><h3>Mari terhubung</h3><p>{PROFILE.contactDescription}</p><a className="village-button" href={`mailto:${PROFILE.email}`}>{PROFILE.email} <ArrowUpRight size={17} /></a><a className="village-inline-link" href={PROFILE.github} target="_blank" rel="noreferrer">Kunjungi GitHub <ArrowUpRight size={17} /></a></div>
          </>}
        </div>
        <Dialog.Root open={Boolean(preview)} onOpenChange={(open) => { if (!open) setPreview(null); }}>
          <Dialog.Portal>
            <Dialog.Overlay className="village-overlay village-media-overlay" />
            <Dialog.Content className="village-media" onCloseAutoFocus={(event) => { event.preventDefault(); previewTrigger.current?.focus({ preventScroll: true }); }} onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); changeImage(event.key === "ArrowLeft" ? -1 : 1); } }}>
              <div className="village-media-header"><div><Dialog.Title>{preview?.title}</Dialog.Title><Dialog.Description>Preview gambar {preview ? preview.index + 1 : 0} dari {preview?.sources.length ?? 0}</Dialog.Description></div><Dialog.Close className="village-icon-button" aria-label="Tutup preview"><X size={22} /></Dialog.Close></div>
              {preview && (imageFailed ? <p role="status">Gambar belum dapat dimuat. Tutup preview dan coba kembali.</p> : <img src={preview.sources[preview.index]} alt={`${preview.title}, gambar ${preview.index + 1}`} onError={() => setImageFailed(true)} />)}
              {preview && preview.sources.length > 1 && <div className="village-media-nav"><button className="village-icon-button" onClick={() => changeImage(-1)} aria-label="Gambar sebelumnya"><ChevronLeft /></button><span>{preview.index + 1} / {preview.sources.length}</span><button className="village-icon-button" onClick={() => changeImage(1)} aria-label="Gambar berikutnya"><ChevronRight /></button></div>}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
