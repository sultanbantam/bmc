const blocks = [
  { key: "customerSegments", title: "Customer Segments" },
  { key: "valuePropositions", title: "Value Propositions" },
  { key: "channels", title: "Channels" },
  { key: "customerRelationships", title: "Customer Relationships" },
  { key: "revenueStreams", title: "Revenue Streams" },
  { key: "keyActivities", title: "Key Activities" },
  { key: "keyResources", title: "Key Resources" },
  { key: "keyPartnerships", title: "Key Partnerships" },
  { key: "costStructure", title: "Cost Structure" }
];

const blockSynonyms = {
  customerSegments: ["customer", "pelanggan", "segmen", "target", "pasar", "user"],
  valuePropositions: ["value", "nilai", "proposisi", "solusi", "masalah", "pain"],
  channels: ["channel", "kanal", "saluran", "marketing", "distribusi", "akuisisi"],
  customerRelationships: ["relationship", "relasi", "loyal", "retensi", "komunitas", "crm"],
  revenueStreams: ["revenue", "pendapatan", "harga", "pricing", "uang", "bayar", "monetisasi"],
  keyActivities: ["aktivitas", "activity", "operasi", "produksi", "proses"],
  keyResources: ["resource", "sumber daya", "aset", "tim", "teknologi"],
  keyPartnerships: ["partner", "mitra", "partnership", "vendor", "supplier"],
  costStructure: ["cost", "biaya", "modal", "pengeluaran", "budget"]
};

const sectors = [
  {
    name: "tourism",
    label: "eko wisata/desa wisata",
    match: ["wisata", "eko wisata", "ekowisata", "desa wisata", "travel", "tour", "homestay", "alam", "budaya", "kasepuhan", "cibarani", "lebak", "baduy"],
    customer: [
      "wisatawan keluarga dan komunitas dari kota besar yang mencari pengalaman alam-budaya 1-2 hari",
      "sekolah, kampus, dan komunitas pecinta alam yang butuh paket edukasi konservasi dan budaya",
      "perusahaan atau instansi untuk outing, CSR, dan team building berbasis desa",
      "traveler niche yang tertarik budaya lokal, pertanian, dan pariwisata berkelanjutan"
    ],
    value: [
      "pengalaman eko wisata berbasis kearifan lokal: alam, pertanian, tradisi, kuliner, dan cerita warga",
      "paket siap jalan dengan itinerary, guide lokal, aturan kunjungan, keamanan, dan estimasi biaya jelas",
      "dampak ekonomi langsung untuk warga melalui guide, homestay, kuliner, kerajinan, dan konservasi",
      "konten edukatif yang membantu pengunjung memahami etika berkunjung dan pelestarian lingkungan"
    ],
    channel: [
      "Instagram, TikTok, dan Google Business Profile dengan foto rute, aktivitas, harga paket, dan testimoni",
      "kemitraan komunitas hiking, kampus, sekolah, travel organizer, dan kantor di kota sekitar",
      "landing page sederhana dengan WhatsApp booking, kalender trip, dan FAQ akses lokasi",
      "artikel SEO seperti paket eko wisata Lebak, wisata budaya Banten, dan itinerary desa wisata"
    ],
    revenue: [
      "paket one-day trip per orang termasuk guide, makan lokal, dan aktivitas utama",
      "paket overnight dengan homestay, makan, guide, dan aktivitas budaya/alam",
      "paket edukasi sekolah/kampus dan corporate outing dengan harga grup",
      "komisi penjualan produk lokal, kuliner, dokumentasi foto/video, dan transport tambahan"
    ],
    activity: [
      "mapping aset wisata, rute aman, aturan adat, kapasitas kunjungan, dan SOP keselamatan",
      "melatih guide lokal untuk storytelling, hospitality, first aid dasar, dan manajemen rombongan",
      "membuat itinerary, harga paket, kalender trip, materi promosi, dan sistem booking WhatsApp",
      "mengumpulkan feedback, testimoni, foto, dan data biaya per trip untuk memperbaiki paket"
    ],
    resource: [
      "guide lokal, tokoh adat/warga, rute alam, cerita budaya, homestay, dan titik aktivitas",
      "SOP kunjungan, aturan adat, standar keselamatan, daftar harga, dan template itinerary",
      "aset konten foto/video, landing page, WhatsApp Business, Google Maps, dan database calon tamu",
      "modal kerja untuk pelatihan, perlengkapan keselamatan, signage, kebersihan, dan promosi awal"
    ],
    partner: [
      "pemerintah desa, tokoh adat, kelompok sadar wisata, karang taruna, dan pemilik homestay",
      "komunitas traveler, sekolah/kampus, kantor, travel organizer, dan creator lokal",
      "penyedia transport, asuransi/perlengkapan outdoor, UMKM kuliner, dan pengrajin lokal",
      "dinas pariwisata, NGO konservasi, inkubator UMKM, dan media lokal"
    ],
    cost: [
      "honor guide, konsumsi, homestay, transport lokal, kebersihan, dan kontribusi warga/adat per trip",
      "biaya promosi konten, iklan kecil, website/landing page, foto/video, dan admin booking",
      "pelatihan guide, perlengkapan keselamatan, signage rute, dokumentasi SOP, dan perizinan",
      "cadangan risiko cuaca, refund, perawatan fasilitas, dan peningkatan kualitas pengalaman"
    ]
  },
  {
    name: "fnb",
    label: "F&B",
    match: ["kopi", "cafe", "kafe", "restoran", "makanan", "minuman", "f&b", "kuliner", "menu"],
    customer: ["pekerja urban yang butuh pilihan praktis", "komunitas lokal di radius 3-5 km", "pelanggan repeat yang mencari kualitas konsisten"],
    value: ["rasa dan kualitas yang stabil", "pengalaman beli yang cepat dan nyaman", "menu yang mudah disesuaikan dengan preferensi pelanggan"],
    channel: ["Google Maps dan review lokal", "Instagram/TikTok untuk menu visual", "kemitraan delivery dan komunitas kantor"],
    revenue: ["penjualan produk satuan", "paket langganan mingguan", "bundle corporate atau event kecil"],
    activity: ["pengadaan bahan baku", "standardisasi resep dan SOP", "kampanye konten menu harian"],
    resource: ["dapur atau bar produksi", "supplier bahan baku", "brand visual dan sistem pemesanan"],
    partner: ["supplier lokal", "platform delivery", "komunitas kantor atau coworking"],
    cost: ["bahan baku", "sewa dan utilitas", "tenaga kerja dan packaging"]
  },
  {
    name: "education",
    label: "edtech",
    match: ["kursus", "belajar", "edukasi", "sekolah", "kelas", "pelatihan", "training", "mentor"],
    customer: ["pemula yang ingin skill praktis", "pemilik UMKM yang butuh hasil cepat", "komunitas profesional yang ingin naik kelas"],
    value: ["materi ringkas dan langsung dipraktikkan", "mentor atau AI tutor untuk feedback", "template kerja yang mempercepat implementasi"],
    channel: ["webinar gratis", "LinkedIn dan komunitas WhatsApp", "referral alumni"],
    revenue: ["kelas satuan", "langganan konten premium", "program cohort berbayar"],
    activity: ["kurasi kurikulum", "produksi materi", "mentoring dan evaluasi progres"],
    resource: ["expert/mentor", "platform pembelajaran", "library template dan contoh kasus"],
    partner: ["komunitas UMKM", "kampus atau inkubator", "tools SaaS pendukung"],
    cost: ["honor mentor", "produksi konten", "platform dan akuisisi peserta"]
  },
  {
    name: "agri",
    label: "agritech",
    match: ["pertanian", "petani", "sayur", "buah", "panen", "agribisnis", "agritech", "beras"],
    customer: ["petani kecil dan koperasi", "restoran dan katering", "pembeli rumah tangga yang peduli asal produk"],
    value: ["akses pasar yang lebih jelas", "pasokan lebih segar dan terlacak", "harga lebih transparan untuk kedua sisi"],
    channel: ["kemitraan koperasi", "sales B2B ke restoran", "marketplace dan grup komunitas lokal"],
    revenue: ["margin transaksi", "biaya langganan pembeli B2B", "layanan logistik atau quality control"],
    activity: ["verifikasi pasokan", "manajemen order dan pengiriman", "quality control panen"],
    resource: ["jaringan petani", "data inventori panen", "operasi logistik"],
    partner: ["koperasi tani", "cold chain/logistik", "restoran anchor customer"],
    cost: ["logistik", "quality control", "operasional lapangan dan teknologi"]
  },
  {
    name: "tech",
    label: "digital/SaaS",
    match: ["aplikasi", "platform", "saas", "ai", "software", "marketplace", "digital", "otomatis"],
    customer: ["pengguna early adopter", "tim kecil yang butuh otomasi", "pemilik bisnis yang ingin efisiensi"],
    value: ["otomasi pekerjaan manual", "insight yang lebih cepat dari data", "workflow yang mudah diulang dan diukur"],
    channel: ["landing page SEO", "konten edukasi dan demo", "partnership komunitas dan referral"],
    revenue: ["langganan bulanan", "paket output satu kali", "layanan premium atau konsultasi"],
    activity: ["pengembangan produk", "customer support", "eksperimen akuisisi dan onboarding"],
    resource: ["tim produk dan engineering", "model AI/API", "database pengguna dan knowledge base"],
    partner: ["provider AI", "payment gateway", "komunitas bisnis atau inkubator"],
    cost: ["hosting dan API", "pengembangan produk", "marketing dan support"]
  }
];

const generalSector = {
  name: "general",
  label: "early-stage business",
  customer: ["early adopter dengan masalah yang jelas", "segmen niche yang mudah dijangkau", "pelanggan yang sudah mencari alternatif solusi"],
  value: ["solusi yang lebih cepat atau lebih sederhana", "pengalaman pelanggan yang mudah dipahami", "hasil yang bisa diukur dalam waktu singkat"],
  channel: ["landing page dan SEO", "komunitas niche", "konten edukasi dan referral"],
  revenue: ["penjualan produk/layanan inti", "paket langganan atau retainer", "upsell konsultasi atau add-on"],
  activity: ["validasi masalah", "pengembangan penawaran", "akuisisi dan onboarding pelanggan"],
  resource: ["tim inti", "data pelanggan", "brand dan sistem operasional"],
  partner: ["komunitas target", "vendor operasional", "partner distribusi"],
  cost: ["pengembangan produk", "operasional", "marketing dan support"]
};

function detectSector(idea = "") {
  const lower = idea.toLowerCase();
  return sectors.find((sector) => sector.match.some((keyword) => lower.includes(keyword))) || generalSector;
}

function summarizeIdea(idea = "") {
  const cleaned = idea.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 54) return cleaned || "Business Model Canvas";
  return `${cleaned.slice(0, 51).trim()}...`;
}

function generateLocalBmc(idea) {
  const cleanIdea = String(idea || "").trim();
  if (!cleanIdea) {
    const error = new Error("Ide bisnis wajib diisi.");
    error.status = 400;
    throw error;
  }

  const sector = detectSector(cleanIdea);
  const context = extractContext(cleanIdea, sector);
  const bmc = sector.name === "tourism" ? tourismBmc(context, sector) : genericBmc(context, sector);
  const risks = buildRisks(context, sector);

  return {
    title: summarizeIdea(cleanIdea),
    idea: cleanIdea,
    sector: sector.label,
    source: "local",
    bmc,
    risks,
    actionPlan: buildActionPlan(sector, context),
    nextQuestions: [
      "Segmen mana yang paling mudah saya validasi minggu ini?",
      "Paket harga apa yang masuk akal untuk pilot pertama?",
      "Asumsi apa yang harus diuji sebelum keluar modal besar?"
    ]
  };
}

function genericBmc(context, sector) {
  return {
    customerSegments: [
      ...sector.customer,
      `Segmen awal yang paling mudah diuji: ${context.target}.`
    ].slice(0, 5),
    valuePropositions: [
      ...sector.value,
      `Janji utama: membantu pelanggan menyelesaikan "${context.problem}" dengan cara yang lebih praktis.`
    ].slice(0, 5),
    channels: [
      ...sector.channel,
      "Landing page dengan CTA jelas untuk mengumpulkan leads dan mengukur minat."
    ].slice(0, 5),
    customerRelationships: [
      "Onboarding singkat yang menanyakan kebutuhan, budget, dan konteks pelanggan.",
      "Follow-up otomatis setelah pengguna mencoba produk atau menerima output awal.",
      "Komunitas atau newsletter untuk edukasi, studi kasus, dan retensi.",
      "Jalur konsultasi premium untuk pelanggan bernilai tinggi."
    ],
    revenueStreams: [
      ...sector.revenue,
      "Eksperimen harga awal dengan paket entry, pro, dan premium."
    ].slice(0, 5),
    keyActivities: [
      ...sector.activity,
      "Mengukur conversion, activation, dan repeat usage setiap minggu."
    ].slice(0, 5),
    keyResources: [
      ...sector.resource,
      "Template, SOP, dan data pembelajaran dari pelanggan awal."
    ].slice(0, 5),
    keyPartnerships: [
      ...sector.partner,
      "Partner akuisisi yang sudah dipercaya oleh target pelanggan."
    ].slice(0, 5),
    costStructure: [
      ...sector.cost,
      "Biaya eksperimen validasi seperti landing page, sample produk, dan campaign kecil."
    ].slice(0, 5)
  };
}

function tourismBmc(context, sector) {
  return {
    customerSegments: [
      `Wisatawan dari ${context.primaryMarkets} yang ingin pengalaman ${context.product} di ${context.location} tanpa repot menyusun itinerary sendiri.`,
      ...sector.customer
    ].slice(0, 5),
    valuePropositions: [
      `Paket ${context.product} ${context.location} yang menggabungkan alam, budaya lokal, kuliner, cerita warga, dan aktivitas edukatif.`,
      ...sector.value
    ].slice(0, 5),
    channels: [
      "WhatsApp Business untuk booking, katalog paket, FAQ akses lokasi, dan follow-up calon tamu.",
      ...sector.channel
    ].slice(0, 5),
    customerRelationships: [
      "Sebelum trip: konsultasi via WhatsApp untuk jumlah peserta, usia, transport, minat aktivitas, dan batasan fisik.",
      "Saat trip: guide lokal menjadi host, storyteller, penjaga etika kunjungan, dan koordinator keamanan rombongan.",
      "Sesudah trip: kirim dokumentasi, minta review Google/Instagram, dan tawarkan referral atau paket berikutnya.",
      "Untuk sekolah/kantor: proposal singkat, invoice, rundown, surat izin bila perlu, dan laporan dampak sederhana.",
      "Komunitas alumni trip untuk update kalender panen, event budaya, dan open trip berikutnya."
    ],
    revenueStreams: [
      ...sector.revenue,
      "DP/pre-booking untuk membuktikan demand sebelum menyiapkan guide, konsumsi, homestay, dan transport."
    ].slice(0, 5),
    keyActivities: [
      ...sector.activity,
      "Pilot trip 10-15 peserta untuk menguji itinerary, harga, SOP, biaya aktual, dan kualitas pengalaman."
    ].slice(0, 5),
    keyResources: [
      ...sector.resource,
      "Data HPP per peserta, margin per paket, minimum peserta per trip, dan daftar calon partner komunitas."
    ].slice(0, 5),
    keyPartnerships: [
      ...sector.partner,
      "Kesepakatan sederhana tentang peran, pembagian manfaat, kapasitas kunjungan, dan aktivitas yang tidak boleh dilakukan."
    ].slice(0, 5),
    costStructure: [
      ...sector.cost,
      "Pisahkan biaya variabel per peserta dan biaya tetap agar tahu minimum peserta untuk tidak rugi."
    ].slice(0, 5)
  };
}

function extractContext(idea, sector) {
  const lower = idea.toLowerCase();
  const location = detectLocation(idea);
  const product = lower.includes("eko") || lower.includes("ekowisata")
    ? "eko wisata"
    : lower.includes("wisata")
      ? "wisata"
      : sector.label || "bisnis";
  const primaryMarkets = sector.name === "tourism" && /cibarani|lebak|banten|kasepuhan/i.test(idea)
    ? "Jakarta, Tangerang, Serang, Bogor, Bandung, dan komunitas traveler Banten"
    : "kota sekitar lokasi dan komunitas niche yang relevan";

  const target = sector.name === "tourism"
    ? `calon pengunjung yang ingin ${product} autentik di ${location}`
    : lower.includes("umkm")
      ? "pemilik UMKM yang ingin hasil praktis"
      : lower.includes("jakarta")
        ? "pelanggan urban di Jakarta"
        : lower.includes("petani")
          ? "petani dan pembeli hasil panen"
          : "kelompok pelanggan awal yang paling sering merasakan masalah ini";

  const problem = sector.name === "tourism"
    ? "sulit menemukan paket wisata yang jelas, aman, autentik, menghormati warga/adat, dan mudah dipesan"
    : lower.includes("tanpa")
      ? idea.split(/tanpa/i)[1]?.slice(0, 80).trim() || "mengurangi hambatan utama"
      : lower.includes("ingin")
        ? idea.split(/ingin/i)[1]?.slice(0, 80).trim() || "mencapai hasil yang diinginkan"
        : "memulai solusi dengan risiko dan biaya yang lebih kecil";

  return { idea, location, product, primaryMarkets, target, problem };
}

function detectLocation(idea) {
  const lower = idea.toLowerCase();
  if (lower.includes("cibarani") && lower.includes("lebak")) return "Kasepuhan Cibarani, Lebak";
  if (lower.includes("cibarani")) return "Kasepuhan Cibarani";
  if (lower.includes("lebak")) return "Lebak, Banten";
  if (lower.includes("kasepuhan")) return "kawasan Kasepuhan";
  const match = idea.match(/\bdi\s+([A-Za-z\s]{3,70})/i);
  if (!match) return "lokasi usaha";
  return titleCase(match[1].replace(/[.,;:!?].*$/, "").split(/\s+/).slice(0, 5).join(" "));
}

function titleCase(value) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function buildRisks(context, sector) {
  if (sector.name === "tourism") {
    return [
      {
        title: "Izin sosial, aturan adat, dan kapasitas lokasi belum jelas",
        why: `Bisnis wisata di ${context.location} hanya sehat jika warga, tokoh adat, dan pengelola lokal merasa dilibatkan dan manfaatnya adil.`,
        test: "Adakan diskusi kecil dengan tokoh adat/desa, calon guide, pemilik homestay, dan warga terdampak. Sepakati aturan kunjungan, kapasitas, pembagian manfaat, dan aktivitas yang tidak boleh dilakukan.",
        metric: "Ada persetujuan peran, batas kapasitas, dan pembagian manfaat sebelum pilot trip."
      },
      {
        title: "Wisatawan mau membayar paket, bukan hanya datang sendiri",
        why: "Eko wisata perlu membuktikan bahwa itinerary, guide lokal, keamanan, cerita budaya, dan kemudahan booking cukup bernilai untuk dibayar.",
        test: "Buat 2 paket dan buka pre-booking ke 30 calon peserta/komunitas. Target awal: minimal 10 orang bersedia bayar DP untuk pilot trip.",
        metric: "Minimal 10 calon peserta membayar DP atau memberi komitmen tanggal."
      },
      {
        title: "Kualitas pengalaman belum konsisten dari trip ke trip",
        why: "Review buruk bisa muncul dari akses sulit, cuaca, guide belum siap, homestay kurang bersih, atau ekspektasi pengunjung tidak sesuai.",
        test: "Jalankan pilot trip 10-15 orang dengan checklist SOP, form feedback, data biaya aktual, dan review terbuka. Perbaiki paket sebelum promosi besar.",
        metric: "Rating pilot minimal 4/5 dan margin per peserta tetap positif."
      }
    ];
  }

  return [
    {
      title: "Segmen awal benar-benar merasakan masalah ini",
      why: `BMC terlihat kuat hanya jika ${context.target} punya pain yang sering, mahal, atau mendesak.`,
      test: "Wawancarai 15 calon pelanggan dan minta mereka menceritakan solusi yang saat ini dipakai, bukan sekadar opini.",
      metric: "Minimal 8 dari 15 calon pelanggan punya masalah aktif dan pernah mencoba solusi."
    },
    {
      title: "Value proposition cukup berbeda dari alternatif",
      why: `Di kategori ${sector.label}, pelanggan biasanya punya opsi gratis, manual, atau kompetitor yang sudah dikenal.`,
      test: "Buat landing page dengan tiga variasi pesan nilai, lalu ukur klik CTA dan signup per pesan.",
      metric: "Satu pesan nilai menghasilkan conversion CTA minimal 8-12 persen dari traffic dingin."
    },
    {
      title: "Unit economics masuk akal sejak transaksi awal",
      why: "Revenue harus bisa menutup biaya akuisisi, produksi, support, dan eksperimen pertumbuhan.",
      test: "Hitung margin per paket dan jalankan pre-order kecil sebelum membangun fitur atau operasi penuh.",
      metric: "Margin kontribusi positif setelah biaya variabel utama dihitung."
    }
  ];
}

function answerLocalChat({ idea = "", bmc = {}, risks = [], question = "" }) {
  const sector = detectSector(idea);
  const context = extractContext(idea || "bisnis tahap awal", sector);
  const lower = question.toLowerCase();
  const riskList = risks.length ? risks : buildRisks(context, sector);

  if (lower.includes("langkah") || lower.includes("action") || lower.includes("30 hari") || lower.includes("jalankan") || lower.includes("mulai")) {
    return buildActionPlan(sector, context);
  }

  if (lower.includes("risiko") || lower.includes("risky") || lower.includes("asumsi")) {
    return `Tiga asumsi paling penting untuk diuji:\n\n1. ${riskList[0].title}\nCara uji: ${riskList[0].test}\n\n2. ${riskList[1].title}\nCara uji: ${riskList[1].test}\n\n3. ${riskList[2].title}\nCara uji: ${riskList[2].test}`;
  }

  if (lower.includes("harga") || lower.includes("pricing") || lower.includes("tarif")) {
    if (sector.name === "tourism") {
      return "Untuk eko wisata, mulai dari HPP per peserta: guide, makan, homestay, transport lokal, kontribusi warga/adat, dokumentasi, kebersihan, dan cadangan risiko. Buat 3 paket awal: one-day, overnight, dan grup sekolah/kantor. Gunakan DP untuk pilot trip agar demand terbukti sebelum operasional disiapkan.";
    }
    return "Mulai dengan tiga level harga: entry untuk validasi cepat, pro untuk pengguna rutin, dan premium untuk bantuan intensif. Ukur willingness to pay dengan pre-order, bukan survei opini saja.";
  }

  const block = blocks.find((item) => blockSynonyms[item.key].some((word) => lower.includes(word)) || lower.includes(item.title.toLowerCase()));
  if (block) {
    const generated = Object.keys(bmc || {}).length ? bmc : generateLocalBmc(idea || context.idea).bmc;
    const points = generated[block.key] || [];
    return `Untuk ${block.title}, arah saat ini:\n\n${points.map((point, index) => `${index + 1}. ${point}`).join("\n")}\n\nSaran eksekusi: ${blockActionAdvice(block.key, sector, context)}`;
  }

  return buildActionPlan(sector, context);
}

function buildActionPlan(sector, context) {
  if (sector.name === "tourism") {
    return `Rencana 30 hari untuk membuat ${context.product} di ${context.location} lebih siap dijalankan:\n\nMinggu 1 - Validasi lokal\n1. Temui tokoh adat/desa, calon guide, pemilik homestay, dan UMKM lokal.\n2. Catat aset wisata, larangan, kapasitas kunjungan, rute aman, dan siapa mendapat manfaat.\n3. Pilih 1 paket pilot yang paling aman dijalankan.\n\nMinggu 2 - Bentuk produk\n1. Buat paket one-day dan overnight lengkap dengan rundown, harga, HPP, margin, dan checklist risiko.\n2. Siapkan WhatsApp Business, Google Form booking, katalog sederhana, dan 10 foto/video asli.\n3. Buat script briefing etika kunjungan dan SOP cuaca buruk.\n\nMinggu 3 - Cari pembeli awal\n1. Hubungi 30 target: komunitas traveler, kampus, sekolah, kantor, dan creator lokal.\n2. Tawarkan pilot trip terbatas 10-15 orang dengan DP.\n3. Ukur jumlah chat masuk, DP, alasan menolak, dan pertanyaan paling sering.\n\nMinggu 4 - Pilot dan perbaikan\n1. Jalankan trip kecil, rekam biaya aktual dan masalah operasional.\n2. Minta review Google/Instagram dan testimoni video pendek.\n3. Revisi harga, itinerary, SOP, dan kapasitas sebelum promosi lebih besar.\n\nMetrik utama: DP terkumpul, margin per peserta, rating pengalaman, repeat/referral intent, dan jumlah warga/UMKM yang mendapat manfaat.`;
  }

  return "Rencana 30 hari: minggu 1 wawancara 15 calon pelanggan, minggu 2 buat landing page dan penawaran, minggu 3 jalankan pre-order/pilot kecil, minggu 4 evaluasi conversion, margin, dan feedback lalu tentukan apakah lanjut, ubah segmen, atau ubah value proposition.";
}

function blockActionAdvice(blockKey, sector, context) {
  if (sector.name !== "tourism") {
    return "Tentukan satu keputusan praktis dari blok ini, lalu validasi dalam 7 hari lewat interview, landing page, pre-order, pilot kecil, atau data biaya nyata.";
  }

  const advice = {
    customerSegments: "Mulai dari satu segmen paling mudah dijangkau, misalnya komunitas traveler Jabodetabek atau kampus sekitar Banten. Buat daftar 30 calon pembeli dan hubungi langsung.",
    valuePropositions: `Ubah value menjadi paket konkret: itinerary, durasi, harga, include/exclude, dampak untuk warga, aturan adat, dan alasan kenapa pengalaman ${context.location} berbeda dari wisata biasa.`,
    channels: "Prioritaskan WhatsApp booking, Instagram/TikTok short video, Google Maps, dan partner komunitas. Konten pertama harus menjawab akses lokasi, harga, aktivitas, keamanan, dan etika kunjungan.",
    customerRelationships: "Bangun trust lewat respons WhatsApp cepat, briefing sebelum trip, guide yang ramah, dokumentasi setelah trip, dan follow-up review/referral 24 jam setelah pulang.",
    revenueStreams: "Hitung HPP per peserta dulu. Buat paket one-day, overnight, dan grup. Targetkan DP agar demand terbukti sebelum tim menyiapkan konsumsi, guide, dan homestay.",
    keyActivities: "Aktivitas terpenting bukan promosi besar dulu, tapi validasi izin sosial, SOP keamanan, desain paket, pilot trip, lalu baru konten dan partnership.",
    keyResources: "Aset paling penting adalah kepercayaan warga, guide lokal, cerita budaya, SOP, dan konten asli. Tanpa ini, eko wisata mudah terasa seperti trip biasa.",
    keyPartnerships: "Buat kesepakatan tertulis sederhana dengan tokoh lokal, guide, homestay, UMKM, transport, dan partner komunitas agar peran serta pembagian manfaat jelas.",
    costStructure: "Pisahkan biaya variabel per peserta dan biaya tetap. Ini membantu menentukan minimum peserta per trip dan mencegah paket ramai tetapi rugi."
  };
  return advice[blockKey] || advice.keyActivities;
}

module.exports = {
  blocks,
  generateLocalBmc,
  answerLocalChat
};
