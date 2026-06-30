export const NAV_LINKS = [
  { label: "Proyek", id: "work" },
  { label: "Keahlian", id: "skills" },
  { label: "Sertifikasi", id: "certifications" },
  { label: "Kontak", id: "contact" },
];

export const MAIN_PROJECTS = [
  {
    id: "01",
    title: "Satu Data Kota Malang",
    description:
      "Mengintegrasikan data API KLHK, BPS, dan SIPD Kemendagri. Membangun analitik data lintas instansi pemerintah Kota Malang.",
    highlights: [
      "Integrasi API KLHK, BPS, dan SIPD Kemendagri",
      "Dashboard analitik lintas instansi",
      "Sinkronisasi data sektoral real-time",
    ],
    tags: ["Laravel", "MySQL", "Bootstrap", "REST API"],
    year: "2021-Sekarang",
    screenshots: ["/screenshots/satu-data-kota-malang-landing.png", "/screenshots/satu-data-kota-malang.png", "/screenshots/satu-data-kota-malang-klhk.png"],
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
    screenshots: ["/screenshots/podes-kota-malang.png"],
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
    tags: ["Laravel", "MySQL", "Bootstrap", "Chart.js", "Google Maps API"],
    year: "2023",
    screenshots: ["/screenshots/pendataan-kesejahteraan-sosial.png"],
  },
  {
    id: "04",
    title: "SITANGKAS",
    description:
      "Pendamping SIPD untuk pencairan anggaran pemerintah kota. Mendukung proses pencairan dengan Tanda Tangan Elektronik (TTE) dan sistem paperless end-to-end.",
    highlights: [
      "Integrasi Tanda Tangan Elektronik (TTE)",
      "Sistem paperless untuk pencairan anggaran",
      "Didukung data resmi SIPD Kemendagri",
    ],
    tags: ["Laravel", "MySQL", "Bootstrap", "Chart.js", "DataTables"],
    year: "2023",
    screenshots: ["/screenshots/sitangkas.png"],
  },
];

export const MINI_PROJECTS = [
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

export const SKILLS = [
  { group: "Backend", items: ["Laravel", "PHP", "REST API", "Node.js"] },
  { group: "Frontend", items: ["HTML", "CSS", "JavaScript", "Bootstrap", "Flutter", "React", "Tailwind CSS"] },
  { group: "Database", items: ["MySQL", "MariaDB", "PostgreSQL", "SQL Server"] },
  { group: "Tools", items: ["Git", "Linux Server", "Nginx", "Apache", "Postman", "Termius"] },
];

export const CERTIFICATIONS = [
  { name: "HackerRank - SQL (Advanced)", year: "2025", certificate: "/certificates/hackerrank-sql.png" },
  { name: "Dicoding - Dasar Manajemen Proyek", year: "2024", certificate: "/certificates/dicoding-manajemen-proyek.png" },
  { name: "Mitra Berdaya Optima - Training Awareness ISO/IEC 27001:2022 Information Security Management System", year: "2023", certificate: "/certificates/iso-iec-27001.png" },
  { name: "Dicoding - Dasar Pemrograman Web", year: "2020", certificate: "/certificates/dicoding-pemrograman-web.png" },
  { name: "Cisco - Introduction to Networks", year: "2020", certificate: "/certificates/cisco-networks.png" },
  { name: "Digital Talent Scholarship - Big Data Analytics", year: "2019", certificate: "/certificates/digital-talent-big-data.png" },
];

export type MainProject = (typeof MAIN_PROJECTS)[number];
export type MiniProject = (typeof MINI_PROJECTS)[number];
export type Certification = (typeof CERTIFICATIONS)[number];
