import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import {
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  Github,
  ImagePlus,
  Mail,
  ShieldCheck,
  Terminal,
  X,
} from "lucide-react";
import {
  CERTIFICATIONS,
  MAIN_PROJECTS,
  MINI_PROJECTS,
  NAV_LINKS,
  SKILLS,
  type Certification,
  type MainProject,
  type MiniProject,
} from "./data/portfolio";

type LightboxItem = {
  sources: string[];
  title: string;
  type: "screenshot" | "certificate";
  initialIndex?: number;
} | null;

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const heroStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const smoothReveal: Transition = { duration: 0.56, ease: [0.22, 1, 0.36, 1] };

const HERO_COPY = {
  eyebrow: "Terbuka untuk peluang kerja",
  title: "Fullstack Developer untuk Sistem Web Produksi",
  description:
    "Membangun dan merawat aplikasi web yang stabil, mudah dikembangkan, dan membantu tim bekerja lebih cepat dengan data yang lebih rapi.",
  primaryCta: "Lihat Proyek",
  secondaryCta: "Hubungi Saya",
};

const HERO_STATS = [
  ["5+ Tahun", "Pengalaman"],
  [`${MAIN_PROJECTS.length}+`, "Proyek produksi"],
  [`${CERTIFICATIONS.length}`, "Sertifikasi"],
];

function useScrollY() {
  const [y, setY] = useState(0);

  useEffect(() => {
    const handler = () => setY(window.scrollY);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return y;
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getProjectScreenshots(project: MainProject): string[] {
  if ("screenshots" in project && Array.isArray(project.screenshots)) {
    return project.screenshots.filter(Boolean);
  }

  if ("screenshot" in project && typeof project.screenshot === "string") {
    return [project.screenshot];
  }

  return [];
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  meta,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
  icon?: typeof BriefcaseBusiness;
}) {
  return (
    <Reveal className="mb-10 border-b border-slate-200 pb-7 md:mb-14 md:flex md:items-end md:justify-between md:gap-10">
      <div className="max-w-2xl">
        <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          {Icon ? <Icon size={15} className="text-cyan-700" /> : null}
          {eyebrow}
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">{description}</p>
      </div>
      {meta ? (
        <span className="mt-6 inline-flex rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:mt-0">
          {meta}
        </span>
      ) : null}
    </Reveal>
  );
}

function NavBar() {
  const scrollY = useScrollY();
  const scrolled = scrollY > 24;

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl"
          : "bg-white/70 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex items-center gap-3 text-left"
          aria-label="Kembali ke awal halaman"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
            DA
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-semibold text-slate-950">Darfian Ardiansyah</span>
            <span className="block text-xs text-slate-500">Fullstack Developer</span>
          </span>
        </button>

        <ul className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white p-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => scrollToSection(link.id)}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <a
          href="mailto:darfianardiansyah@gmail.com"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-cyan-800"
        >
          <Mail size={16} />
          <span className="hidden sm:inline">Kontak</span>
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-28" aria-labelledby="hero-title">
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-center px-5 pb-16 md:px-8">
        <motion.div
          variants={heroStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-5xl"
        >
          <motion.div
            variants={heroItem}
            transition={smoothReveal}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
            aria-label="Status ketersediaan kerja"
          >
            <ShieldCheck size={14} className="text-cyan-700" aria-hidden="true" />
            {HERO_COPY.eyebrow}
          </motion.div>
          <motion.h1
            id="hero-title"
            variants={heroItem}
            transition={smoothReveal}
            className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl"
          >
            {HERO_COPY.title}
          </motion.h1>
          <motion.p
            variants={heroItem}
            transition={smoothReveal}
            className="mt-7 max-w-2xl text-lg leading-8 text-slate-600"
          >
            {HERO_COPY.description}
          </motion.p>

          <motion.div
            variants={heroItem}
            transition={smoothReveal}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <button
              type="button"
              onClick={() => scrollToSection("work")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800"
              aria-label="Lihat proyek utama Darfian Ardiansyah"
            >
              {HERO_COPY.primaryCta}
              <ArrowUpRight size={17} aria-hidden="true" />
            </button>
            <a
              href="mailto:darfianardiansyah@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-cyan-700 hover:text-cyan-800"
              aria-label="Kirim email ke Darfian Ardiansyah"
            >
              <Mail size={17} aria-hidden="true" />
              {HERO_COPY.secondaryCta}
            </a>
          </motion.div>

          <motion.dl
            variants={heroItem}
            transition={smoothReveal}
            className="mt-10 grid max-w-2xl grid-cols-3 gap-4 border-t border-slate-200 pt-6"
            aria-label="Ringkasan pengalaman profesional"
          >
            {HERO_STATS.map(([value, label]) => (
              <div key={label}>
                <dt className="text-2xl font-semibold tracking-tight text-slate-950">{value}</dt>
                <dd className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                  {label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
      <button
        type="button"
        onClick={() => scrollToSection("work")}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-slate-400 transition hover:text-slate-700 md:block"
        aria-label="Scroll ke bagian proyek"
      >
        <ChevronDown size={22} aria-hidden="true" />
      </button>
    </section>
  );
}

function ScreenshotFrame({
  sources,
  alt,
  onOpen,
}: {
  sources: string[];
  alt: string;
  onOpen?: () => void;
}) {
  const previewSrc = sources[0] ?? null;

  if (previewSrc) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="group/image relative block aspect-video w-full overflow-hidden bg-slate-100 text-left"
        aria-label={`Buka galeri ${alt}`}
      >
        <img
          src={previewSrc}
          alt={alt}
          className="h-full w-full object-cover object-top transition duration-500 group-hover/image:scale-[1.03]"
          loading="lazy"
        />
        {sources.length > 1 ? (
          <span className="absolute right-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
            {sources.length} gambar
          </span>
        ) : null}
        <span className="absolute inset-x-4 bottom-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/92 px-3 py-2 text-xs font-semibold text-slate-800 opacity-0 shadow-sm backdrop-blur transition group-hover/image:opacity-100">
          Preview screenshot
          <ArrowUpRight size={14} aria-hidden="true" />
        </span>
      </button>
    );
  }

  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 border border-dashed border-slate-300 bg-slate-50 text-slate-400">
      <ImagePlus size={22} />
      <span className="text-xs font-semibold uppercase tracking-[0.18em]">Screenshot belum tersedia</span>
    </div>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function MainProjectCard({
  project,
  index,
  onOpenScreenshot,
}: {
  project: MainProject;
  index: number;
  onOpenScreenshot: (project: MainProject) => void;
}) {
  const screenshots = getProjectScreenshots(project);

  return (
    <Reveal delay={index * 0.05}>
      <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-slate-200/80">
        <ScreenshotFrame
          sources={screenshots}
          alt={`Screenshot ${project.title}`}
          onOpen={() => onOpenScreenshot(project)}
        />
        <div className="p-6 md:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {project.id}
            </span>
            <span className="text-sm font-medium text-slate-500">{project.year}</span>
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">{project.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{project.description}</p>
          <ul className="mt-6 space-y-3">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3 text-sm leading-6 text-slate-700">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-700" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <TagList tags={project.tags} />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function MiniProjectCard({ project, index }: { project: MiniProject; index: number }) {
  return (
    <Reveal delay={index * 0.04}>
      <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg">
        <div className="mb-5 flex items-center justify-between">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            {project.id}
          </span>
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-cyan-700 hover:text-cyan-800"
            aria-label={`Buka GitHub ${project.title}`}
          >
            <Github size={17} />
          </a>
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-slate-950">{project.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{project.description}</p>
        <div className="mt-6">
          <TagList tags={project.tags} />
        </div>
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-cyan-800"
        >
          Lihat repository
          <ArrowUpRight size={15} />
        </a>
      </article>
    </Reveal>
  );
}

function Work() {
  const [activeLightbox, setActiveLightbox] = useState<LightboxItem>(null);

  const openScreenshot = (project: MainProject) => {
    const screenshots = getProjectScreenshots(project);

    if (!screenshots.length) return;

    setActiveLightbox({
      sources: screenshots,
      title: project.title,
      type: "screenshot",
      initialIndex: 0,
    });
  };

  return (
    <section id="work" className="bg-slate-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          eyebrow="Proyek"
          title="Bukti kerja nyata di sistem pemerintahan dan aplikasi data."
          description="Project utama menampilkan pengalaman membangun sistem yang dipakai untuk integrasi data, pelaporan, visualisasi, dan proses operasional lintas instansi."
          meta={`${MAIN_PROJECTS.length} Proyek utama`}
          icon={BriefcaseBusiness}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {MAIN_PROJECTS.map((project, index) => (
            <MainProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpenScreenshot={openScreenshot}
            />
          ))}
        </div>

        <div className="mt-20 md:mt-28">
          <SectionHeader
            eyebrow="Eksplorasi teknis"
            title="Mini project untuk memperluas praktik lintas stack."
            description="Kumpulan project pribadi untuk eksperimen teknis & pembelajaran mandiri"
            meta={`${MINI_PROJECTS.length} Repository`}
            icon={Code2}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {MINI_PROJECTS.map((project, index) => (
            <MiniProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
      <MediaLightbox item={activeLightbox} onClose={() => setActiveLightbox(null)} />
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          eyebrow="Keahlian"
          title="Stack yang relevan untuk membangun, merawat, dan mengembangkan produk web."
          description="Keahlian disusun berdasarkan area kerja agar recruiter dapat cepat membaca kecocokan teknis: backend, frontend, database, dan tools operasional."
          icon={Terminal}
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SKILLS.map((group, index) => (
            <Reveal key={group.group} delay={index * 0.05}>
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-800">
                  {group.group}
                </p>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <span className="h-2 w-2 rounded-full bg-slate-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Certifications() {
  const [activeLightbox, setActiveLightbox] = useState<LightboxItem>(null);

  const openCertificate = (cert: Certification) => {
    setActiveLightbox({ sources: [cert.certificate], title: cert.name, type: "certificate" });
  };

  return (
    <section id="certifications" className="bg-slate-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          eyebrow="Sertifikasi"
          title="Validasi tambahan untuk kompetensi teknis dan tata kelola."
          description="Sertifikasi menjadi penguat kredibilitas: mulai dari SQL, manajemen proyek, keamanan informasi, web dasar, networking, sampai big data analytics."
          meta={`${CERTIFICATIONS.length} Dokumen`}
          icon={Award}
        />

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {CERTIFICATIONS.map((cert, index) => (
            <Reveal key={cert.name} delay={index * 0.035}>
              <button
                onClick={() => openCertificate(cert)}
                className="group flex w-full items-center justify-between gap-5 border-b border-slate-200 px-5 py-5 text-left transition last:border-b-0 hover:bg-slate-50 md:px-7"
              >
                <span className="flex min-w-0 items-center gap-4 md:gap-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-6 text-slate-950 md:text-base">
                      {cert.name}
                    </span>
                    <span className="mt-1 block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                      Lihat sertifikat
                    </span>
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-3 text-sm font-semibold text-slate-500">
                  {cert.year}
                  <ArrowUpRight
                    size={16}
                    className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-800"
                  />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      <MediaLightbox item={activeLightbox} onClose={() => setActiveLightbox(null)} />
    </section>
  );
}

function MediaLightbox({ item, onClose }: { item: LightboxItem; onClose: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSrc = item?.sources[activeIndex] ?? "";
  const hasMultipleSources = Boolean(item && item.sources.length > 1);

  useEffect(() => {
    if (!item) return;

    setActiveIndex(item.initialIndex ?? 0);
  }, [item]);

  useEffect(() => {
    if (!item) return;

    const showPrevious = () => {
      setActiveIndex((current) => (current === 0 ? item.sources.length - 1 : current - 1));
    };

    const showNext = () => {
      setActiveIndex((current) => (current === item.sources.length - 1 ? 0 : current + 1));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (!hasMultipleSources) return;

      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasMultipleSources, item, onClose]);

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${item.type === "certificate" ? "Sertifikat" : "Screenshot"} ${item.title}`}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg transition hover:bg-slate-100 md:right-8 md:top-8"
            aria-label="Tutup preview"
          >
            <X size={20} />
          </button>

          <motion.div
            className="max-h-full w-full max-w-6xl"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-4 text-white">
              <p className="truncate text-sm font-semibold md:text-base">{item.title}</p>
              <div className="hidden items-center gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 sm:flex">
                {hasMultipleSources ? (
                  <span>
                    {activeIndex + 1} / {item.sources.length}
                  </span>
                ) : null}
                <span>Tekan Esc untuk menutup</span>
              </div>
            </div>
            <div className="relative">
              {hasMultipleSources ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((current) =>
                        current === 0 ? item.sources.length - 1 : current - 1,
                      )
                    }
                    className="absolute left-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg transition hover:bg-slate-100"
                    aria-label="Tampilkan gambar sebelumnya"
                  >
                    <ChevronLeft size={20} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((current) =>
                        current === item.sources.length - 1 ? 0 : current + 1,
                      )
                    }
                    className="absolute right-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg transition hover:bg-slate-100"
                    aria-label="Tampilkan gambar berikutnya"
                  >
                    <ChevronRight size={20} aria-hidden="true" />
                  </button>
                </>
              ) : null}
              {activeSrc.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={activeSrc}
                  title={item.title}
                  className="h-[80vh] w-full rounded-2xl border border-white/15 bg-white"
                />
              ) : (
                <img
                  src={activeSrc}
                  alt={`${item.title} ${hasMultipleSources ? `gambar ${activeIndex + 1}` : ""}`.trim()}
                  className="mx-auto max-h-[82vh] max-w-full rounded-2xl border border-white/15 bg-white object-contain shadow-2xl"
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-slate-950 py-20 text-white md:py-28">
      <Reveal className="mx-auto max-w-4xl px-5 text-center md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Kontak</p>
        <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
          Tertarik berdiskusi tentang role atau project berikutnya?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
          Saya terbuka untuk peluang full-time, kolaborasi teknis, dan pekerjaan yang membutuhkan
          developer web dengan pengalaman membangun sistem operasional berbasis data.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="mailto:darfianardiansyah@gmail.com"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 sm:w-auto"
          >
            <Mail size={17} />
            darfianardiansyah@gmail.com
            <ArrowUpRight size={16} />
          </a>
          <a
            href="https://github.com/darfianardiansyah"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200 sm:w-auto"
          >
            <Github size={17} />
            GitHub
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-5 py-8 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <span>© 2026 Darfian Ardiansyah. All rights reserved.</span>
        <span>Fullstack Web Developer - Laravel, REST API, Database</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-950 antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <NavBar />
      <main>
        <Hero />
        <Work />
        <Skills />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
