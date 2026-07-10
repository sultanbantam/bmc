const cloneData = (value) => {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
};

const blocks = [
  { key: "customerSegments", title: "Customer Segments", tone: "teal" },
  { key: "valuePropositions", title: "Value Propositions", tone: "coral" },
  { key: "channels", title: "Channels", tone: "amber" },
  { key: "customerRelationships", title: "Customer Relationships", tone: "green" },
  { key: "revenueStreams", title: "Revenue Streams", tone: "blue" },
  { key: "keyActivities", title: "Key Activities", tone: "teal" },
  { key: "keyResources", title: "Key Resources", tone: "coral" },
  { key: "keyPartnerships", title: "Key Partnerships", tone: "amber" },
  { key: "costStructure", title: "Cost Structure", tone: "green" }
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

const sectorRules = [
  {
    name: "tourism",
    match: ["wisata", "eko wisata", "ekowisata", "desa wisata", "travel", "tour", "homestay", "alam", "budaya", "kasepuhan", "cibarani", "lebak", "baduy"],
    label: "eko wisata/desa wisata",
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
    match: ["kopi", "cafe", "kafe", "restoran", "makanan", "minuman", "f&b", "kuliner", "menu"],
    label: "F&B",
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
    match: ["kursus", "belajar", "edukasi", "sekolah", "kelas", "pelatihan", "training", "mentor"],
    label: "edtech",
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
    match: ["pertanian", "petani", "sayur", "buah", "panen", "agribisnis", "agritech", "beras"],
    label: "agritech",
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
    name: "health",
    match: ["sehat", "kesehatan", "klinik", "dokter", "wellness", "nutrisi", "mental"],
    label: "health/wellness",
    customer: ["profesional sibuk yang ingin hidup lebih sehat", "keluarga muda", "komunitas dengan kebutuhan kesehatan spesifik"],
    value: ["rekomendasi personal yang mudah dijalankan", "akses layanan lebih praktis", "monitoring progres yang membuat pengguna konsisten"],
    channel: ["konten edukasi", "kemitraan klinik/komunitas", "referral pengguna"],
    revenue: ["langganan program", "paket konsultasi", "komisi produk atau layanan pendukung"],
    activity: ["assessment pengguna", "kurasi rekomendasi", "follow-up berkala"],
    resource: ["tenaga ahli", "data kesehatan pengguna", "sistem booking dan reminder"],
    partner: ["dokter/nutrisionis", "klinik", "brand produk kesehatan"],
    cost: ["honor profesional", "compliance dan keamanan data", "akuisisi pengguna"]
  },
  {
    name: "tech",
    match: ["aplikasi", "platform", "saas", "ai", "software", "marketplace", "digital", "otomatis"],
    label: "digital/SaaS",
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

const defaultBmc = {
  customerSegments: [
    "Aspiring entrepreneur dan pemilik bisnis tahap awal yang punya ide tetapi belum punya struktur model bisnis.",
    "UMKM yang ingin menyusun strategi sebelum meluncurkan produk baru.",
    "Mentor, inkubator, dan konsultan yang perlu mempercepat sesi validasi bisnis."
  ],
  valuePropositions: [
    "Mengubah ide mentah menjadi Business Model Canvas lengkap dalam beberapa menit.",
    "Memberi poin spesifik dan actionable untuk setiap blok BMC.",
    "Menandai asumsi paling berisiko dan menyarankan eksperimen validasi."
  ],
  channels: [
    "Landing page dengan chatbot sebagai pengalaman utama.",
    "Konten edukasi BMC di Instagram, LinkedIn, X, TikTok, dan Facebook.",
    "Referral dari komunitas startup, UMKM, kampus, dan inkubator."
  ],
  customerRelationships: [
    "Self-service AI chat untuk eksplorasi awal.",
    "Guided refinement per blok BMC agar pengguna merasa didampingi.",
    "Konsultasi premium untuk pengguna yang butuh review mendalam."
  ],
  revenueStreams: [
    "Langganan Rp50.000/bulan untuk BMC generation dan basic AI chat.",
    "Pembelian output BMC satu kali Rp30.000 di Indonesia atau $5-10 global.",
    "Konsultasi premium Rp500.000-1.000.000/jam."
  ],
  keyActivities: [
    "Mengelola prompt, knowledge base, dan evaluasi kualitas output BMC.",
    "Mengembangkan chatbot, export, upload dokumen, dan voice input.",
    "Membuat dan menjadwalkan konten sosial media untuk akuisisi."
  ],
  keyResources: [
    "Model AI dan pipeline RAG berisi referensi BMC terkurasi.",
    "Database pengguna, subscription, dan BMC tersimpan.",
    "Tim produk, founder/mentor, dan sistem analitik pertumbuhan."
  ],
  keyPartnerships: [
    "OpenAI/Claude API dan vector database seperti pgvector atau Pinecone.",
    "Supabase, Midtrans/Stripe, dan Vercel untuk infrastruktur produk.",
    "Komunitas UMKM, inkubator, kampus, dan MCP social publishing provider."
  ],
  costStructure: [
    "Biaya LLM/API, hosting, storage, dan vector database.",
    "Akuisisi pelanggan melalui konten, iklan, dan partnership.",
    "Operasional support, riset knowledge base, dan konsultasi expert."
  ]
};

const defaultRisks = [
  {
    title: "Pengguna mau membayar untuk BMC otomatis",
    why: "Harga Rp50.000/bulan harus terbukti lebih bernilai dibanding template gratis atau konsultasi manual.",
    test: "Jalankan landing page waitlist dengan dua paket harga dan ukur conversion dari 200 visitor pertama."
  },
  {
    title: "Output AI cukup dipercaya untuk keputusan bisnis",
    why: "Jika isi terlalu generik, pengguna tidak akan repeat atau merekomendasikan produk.",
    test: "Bandingkan rating output AI vs review mentor untuk 20 ide bisnis nyata."
  },
  {
    title: "Konten sosial membawa traffic yang relevan",
    why: "Social agent harus menghasilkan followers yang memang ingin membuat BMC, bukan sekadar engagement vanity.",
    test: "Publikasikan 30 post edukasi BMC dan ukur klik, signup, serta BMC generated per kanal."
  }
];

const topics = [
  "Cara membuat BMC untuk bisnis F&B",
  "9 blok BMC yang wajib dipahami",
  "Kesalahan umum saat bikin BMC",
  "Contoh BMC bisnis kafe sukses",
  "Revenue streams yang cocok untuk UMKM",
  "Dari ide ke BMC dalam 5 menit"
];

const platforms = ["Instagram", "LinkedIn", "X", "TikTok", "Facebook"];

const state = {
  bmc: cloneData(defaultBmc),
  risks: cloneData(defaultRisks),
  idea: "",
  selectedPlatforms: new Set(["Instagram", "LinkedIn", "X"]),
  selectedTopic: topics[0]
};

const els = {
  heroForm: document.querySelector("#hero-form"),
  heroIdea: document.querySelector("#hero-idea"),
  ideaInput: document.querySelector("#idea-input"),
  generateBtn: document.querySelector("#generate-btn"),
  voiceBtn: document.querySelector("#voice-btn"),
  fileInput: document.querySelector("#file-input"),
  saveStatus: document.querySelector("#save-status"),
  grid: document.querySelector("#bmc-grid"),
  riskList: document.querySelector("#risk-list"),
  chatLog: document.querySelector("#chat-log"),
  chatForm: document.querySelector("#chat-form"),
  chatInput: document.querySelector("#chat-input"),
  canvasTitle: document.querySelector("#canvas-title"),
  blockTemplate: document.querySelector("#block-template"),
  topicRow: document.querySelector("#topic-row"),
  platformRow: document.querySelector("#platform-row"),
  topicInput: document.querySelector("#topic-input"),
  postBoard: document.querySelector("#post-board"),
  generatePosts: document.querySelector("#generate-posts")
};

function init() {
  restoreState();
  renderCanvas();
  renderRisks();
  renderChatIntro();
  renderSocialControls();
  renderPosts(generatePosts());
  bindEvents();
  setStatus("Siap");
}

function bindEvents() {
  els.heroForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const idea = els.heroIdea.value.trim();
    if (idea) {
      els.ideaInput.value = idea;
      generateBmcFromInput();
      document.querySelector("#workspace").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  els.generateBtn.addEventListener("click", generateBmcFromInput);

  document.querySelectorAll(".prompt-chip").forEach((button) => {
    button.addEventListener("click", () => {
      els.ideaInput.value = button.dataset.idea;
      generateBmcFromInput();
    });
  });

  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  els.chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = els.chatInput.value.trim();
    if (!question) return;
    addMessage("user", question);
    addMessage("ai", answerQuestion(question));
    els.chatInput.value = "";
    switchTab("chat");
  });

  els.voiceBtn.addEventListener("click", startVoiceInput);
  els.fileInput.addEventListener("change", handleFile);
  document.querySelector("#export-md").addEventListener("click", () => downloadFile("bmc-output.md", toMarkdown(), "text/markdown"));
  document.querySelector("#export-html").addEventListener("click", () => downloadFile("bmc-output.html", toStandaloneHtml(), "text/html"));
  document.querySelector("#print-pdf").addEventListener("click", () => window.print());
  els.generatePosts.addEventListener("click", () => renderPosts(generatePosts()));
  els.topicInput.addEventListener("input", () => {
    state.selectedTopic = els.topicInput.value.trim() || topics[0];
  });
}

function restoreState() {
  try {
    const saved = JSON.parse(localStorage.getItem("bmc-ai-platform") || "null");
    if (!saved) return;
    state.bmc = saved.bmc || state.bmc;
    state.risks = saved.risks || state.risks;
    state.idea = saved.idea || "";
    els.ideaInput.value = state.idea;
  } catch {
    localStorage.removeItem("bmc-ai-platform");
  }
}

function persistState() {
  localStorage.setItem(
    "bmc-ai-platform",
    JSON.stringify({
      bmc: state.bmc,
      risks: state.risks,
      idea: state.idea
    })
  );
  setStatus("Tersimpan");
}

function setStatus(text) {
  els.saveStatus.textContent = text;
}

function switchTab(tab) {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });
  document.querySelectorAll(".tab-view").forEach((view) => {
    view.classList.toggle("active", view.id === `tab-${tab}`);
  });
}

function generateBmcFromInput() {
  const idea = els.ideaInput.value.trim();
  if (!idea) {
    setStatus("Isi ide dulu");
    els.ideaInput.focus();
    return;
  }
  state.idea = idea;
  setStatus("Memproses");

  const sector = detectSector(idea);
  const businessName = summarizeIdea(idea);
  state.bmc = buildBmc(idea, sector);
  state.risks = buildRisks(idea, sector);
  els.canvasTitle.textContent = `BMC - ${businessName}`;
  renderCanvas();
  renderRisks();
  renderChatIntro();
  persistState();
  setStatus("BMC siap");
  switchTab("canvas");
}

function detectSector(idea) {
  const lower = idea.toLowerCase();
  const matched = sectorRules.find((rule) => rule.match.some((keyword) => lower.includes(keyword)));
  return matched || {
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
}

function summarizeIdea(idea) {
  const cleaned = idea.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 46) return cleaned;
  return `${cleaned.slice(0, 43).trim()}...`;
}

function buildBmc(idea, sector) {
  const userContext = extractContext(idea, sector);
  const isTourism = sector.name === "tourism";

  if (isTourism) {
    return {
      customerSegments: [
        `Wisatawan dari ${userContext.primaryMarkets} yang ingin pengalaman ${userContext.product} di ${userContext.location} tanpa repot menyusun itinerary sendiri.`,
        ...sector.customer
      ].slice(0, 5),
      valuePropositions: [
        `Paket ${userContext.product} ${userContext.location} yang menggabungkan alam, budaya lokal, kuliner, cerita warga, dan aktivitas edukatif.`,
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

  return {
    customerSegments: [
      ...sector.customer,
      `Segmen awal yang paling mudah diuji: ${userContext.target}.`
    ].slice(0, 5),
    valuePropositions: [
      ...sector.value,
      `Janji utama: membantu pelanggan menyelesaikan "${userContext.problem}" dengan cara yang lebih praktis.`
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
function extractContext(idea, sector) {
  const lower = idea.toLowerCase();
  const location = detectLocation(idea);
  const isTourism = sector?.name === "tourism";
  const product = lower.includes("eko") || lower.includes("ekowisata") ? "eko wisata" : lower.includes("wisata") ? "wisata" : sector?.label || "bisnis";
  const primaryMarkets = isTourism && /cibarani|lebak|banten|kasepuhan/i.test(idea)
    ? "Jakarta, Tangerang, Serang, Bogor, Bandung, dan komunitas traveler Banten"
    : "kota sekitar lokasi dan komunitas niche yang relevan";

  const target = isTourism
    ? `calon pengunjung yang ingin ${product} autentik di ${location}`
    : lower.includes("umkm")
      ? "pemilik UMKM yang ingin hasil praktis"
      : lower.includes("jakarta")
        ? "pelanggan urban di Jakarta"
        : lower.includes("petani")
          ? "petani dan pembeli hasil panen"
          : "kelompok pelanggan awal yang paling sering merasakan masalah ini";

  const problem = isTourism
    ? "sulit menemukan paket wisata yang jelas, aman, autentik, menghormati warga/adat, dan mudah dipesan"
    : lower.includes("tanpa")
      ? idea.split(/tanpa/i)[1]?.slice(0, 80).trim() || "mengurangi hambatan utama"
      : lower.includes("ingin")
        ? idea.split(/ingin/i)[1]?.slice(0, 80).trim() || "mencapai hasil yang diinginkan"
        : "memulai solusi dengan risiko dan biaya yang lebih kecil";

  return { location, product, primaryMarkets, target, problem };
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
  return value.trim().split(/\s+/).filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}
function buildRisks(idea, sector) {
  const context = extractContext(idea, sector);

  if (sector.name === "tourism") {
    return [
      {
        title: "Izin sosial, aturan adat, dan kapasitas lokasi belum jelas",
        why: `Bisnis wisata di ${context.location} hanya sehat jika warga, tokoh adat, dan pengelola lokal merasa dilibatkan dan manfaatnya adil.`,
        test: "Adakan diskusi kecil dengan tokoh adat/desa, calon guide, pemilik homestay, dan warga terdampak. Sepakati aturan kunjungan, kapasitas, pembagian manfaat, dan aktivitas yang tidak boleh dilakukan."
      },
      {
        title: "Wisatawan mau membayar paket, bukan hanya datang sendiri",
        why: "Eko wisata perlu membuktikan bahwa itinerary, guide lokal, keamanan, cerita budaya, dan kemudahan booking cukup bernilai untuk dibayar.",
        test: "Buat 2 paket dan buka pre-booking ke 30 calon peserta/komunitas. Target awal: minimal 10 orang bersedia bayar DP untuk pilot trip."
      },
      {
        title: "Kualitas pengalaman belum konsisten dari trip ke trip",
        why: "Review buruk bisa muncul dari akses sulit, cuaca, guide belum siap, homestay kurang bersih, atau ekspektasi pengunjung tidak sesuai.",
        test: "Jalankan pilot trip 10-15 orang dengan checklist SOP, form feedback, data biaya aktual, dan review terbuka. Perbaiki paket sebelum promosi besar."
      }
    ];
  }

  return [
    {
      title: "Segmen awal benar-benar merasakan masalah ini",
      why: `BMC terlihat kuat hanya jika ${context.target} punya pain yang sering, mahal, atau mendesak.`,
      test: "Wawancarai 15 calon pelanggan dan minta mereka menceritakan solusi yang saat ini dipakai, bukan sekadar opini."
    },
    {
      title: "Value proposition cukup berbeda dari alternatif",
      why: `Di kategori ${sector.label}, pelanggan biasanya punya opsi gratis, manual, atau kompetitor yang sudah dikenal.`,
      test: "Buat landing page dengan tiga variasi pesan nilai, lalu ukur klik CTA dan signup per pesan."
    },
    {
      title: "Unit economics masuk akal sejak transaksi awal",
      why: "Revenue harus bisa menutup biaya akuisisi, produksi, support, dan eksperimen pertumbuhan.",
      test: "Hitung margin per paket dan jalankan pre-order kecil sebelum membangun fitur atau operasi penuh."
    }
  ];
}
function renderCanvas() {
  els.grid.innerHTML = "";
  blocks.forEach((block, index) => {
    const node = els.blockTemplate.content.firstElementChild.cloneNode(true);
    node.dataset.tone = block.tone;
    if (block.key === "costStructure" || block.key === "revenueStreams") node.classList.add("wide");
    node.querySelector(".block-index").textContent = String(index + 1).padStart(2, "0");
    node.querySelector("h4").textContent = block.title;
    const list = node.querySelector("ul");
    (state.bmc[block.key] || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.append(li);
    });
    node.querySelector(".block-refine").addEventListener("click", () => {
      switchTab("chat");
      const prompt = `Refine ${block.title} saya`;
      els.chatInput.value = prompt;
      els.chatInput.focus();
    });
    els.grid.append(node);
  });
}

function renderRisks() {
  els.riskList.innerHTML = "";
  state.risks.forEach((risk, index) => {
    const article = document.createElement("article");
    article.className = "risk-card";
    article.innerHTML = `
      <h4>${index + 1}. ${escapeHtml(risk.title)}</h4>
      <p><strong>Mengapa:</strong> ${escapeHtml(risk.why)}</p>
      <p><strong>Cara uji:</strong> ${escapeHtml(risk.test)}</p>
    `;
    els.riskList.append(article);
  });
}

function renderChatIntro() {
  els.chatLog.innerHTML = "";
  addMessage("ai", "Saya siap membantu refine BMC Anda. Coba tanya: \"Apa langkah 30 hari pertama?\", \"Berapa harga paket yang masuk akal?\", \"Asumsi paling berisiko apa?\", atau klik Refine pada salah satu blok.");
}

function addMessage(role, text) {
  const message = document.createElement("div");
  message.className = `message ${role}`;
  const label = role === "ai" ? "BMC AI" : "Anda";
  message.innerHTML = `<strong>${label}</strong>${formatChatText(text)}`;
  els.chatLog.append(message);
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
}

function answerQuestion(question) {
  const lower = question.toLowerCase();
  const sector = detectSector(state.idea || "");
  const context = extractContext(state.idea || "", sector);

  if (lower.includes("langkah") || lower.includes("action") || lower.includes("30 hari") || lower.includes("jalankan") || lower.includes("mulai")) {
    return buildActionPlanResponse(sector, context);
  }

  if (lower.includes("risiko") || lower.includes("risky") || lower.includes("asumsi")) {
    return `Tiga asumsi paling penting untuk diuji:\n\n1. ${state.risks[0].title}\nCara uji: ${state.risks[0].test}\n\n2. ${state.risks[1].title}\nCara uji: ${state.risks[1].test}\n\n3. ${state.risks[2].title}\nCara uji: ${state.risks[2].test}`;
  }

  if (lower.includes("harga") || lower.includes("pricing") || lower.includes("tarif")) {
    if (sector.name === "tourism") {
      return "Untuk eko wisata, jangan mulai dari harga tebak-tebakan. Hitung HPP per peserta dulu: guide, makan, homestay, transport lokal, kontribusi warga/adat, dokumentasi, kebersihan, dan cadangan risiko. Buat 3 paket awal: one-day, overnight, dan grup sekolah/kantor. Minta DP untuk pilot trip agar demand terbukti sebelum operasional disiapkan.";
    }
    return "Mulai dengan tiga level harga: entry untuk validasi cepat, pro untuk pengguna rutin, dan premium untuk bantuan intensif. Ukur willingness to pay dengan pre-order, bukan survei opini saja.";
  }

  if (lower.includes("mvp") || lower.includes("pertama") || lower.includes("pilot")) {
    if (sector.name === "tourism") {
      return "MVP eko wisata paling ringan: satu paket pilot untuk 10-15 peserta, satu rute aman, satu guide utama, satu opsi makan lokal, briefing etika kunjungan, dan form feedback. Jangan buat banyak paket dulu. Tujuan pilot adalah membuktikan itinerary, harga, keamanan, dan kepuasan peserta.";
    }
    return "MVP paling ringan: landing page, satu CTA, 10-20 wawancara calon pelanggan, dan satu output manual/concierge. Setelah ada bukti minat, baru otomatisasi fitur yang paling sering dipakai.";
  }

  const block = blocks.find((item) => blockSynonyms[item.key].some((word) => lower.includes(word)) || lower.includes(item.title.toLowerCase()));
  if (block) {
    const points = state.bmc[block.key] || [];
    return `Untuk ${block.title}, arah saat ini:\n\n${points.map((point, index) => `${index + 1}. ${point}`).join("\n")}\n\nSaran eksekusi: ${blockActionAdvice(block, sector, context)}`;
  }

  return buildActionPlanResponse(sector, context);
}

function buildActionPlanResponse(sector, context) {
  if (sector.name === "tourism") {
    return `Rencana 30 hari untuk membuat ${context.product} di ${context.location} lebih siap dijalankan:\n\nMinggu 1 - Validasi lokal\n1. Temui tokoh adat/desa, calon guide, pemilik homestay, dan UMKM lokal.\n2. Catat aset wisata, larangan, kapasitas kunjungan, rute aman, dan siapa mendapat manfaat.\n3. Pilih 1 paket pilot yang paling aman dijalankan.\n\nMinggu 2 - Bentuk produk\n1. Buat paket one-day dan overnight lengkap dengan rundown, harga, HPP, margin, dan checklist risiko.\n2. Siapkan WhatsApp Business, Google Form booking, katalog sederhana, dan 10 foto/video asli.\n3. Buat script briefing etika kunjungan dan SOP cuaca buruk.\n\nMinggu 3 - Cari pembeli awal\n1. Hubungi 30 target: komunitas traveler, kampus, sekolah, kantor, dan creator lokal.\n2. Tawarkan pilot trip terbatas 10-15 orang dengan DP.\n3. Ukur jumlah chat masuk, DP, alasan menolak, dan pertanyaan paling sering.\n\nMinggu 4 - Pilot dan perbaikan\n1. Jalankan trip kecil, rekam biaya aktual dan masalah operasional.\n2. Minta review Google/Instagram dan testimoni video pendek.\n3. Revisi harga, itinerary, SOP, dan kapasitas sebelum promosi lebih besar.\n\nMetrik utama: DP terkumpul, margin per peserta, rating pengalaman, repeat/referral intent, dan jumlah warga/UMKM yang mendapat manfaat.`;
  }

  return "Rencana 30 hari: minggu 1 wawancara 15 calon pelanggan, minggu 2 buat landing page dan penawaran, minggu 3 jalankan pre-order/pilot kecil, minggu 4 evaluasi conversion, margin, dan feedback lalu tentukan apakah lanjut, ubah segmen, atau ubah value proposition.";
}

function blockActionAdvice(block, sector, context) {
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
  return advice[block.key] || advice.keyActivities;
}
function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    setStatus("Voice tidak tersedia");
    addMessage("ai", "Browser ini belum mendukung Web Speech API. Anda tetap bisa mengetik ide di kolom input.");
    switchTab("chat");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "id-ID";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  setStatus("Mendengar");
  recognition.start();
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    els.ideaInput.value = `${els.ideaInput.value} ${transcript}`.trim();
    setStatus("Suara masuk");
  };
  recognition.onerror = () => setStatus("Voice gagal");
  recognition.onend = () => setTimeout(() => setStatus("Siap"), 1200);
}

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const ext = file.name.split(".").pop().toLowerCase();
  if (["txt", "md"].includes(ext)) {
    const reader = new FileReader();
    reader.onload = () => {
      els.ideaInput.value = `${els.ideaInput.value}\n\n${reader.result}`.trim();
      setStatus("File dibaca");
    };
    reader.readAsText(file);
  } else {
    els.ideaInput.value = `${els.ideaInput.value}\n\nKonteks dokumen: ${file.name}. Prototype offline ini menerima file tersebut sebagai sinyal konteks; parsing PDF/DOCX/PPTX perlu backend parser seperti pdf-parse, mammoth.js, atau extractor deck.`.trim();
    setStatus("File diterima");
  }
}

function toMarkdown() {
  const lines = [
    "# Business Model Canvas",
    "",
    state.idea ? `Ide bisnis: ${state.idea}` : "",
    ""
  ];
  blocks.forEach((block) => {
    lines.push(`## ${block.title}`);
    (state.bmc[block.key] || []).forEach((item) => lines.push(`- ${item}`));
    lines.push("");
  });
  lines.push("## Risky Assumptions");
  state.risks.forEach((risk, index) => {
    lines.push(`${index + 1}. ${risk.title}`);
    lines.push(`   - Mengapa: ${risk.why}`);
    lines.push(`   - Cara uji: ${risk.test}`);
  });
  return lines.filter((line, index, arr) => !(line === "" && arr[index - 1] === "")).join("\n");
}

function toStandaloneHtml() {
  const blockHtml = blocks
    .map((block) => {
      const items = (state.bmc[block.key] || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
      return `<section><h2>${escapeHtml(block.title)}</h2><ul>${items}</ul></section>`;
    })
    .join("");
  const riskHtml = state.risks
    .map((risk) => `<li><strong>${escapeHtml(risk.title)}</strong><br>${escapeHtml(risk.why)}<br><em>${escapeHtml(risk.test)}</em></li>`)
    .join("");
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Business Model Canvas</title><style>body{font-family:Arial,sans-serif;line-height:1.55;max-width:980px;margin:40px auto;padding:0 18px;color:#17211f}section{border:1px solid #dce4df;border-radius:8px;padding:16px;margin:12px 0}h1,h2{line-height:1.1}</style></head><body><h1>Business Model Canvas</h1><p>${escapeHtml(state.idea || "")}</p>${blockHtml}<section><h2>Risky Assumptions</h2><ol>${riskHtml}</ol></section></body></html>`;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus("Export dibuat");
}

function renderSocialControls() {
  els.topicRow.innerHTML = "";
  topics.forEach((topic) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `topic-chip${topic === state.selectedTopic ? " active" : ""}`;
    button.textContent = topic;
    button.addEventListener("click", () => {
      state.selectedTopic = topic;
      els.topicInput.value = topic;
      renderSocialControls();
    });
    els.topicRow.append(button);
  });

  els.platformRow.innerHTML = "";
  platforms.forEach((platform) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `platform-toggle${state.selectedPlatforms.has(platform) ? " active" : ""}`;
    button.textContent = platform;
    button.addEventListener("click", () => {
      if (state.selectedPlatforms.has(platform)) state.selectedPlatforms.delete(platform);
      else state.selectedPlatforms.add(platform);
      if (state.selectedPlatforms.size === 0) state.selectedPlatforms.add(platform);
      renderSocialControls();
    });
    els.platformRow.append(button);
  });
}

function generatePosts() {
  const topic = els.topicInput.value.trim() || state.selectedTopic || topics[0];
  const selected = Array.from(state.selectedPlatforms);
  const templates = [
    {
      hook: "Banyak bisnis gagal bukan karena idenya jelek, tapi karena modelnya belum jelas.",
      angle: "Pakai BMC untuk melihat pelanggan, nilai, channel, dan revenue dalam satu halaman.",
      cta: "Tulis satu ide Anda hari ini, lalu ubah menjadi 9 blok."
    },
    {
      hook: "Satu pertanyaan yang sering menghemat biaya founder: siapa pelanggan pertama yang paling spesifik?",
      angle: "BMC memaksa kita memilih segmen, bukan mengejar semua orang.",
      cta: "Mulai dari segmen paling sempit, lalu validasi dengan wawancara."
    },
    {
      hook: "Revenue stream bukan sekadar harga.",
      angle: "Anda bisa menguji langganan, paket output, komisi, bundling, atau konsultasi premium.",
      cta: "Pilih satu yang paling mudah diuji minggu ini."
    },
    {
      hook: "Value proposition yang kuat terdengar seperti solusi untuk masalah nyata.",
      angle: "Jika pelanggan tidak bisa menyebutkan masalahnya, copywriting terbaik pun sulit menjual.",
      cta: "Tanya pelanggan: kapan terakhir kali masalah ini terjadi?"
    },
    {
      hook: "BMC terbaik bukan dokumen final. Ia adalah peta eksperimen.",
      angle: "Setiap blok perlu bukti: klik, signup, pre-order, repeat order, atau referral.",
      cta: "Tentukan satu asumsi paling berisiko dan uji dalam 7 hari."
    }
  ];

  return templates.map((template, index) => {
    const platform = selected[index % selected.length] || "LinkedIn";
    return {
      platform,
      title: `${platform} - ${topic}`,
      caption: adaptCaption(platform, template, topic),
      hashtags: hashtagsFor(platform),
      image: imageSuggestion(platform, topic),
      time: bestTime(platform, index)
    };
  });
}

function adaptCaption(platform, template, topic) {
  if (platform === "X") {
    return `${template.hook}\n\nTopik: ${topic}.\n${template.cta}`;
  }
  if (platform === "TikTok") {
    return `Opening 3 detik: "${template.hook}"\nIsi: ${template.angle}\nCTA: ${template.cta}`;
  }
  if (platform === "LinkedIn") {
    return `${template.hook}\n\nTopik hari ini: ${topic}.\n\n${template.angle}\n\n${template.cta} Bagikan satu asumsi bisnis yang sedang Anda uji.`;
  }
  return `${template.hook}\n\n${template.angle}\n\n${template.cta}`;
}

function hashtagsFor(platform) {
  const base = ["#BusinessModelCanvas", "#BMC", "#Entrepreneurship", "#UMKM"];
  if (platform === "LinkedIn") return [...base, "#StartupIndonesia"].join(" ");
  if (platform === "TikTok") return [...base, "#BelajarBisnis", "#FounderTips"].join(" ");
  if (platform === "X") return ["#BMC", "#Startup", "#Bisnis"].join(" ");
  return [...base, "#IdeBisnis"].join(" ");
}

function imageSuggestion(platform, topic) {
  if (platform === "TikTok") return `Video 20-30 detik: founder menempel sticky notes 9 blok BMC sambil teks overlay "${topic}".`;
  if (platform === "Instagram") return `Carousel 5 slide: problem, 9 blok, contoh singkat, asumsi risiko, CTA buat BMC.`;
  if (platform === "LinkedIn") return "Diagram bersih satu halaman yang membandingkan ide mentah vs BMC siap diuji.";
  return "Visual ringkas BMC grid dengan highlight pada blok yang dibahas.";
}

function bestTime(platform, index) {
  const times = {
    Instagram: ["Selasa 19:30", "Kamis 12:15"],
    LinkedIn: ["Rabu 08:30", "Selasa 10:00"],
    X: ["Senin 12:00", "Jumat 17:30"],
    TikTok: ["Kamis 20:00", "Minggu 18:30"],
    Facebook: ["Sabtu 10:00", "Rabu 19:00"]
  };
  const list = times[platform] || ["Rabu 09:00"];
  return list[index % list.length];
}

function renderPosts(posts) {
  els.postBoard.innerHTML = "";
  posts.forEach((post) => {
    const article = document.createElement("article");
    article.className = "post-card";
    article.innerHTML = `
      <header>
        <h3>${escapeHtml(post.title)}</h3>
        <span class="platform-badge">${escapeHtml(post.platform)}</span>
      </header>
      <p>${escapeHtml(post.caption).replace(/\n/g, "<br>")}</p>
      <div class="post-meta">
        <span><strong>Hashtags:</strong> ${escapeHtml(post.hashtags)}</span>
        <span><strong>Visual:</strong> ${escapeHtml(post.image)}</span>
        <span><strong>Jadwal:</strong> ${escapeHtml(post.time)}</span>
      </div>
    `;
    els.postBoard.append(article);
  });
}

function formatChatText(text) {
  return escapeHtml(text).replace(/\n/g, "<br>");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();
