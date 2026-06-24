import { useState, useEffect } from "react";
import { Github, Mail, Terminal, ChevronDown, ArrowUpRight, Award, ImagePlus, X } from "lucide-react";

const NAV_LINKS = ["Karya", "Keahlian", "Sertifikasi", "Kontak"];

const MAIN_PROJECTS = [
  {
    id: "01",
    title: "Satu Data Kota Malang",
    description:
      "Mengintegrasikan data sektoral dengan API KLHK, BPS, dan SIPD Kemendagri. Membangun dashboard analitik untuk sinkronisasi data lintas instansi pemerintah Kota Malang.",
    highlights: [
      "Integrasi API KLHK, BPS, dan SIPD Kemendagri",
      "Dashboard analitik lintas instansi",
      "Sinkronisasi data sektoral real-time",
    ],
    tags: ["Laravel", "MySQL", "Bootstrap", "REST API", "jQuery", "DataTables"],
    year: "2021–Sekarang",
    screenshot: "/screenshots/satu-data-kota-malang.png",
  },
  {
    id: "02",
    title: "PODES Kota Malang",
    description:
      "Aplikasi untuk pendataan potensi desa/kelurahan yang mempercepat proses pelaporan data potensi wilayah kepada pemerintah kota.",
    highlights: [
      "Pendataan potensi desa & kelurahan",
      "Percepatan proses pelaporan data",
      "Antarmuka sederhana untuk petugas lapangan",
    ],
    tags: ["Laravel", "Bootstrap", "MySQL"],
    year: "2022",
    screenshot: "/screenshots/podes-kota-malang.png",
  },
  {
    id: "03",
    title: "Pendataan Kesejahteraan Sosial",
    description:
      "Sistem klasifikasi kemiskinan dengan 4 kategori, dilengkapi visualisasi heatmap dan titik rumah untuk validasi lapangan. Hasil kolaborasi dengan Dinsos, Bappeda, dan Kominfo.",
    highlights: [
      "Klasifikasi kemiskinan 4 kategori",
      "Heatmap & titik rumah via Google Maps",
      "Kolaborasi 3 dinas pemerintah",
    ],
    tags: ["Laravel", "MySQL", "Bootstrap", "Chart.js", "Google Maps API", "DataTables"],
    year: "2023",
    screenshot: "/screenshots/pendataan-kesejahteraan-sosial.png",
  },
  {
    id: "04",
    title: "SITANGKAS",
    description:
      "Pendamping SIPD untuk pencairan anggaran pemerintah kota. Mendukung proses pencairan dengan Tanda Tangan Elektronik (TTE) dan sistem paperless end-to-end.",
    highlights: [
      "Integrasi Tanda Tangan Elektronik (TTE)",
      "Sistem paperless untuk pencairan anggaran",
      "Pendamping resmi SIPD Kemendagri",
    ],
    tags: ["Laravel", "MySQL", "Bootstrap", "Chart.js", "DataTables"],
    year: "2023",
    screenshot: "/screenshots/sitangkas.png",
  },
];

const MINI_PROJECTS = [
  {
    id: "M1",
    title: "Pencatat Keuangan Pribadi",
    description:
      "Aplikasi pencatat pemasukan dan pengeluaran pribadi berbasis Laravel API dan Flutter mobile.",
    tags: ["Laravel", "Flutter", "Dart", "REST API"],
    github: "https://github.com/darfianardiansyah/flutter-laravel-keuangan",
    screenshot: null,
  },
  {
    id: "M2",
    title: "Laravel Laundry App",
    description:
      "Aplikasi manajemen laundry berbasis web dengan Livewire — input transaksi, pelanggan, layanan, dan status pencucian secara realtime.",
    tags: ["Laravel", "Livewire", "MySQL"],
    github: "https://github.com/darfianardiansyah/laravel-laundry",
    screenshot: null,
  },
  {
    id: "M3",
    title: "Health Buddy — AI Health Assistant",
    description:
      "Chatbot kesehatan berbasis Google Gemini API untuk konsultasi kesehatan dasar, nutrisi, olahraga, dan informasi kesehatan umum.",
    tags: ["Node.js", "Gemini API", "AI", "Chatbot"],
    github: "https://github.com/darfianardiansyah/gemini-ai-api-trial",
    screenshot: null,
  },
  {
    id: "M4",
    title: "Image Compress Converter",
    description:
      "Konversi gambar JPG/PNG ke WebP atau AVIF dengan pengaturan kualitas, resize otomatis, dan info penghematan ukuran file.",
    tags: ["Laravel", "PHP", "WebP", "AVIF"],
    github: "https://github.com/darfianardiansyah/laravel-image-compressor",
    screenshot: null,
  },
];

const SKILLS = [
  { group: "Backend", items: ["Laravel", "PHP", "REST API", "Node.js"] },
  { group: "Frontend", items: ["HTML", "CSS", "JavaScript", "Bootstrap", "Flutter"] },
  { group: "Database", items: ["MySQL", "MariaDB", "PostgreSQL", "SQL Server"] },
  { group: "Tools", items: ["Git", "Linux Server", "Nginx", "Apache", "Postman"] },
];

const CERTIFICATIONS = [
  { name: "HackerRank — SQL (Advanced)", year: "2025" },
  { name: "Dicoding — Dasar Manajemen Proyek", year: "2024" },
  { name: "Training Awareness ISO/IEC 27001:2022 Information Security Management System", year: "2023" },
  { name: "Dicoding — Dasar Pemrograman Web", year: "2020" },
  { name: "Cisco — Introduction to Networks", year: "2020" },
  { name: "Digital Talent Scholarship — Big Data Analytics", year: "2019" },
];

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const handler = () => setY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return y;
}

function NavBar() {
  const scrollY = useScrollY();
  const scrolled = scrollY > 40;
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-border bg-background/95 backdrop-blur-sm" : ""
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-mono text-sm hover:text-foreground transition-colors"
        >
          <span className="text-foreground font-medium">darfian</span>
          <span className="text-muted-foreground">.dev</span>
        </button>
        <span className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <button
                onClick={() => scrollTo(link.toLowerCase())}
                className="font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                {link}
              </button>
            </li>
          ))}
        </span>
        <a
          href="mailto:darfianardiansyah@gmail.com"
          className="hidden md:flex items-center gap-2 border border-border px-4 py-1.5 font-mono text-xs tracking-wider uppercase hover:bg-foreground hover:text-background transition-all duration-200"
        >
          <Mail size={12} />
          Hire Me
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-end pb-24 pt-32 px-6 max-w-6xl mx-auto relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute right-0 top-0 w-1/2 h-full opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg,#fff 0px,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 40px)",
          }}
        />
      </div>
      <div className="relative">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground mb-8">
          Fullstack Web Developer — Open to Opportunities
        </p>
        <h1 className="font-sans text-[clamp(3rem,10vw,8rem)] font-black leading-[0.9] tracking-tighter text-foreground mb-8">
          Darfian
          <br />
          <span className="text-muted-foreground/40">Ardiansyah</span>
        </h1>
        <div className="max-w-xl">
          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            Programmer dengan 5+ tahun pengalaman membangun aplikasi layanan publik untuk Pemerintah
            Kota Malang. Fokus pada Laravel, integrasi REST API, dan desain database yang skalabel.
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-3 bg-foreground text-background px-6 py-3 font-mono text-sm tracking-wider uppercase hover:bg-muted-foreground transition-colors"
            >
              View Work <ArrowUpRight size={14} />
            </button>
            <a
              href="mailto:darfianardiansyah@gmail.com"
              className="flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail size={16} />
              Email Saya
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/40">
        <ChevronDown size={16} className="animate-bounce" />
      </div>
    </section>
  );
}

function ScreenshotFrame({
  src,
  alt,
  onOpen,
}: {
  src: string | null;
  alt: string;
  onOpen?: () => void;
}) {
  if (src) {
    const image = (
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        loading="lazy"
      />
    );

    if (onOpen) {
      return (
        <button
          type="button"
          onClick={onOpen}
          className="w-full aspect-video bg-secondary border border-border overflow-hidden cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
          aria-label={`Open ${alt}`}
        >
          {image}
        </button>
      );
    }

    return (
      <div className="w-full aspect-video bg-secondary border border-border overflow-hidden">
        {image}
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-secondary border border-dashed border-border flex flex-col items-center justify-center gap-3 group-hover:border-muted-foreground/30 transition-colors duration-200">
      <ImagePlus size={20} className="text-muted-foreground/20" />
      <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/20">
        Tambah Screenshot
      </span>
    </div>
  );
}

function ScreenshotLightbox({
  screenshot,
  onClose,
}: {
  screenshot: { src: string; title: string } | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!screenshot) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screenshot, onClose]);

  if (!screenshot) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm px-4 py-6 md:px-10 md:py-10"
      role="dialog"
      aria-modal="true"
      aria-label={`Screenshot ${screenshot.title}`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 md:right-8 md:top-8 inline-flex h-10 w-10 items-center justify-center border border-border bg-background text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close screenshot preview"
      >
        <X size={18} />
      </button>
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={screenshot.src}
          alt={`Screenshot ${screenshot.title}`}
          className="max-h-full max-w-full object-contain border border-border bg-secondary"
          onClick={(event) => event.stopPropagation()}
        />
      </div>
    </div>
  );
}

function MainProjectCard({
  project,
  onOpenScreenshot,
}: {
  project: (typeof MAIN_PROJECTS)[0];
  onOpenScreenshot: (project: (typeof MAIN_PROJECTS)[0]) => void;
}) {
  return (
    <article className="border border-border group hover:bg-card transition-colors duration-200">
      <ScreenshotFrame
        src={project.screenshot}
        alt={`Screenshot ${project.title}`}
        onOpen={() => onOpenScreenshot(project)}
      />
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <span className="font-mono text-xs text-muted-foreground/30">{project.id}</span>
          <span className="font-mono text-xs text-muted-foreground/40">{project.year}</span>
        </div>
        <h3 className="font-sans text-xl font-semibold text-foreground mb-3">{project.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{project.description}</p>
        <ul className="space-y-1.5 mb-6">
          {project.highlights.map((h) => (
            <li key={h} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="mt-2 w-1 h-1 bg-muted-foreground/30 block shrink-0" />
              {h}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] tracking-widest uppercase px-2 py-1 border border-border text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function MiniProjectCard({ project }: { project: (typeof MINI_PROJECTS)[0] }) {
  return (
    <article className="border border-border group hover:bg-card transition-colors duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className="font-mono text-xs text-muted-foreground/30">{project.id}</span>
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Github size={14} />
          </a>
        </div>
        <h3 className="font-sans text-base font-semibold text-foreground mb-2">{project.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] tracking-widest uppercase px-2 py-1 border border-border text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github size={14} />
          View GitHub
          <ArrowUpRight size={12} />
        </a>
      </div>
    </article>
  );
}

function Work() {
  const [activeScreenshot, setActiveScreenshot] = useState<{ src: string; title: string } | null>(
    null
  );

  const openScreenshot = (project: (typeof MAIN_PROJECTS)[0]) => {
    if (!project.screenshot) return;
    setActiveScreenshot({ src: project.screenshot, title: project.title });
  };

  return (
    <>
    <section id="work" className="py-32 px-6 max-w-6xl mx-auto">
      {/* Main Projects */}
      <div className="flex items-baseline justify-between mb-16 border-b border-border pb-6">
        <div>
          <h2 className="font-sans text-4xl font-black tracking-tighter">Proyek Pilihan</h2>
          <p className="font-mono text-xs text-muted-foreground mt-2 tracking-widest uppercase">
            Government Projects — Diskominfo Kota Malang
          </p>
        </div>
        <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
          {MAIN_PROJECTS.length} Proyek
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-border mb-24">
        {MAIN_PROJECTS.map((p) => (
          <div key={p.id} className="bg-background">
            <MainProjectCard project={p} onOpenScreenshot={openScreenshot} />
          </div>
        ))}
      </div>

      {/* Mini Projects */}
      <div className="flex items-baseline justify-between mb-16 border-b border-border pb-6">
        <div>
          <h2 className="font-sans text-4xl font-black tracking-tighter">Mini Proyek</h2>
          <p className="font-mono text-xs text-muted-foreground mt-2 tracking-widest uppercase">
            Pribadi
          </p>
        </div>
        <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
          {MINI_PROJECTS.length} Proyek
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
        {MINI_PROJECTS.map((p) => (
          <div key={p.id} className="bg-background">
            <MiniProjectCard project={p} />
          </div>
        ))}
      </div>
    </section>
    <ScreenshotLightbox screenshot={activeScreenshot} onClose={() => setActiveScreenshot(null)} />
    </>
  );
}

function Skills() {
  return (
    <section id="skills" className="py-32 px-6 max-w-6xl mx-auto">
      <div className="flex items-baseline justify-between mb-16 border-b border-border pb-6">
        <h2 className="font-sans text-4xl font-black tracking-tighter">Keahlian</h2>
        <Terminal size={16} className="text-muted-foreground" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
        {SKILLS.map((group) => (
          <div key={group.group} className="bg-background p-8">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-6">
              {group.group}
            </p>
            <ul className="space-y-3">
              {group.items.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-muted-foreground/40 block shrink-0" />
                  <span className="font-mono text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Certifications() {
  return (
    <section id="certifications" className="py-32 px-6 max-w-6xl mx-auto">
      <div className="flex items-baseline justify-between mb-16 border-b border-border pb-6">
        <h2 className="font-sans text-4xl font-black tracking-tighter">Sertifikasi</h2>
        <Award size={16} className="text-muted-foreground" />
      </div>
      <div className="grid gap-px bg-border">
        {CERTIFICATIONS.map((cert, i) => (
          <div
            key={cert.name}
            className="bg-background flex items-center justify-between px-8 py-6 hover:bg-card transition-colors duration-200"
          >
            <div className="flex items-center gap-8">
              <span className="font-mono text-xs text-muted-foreground/30 w-6 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-sans font-medium text-foreground">{cert.name}</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground/50 shrink-0">{cert.year}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-32 px-6 max-w-6xl mx-auto border-t border-border">
      <div className="text-center max-w-2xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-6">
          Kontak
        </p>
        <h2 className="font-sans text-5xl font-black tracking-tighter mb-6">
          {"Let's work"}
          <br />
          <span className="text-muted-foreground">together.</span>
        </h2>
        <p className="text-muted-foreground mb-12">
          {/* Open to full-time roles, freelance projects, and technical collaborations. */}
        </p>
        <a
          href="mailto:darfianardiansyah@gmail.com"
          className="inline-flex items-center gap-3 border border-foreground px-10 py-4 font-mono text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-all duration-200 group"
        >
          <Mail size={14} />
          darfianardiansyah@gmail.com
          <ArrowUpRight
            size={14}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </a>
        <div className="flex justify-center mt-12">
          <a
            href="tel:085954551591"
            className="font-mono text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            {/* +62 859-5455-1591 */}
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <span className="font-mono text-xs text-muted-foreground">
        © 2026 Darfian Ardiansyah. All rights reserved.
      </span>
      <span className="font-mono text-xs text-muted-foreground/40">Fullstack Web Developer</span>
    </footer>
  );
}

export default function App() {
  return (
    <div
      className="bg-background text-foreground min-h-screen"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
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
