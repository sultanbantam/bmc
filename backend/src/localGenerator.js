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

function normalizeLanguage(value) {
  return String(value || "").toLowerCase() === "en" ? "en" : "id";
}

function detectSector(idea = "") {
  const lower = idea.toLowerCase();
  return sectors.find((sector) => sector.match.some((keyword) => lower.includes(keyword))) || generalSector;
}

function summarizeIdea(idea = "") {
  const cleaned = idea.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 54) return cleaned || "Business Model Canvas";
  return `${cleaned.slice(0, 51).trim()}...`;
}

function generateLocalBmc(idea, options = {}) {
  const language = normalizeLanguage(options.language);
  const cleanIdea = String(idea || "").trim();
  if (!cleanIdea) {
    const error = new Error(language === "en" ? "Business idea is required." : "Ide bisnis wajib diisi.");
    error.status = 400;
    throw error;
  }

  const sector = detectSector(cleanIdea);
  if (language === "en") return generateEnglishLocalBmc(cleanIdea, sector);

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

const englishSectorPacks = {
  tourism: {
    label: "eco-tourism / village tourism",
    customer: [
      "families, schools, campuses, travel communities, and companies seeking nature-culture experiences",
      "niche travelers interested in local culture, farming, conservation, and responsible tourism",
      "organizations looking for CSR, outing, or team-building programs rooted in local communities"
    ],
    value: [
      "guided eco-tourism packages that combine nature, local culture, food, storytelling, and visitor ethics",
      "clear itinerary, price, safety rules, booking flow, and local impact so visitors can decide confidently",
      "direct economic benefit for guides, homestays, food sellers, artisans, and conservation activities"
    ],
    channel: [
      "WhatsApp Business for booking, package catalog, access FAQ, and follow-up",
      "Instagram, TikTok, Google Business Profile, and SEO articles around local eco-tourism keywords",
      "partnerships with travel communities, schools, campuses, offices, creators, and local organizers"
    ],
    revenue: [
      "one-day trip packages per person including guide, local meal, and main activities",
      "overnight packages with homestay, meals, guide, and cultural/nature activities",
      "school, campus, corporate, and CSR group packages with higher service scope"
    ],
    activity: [
      "map tourism assets, safe routes, visitor limits, local rules, and benefit-sharing agreements",
      "train local guides in storytelling, hospitality, safety, and group coordination",
      "run pilot trips, capture feedback, calculate real costs, and refine packages"
    ],
    resource: [
      "local guides, community trust, cultural stories, natural routes, homestays, and activity spots",
      "SOPs for visitors, safety, weather, pricing, itinerary, and booking operations",
      "photo/video assets, landing page, WhatsApp Business, Google Maps, and prospect database"
    ],
    partner: [
      "village government, local/customary leaders, tourism awareness groups, youth groups, and homestays",
      "travel communities, schools, campuses, offices, tour organizers, and local creators",
      "transport providers, outdoor equipment providers, local food SMEs, artisans, and tourism offices"
    ],
    cost: [
      "guide fees, meals, homestay, local transport, cleaning, community contribution, and trip operations",
      "content production, small ads, landing page, booking admin, and documentation",
      "guide training, safety equipment, signage, permits, facility maintenance, and weather/refund buffer"
    ]
  },
  fnb: {
    label: "F&B",
    customer: ["urban workers who need convenient options", "local customers within a 3-5 km radius", "repeat buyers seeking consistent taste and service"],
    value: ["stable taste and quality", "fast and convenient ordering experience", "menu options that fit customer preferences"],
    channel: ["Google Maps and local reviews", "Instagram/TikTok menu content", "delivery platforms and office/community partnerships"],
    revenue: ["single product sales", "weekly subscription bundles", "corporate or small-event packages"],
    activity: ["ingredient sourcing", "recipe and SOP standardization", "daily menu content campaigns"],
    resource: ["production kitchen or bar", "ingredient suppliers", "brand assets and ordering system"],
    partner: ["local suppliers", "delivery platforms", "office and coworking communities"],
    cost: ["ingredients", "rent and utilities", "labor and packaging"]
  },
  education: {
    label: "edtech / training",
    customer: ["beginners who need practical skills", "SME owners who need fast outcomes", "professional communities seeking upskilling"],
    value: ["short practical lessons", "mentor or AI tutor feedback", "templates that speed up implementation"],
    channel: ["free webinars", "LinkedIn and WhatsApp communities", "alumni referrals"],
    revenue: ["single classes", "premium content subscriptions", "paid cohort programs"],
    activity: ["curriculum curation", "content production", "mentoring and progress review"],
    resource: ["experts/mentors", "learning platform", "template and case-study library"],
    partner: ["SME communities", "campuses or incubators", "supporting SaaS tools"],
    cost: ["mentor fees", "content production", "platform and participant acquisition"]
  },
  agri: {
    label: "agritech",
    customer: ["small farmers and cooperatives", "restaurants and caterers", "household buyers who care about product origin"],
    value: ["clearer market access", "fresher and traceable supply", "more transparent pricing for both sides"],
    channel: ["cooperative partnerships", "B2B sales to restaurants", "marketplace and local community groups"],
    revenue: ["transaction margin", "B2B buyer subscription", "logistics or quality-control services"],
    activity: ["supply verification", "order and delivery management", "harvest quality control"],
    resource: ["farmer network", "harvest inventory data", "logistics operation"],
    partner: ["farmer cooperatives", "cold chain/logistics providers", "anchor restaurant customers"],
    cost: ["logistics", "quality control", "field operations and technology"]
  },
  tech: {
    label: "digital / SaaS",
    customer: ["early adopters", "small teams needing automation", "business owners seeking efficiency"],
    value: ["automation of manual work", "faster insight from data", "repeatable and measurable workflows"],
    channel: ["SEO landing page", "educational content and demos", "community partnerships and referrals"],
    revenue: ["monthly subscriptions", "one-off output packages", "premium service or consulting"],
    activity: ["product development", "customer support", "acquisition and onboarding experiments"],
    resource: ["product and engineering team", "AI/API provider", "user database and knowledge base"],
    partner: ["AI providers", "payment gateways", "business communities or incubators"],
    cost: ["hosting and API", "product development", "marketing and support"]
  },
  general: {
    label: "early-stage business",
    customer: ["early adopters with a clear problem", "reachable niche segments", "customers already looking for alternatives"],
    value: ["a faster or simpler solution", "an easy-to-understand customer experience", "a measurable outcome in a short time"],
    channel: ["landing page and SEO", "niche communities", "educational content and referrals"],
    revenue: ["core product/service sales", "subscription or retainer packages", "premium add-ons or consulting"],
    activity: ["problem validation", "offer development", "customer acquisition and onboarding"],
    resource: ["core team", "customer data", "brand and operating system"],
    partner: ["target communities", "operational vendors", "distribution partners"],
    cost: ["product development", "operations", "marketing and support"]
  }
};

function generateEnglishLocalBmc(cleanIdea, detectedSector) {
  const sector = englishSectorPacks[detectedSector.name] || englishSectorPacks.general;
  const context = extractEnglishContext(cleanIdea, detectedSector, sector);
  const bmc = detectedSector.name === "tourism" ? englishTourismBmc(context, sector) : englishGenericBmc(context, sector);
  const risks = buildEnglishRisks(context, detectedSector, sector);

  return {
    title: summarizeIdea(cleanIdea),
    idea: cleanIdea,
    sector: sector.label,
    source: "local",
    language: "en",
    bmc,
    risks,
    actionPlan: buildEnglishActionPlan(detectedSector, context),
    nextQuestions: [
      "Which segment is easiest to validate this week?",
      "What package price makes sense for the first pilot?",
      "Which assumption should be tested before spending more money?"
    ]
  };
}

function englishGenericBmc(context, sector) {
  return {
    customerSegments: [
      ...sector.customer,
      `Most testable first segment: ${context.target}.`
    ].slice(0, 5),
    valuePropositions: [
      ...sector.value,
      `Core promise: help customers solve "${context.problem}" in a more practical way.`
    ].slice(0, 5),
    channels: [
      ...sector.channel,
      "Landing page with a clear CTA to collect leads and measure demand."
    ].slice(0, 5),
    customerRelationships: [
      "Short onboarding that asks about customer needs, budget, context, and urgency.",
      "Follow-up after users try the product or receive the first output.",
      "Community or newsletter for education, case studies, and retention.",
      "Premium consultation path for high-value customers."
    ],
    revenueStreams: [
      ...sector.revenue,
      "Early price experiments with entry, pro, and premium packages."
    ].slice(0, 5),
    keyActivities: [
      ...sector.activity,
      "Measure conversion, activation, and repeat usage every week."
    ].slice(0, 5),
    keyResources: [
      ...sector.resource,
      "Templates, SOPs, and learning data from early customers."
    ].slice(0, 5),
    keyPartnerships: [
      ...sector.partner,
      "Acquisition partners already trusted by the target segment."
    ].slice(0, 5),
    costStructure: [
      ...sector.cost,
      "Validation costs such as landing page, product samples, small campaigns, and customer support."
    ].slice(0, 5)
  };
}

function englishTourismBmc(context, sector) {
  return {
    customerSegments: [
      `Visitors from ${context.primaryMarkets} who want ${context.product === "eco-tourism" ? "an" : "a"} ${context.product} experience in ${context.location} without building the itinerary themselves.`,
      ...sector.customer
    ].slice(0, 5),
    valuePropositions: [
      `A ${context.product} package in ${context.location} combining nature, local culture, food, community stories, and educational activities.`,
      ...sector.value
    ].slice(0, 5),
    channels: sector.channel.slice(0, 5),
    customerRelationships: [
      "Before trip: WhatsApp consultation about group size, age, transport, interests, and physical limits.",
      "During trip: local guide acts as host, storyteller, visitor-ethics guardian, and safety coordinator.",
      "After trip: send documentation, request Google/Instagram reviews, and offer referral or next package.",
      "For schools/offices: short proposal, invoice, itinerary, permits if needed, and simple impact report.",
      "Alumni community for harvest calendars, cultural events, and future open trips."
    ],
    revenueStreams: [
      ...sector.revenue,
      "Deposits/pre-booking to prove demand before preparing guides, meals, homestays, and transport."
    ].slice(0, 5),
    keyActivities: [
      ...sector.activity,
      "Run a 10-15 person pilot trip to test itinerary, price, SOP, actual cost, and experience quality."
    ].slice(0, 5),
    keyResources: [
      ...sector.resource,
      "Cost data per participant, margin per package, minimum viable group size, and partner prospect list."
    ].slice(0, 5),
    keyPartnerships: [
      ...sector.partner,
      "Simple agreements on roles, benefit sharing, visitor capacity, and activities that are not allowed."
    ].slice(0, 5),
    costStructure: [
      ...sector.cost,
      "Separate variable cost per participant and fixed costs to know the break-even group size."
    ].slice(0, 5)
  };
}

function extractEnglishContext(idea, detectedSector, sector) {
  const lower = idea.toLowerCase();
  const location = detectLocation(idea);
  const product = lower.includes("eco") || lower.includes("eko") || lower.includes("ekowisata")
    ? "eco-tourism"
    : lower.includes("wisata") || lower.includes("tour")
      ? "tourism"
      : sector.label || "business";
  const primaryMarkets = detectedSector.name === "tourism" && /cibarani|lebak|banten|kasepuhan/i.test(idea)
    ? "Jakarta, Tangerang, Serang, Bogor, Bandung, and Banten travel communities"
    : "nearby cities and relevant niche communities";
  const target = detectedSector.name === "tourism"
    ? `potential visitors seeking an authentic ${product} experience in ${location}`
    : lower.includes("sme") || lower.includes("umkm")
      ? "SME owners who need practical outcomes"
      : lower.includes("jakarta")
        ? "urban customers in Jakarta"
        : lower.includes("farmer") || lower.includes("petani")
          ? "farmers and harvest buyers"
          : "the customer group that feels the problem most often";
  const problem = detectedSector.name === "tourism"
    ? "finding a clear, safe, authentic, locally respectful, and easy-to-book tourism package"
    : lower.includes("without")
      ? idea.split(/without/i)[1]?.slice(0, 80).trim() || "removing the main friction"
      : lower.includes("want")
        ? idea.split(/want/i)[1]?.slice(0, 80).trim() || "achieving the desired outcome"
        : "starting with lower risk and lower cost";

  return { idea, location, product, primaryMarkets, target, problem };
}

function buildEnglishRisks(context, detectedSector, sector) {
  if (detectedSector.name === "tourism") {
    return [
      {
        title: "Local permission, visitor rules, and site capacity are not clear yet",
        why: `Tourism in ${context.location} is only healthy if local leaders, residents, guides, and operators feel involved and fairly benefit.`,
        test: "Run a small discussion with local/customary leaders, guide candidates, homestay owners, and affected residents. Agree on visitor rules, capacity, benefit sharing, and prohibited activities.",
        metric: "Roles, capacity limits, and benefit sharing are agreed before the pilot trip."
      },
      {
        title: "Visitors may not pay for a package instead of coming independently",
        why: "Eco-tourism must prove that itinerary, guide, safety, cultural stories, and easy booking are valuable enough to pay for.",
        test: "Create two packages and offer pre-booking to 30 potential participants or communities. Initial target: at least 10 people pay a deposit for the pilot trip.",
        metric: "At least 10 people pay a deposit or commit to a specific date."
      },
      {
        title: "Experience quality may not be consistent from trip to trip",
        why: "Bad reviews can come from difficult access, weather, unprepared guides, homestay quality, or mismatched expectations.",
        test: "Run a 10-15 person pilot trip with SOP checklist, feedback form, actual cost data, and public reviews. Improve before scaling promotion.",
        metric: "Pilot rating is at least 4/5 and margin per participant remains positive."
      }
    ];
  }

  return [
    {
      title: "The first segment may not feel the problem strongly enough",
      why: `The BMC only becomes useful if ${context.target} has a frequent, expensive, or urgent pain.`,
      test: "Interview 15 potential customers and ask them to describe current alternatives, not just opinions.",
      metric: "At least 8 of 15 prospects have an active problem and have tried a workaround."
    },
    {
      title: "The value proposition may not be different enough from alternatives",
      why: `In ${sector.label}, customers often have free, manual, or familiar competitor options.`,
      test: "Create a landing page with three value-message variants, then measure CTA clicks and signups per message.",
      metric: "One value message reaches at least 8-12 percent CTA conversion from cold traffic."
    },
    {
      title: "Unit economics may not work from early transactions",
      why: "Revenue must cover acquisition, production, support, and growth experiments.",
      test: "Calculate margin per package and run a small pre-order before building full features or operations.",
      metric: "Contribution margin is positive after key variable costs are included."
    }
  ];
}

function answerLocalChatEnglish({ idea = "", bmc = {}, risks = [], question = "" }) {
  const detectedSector = detectSector(idea);
  const sector = englishSectorPacks[detectedSector.name] || englishSectorPacks.general;
  const context = extractEnglishContext(idea || "early-stage business", detectedSector, sector);
  const lower = question.toLowerCase();
  const riskList = risks.length ? risks : buildEnglishRisks(context, detectedSector, sector);

  if (lower.includes("step") || lower.includes("action") || lower.includes("30 day") || lower.includes("start") || lower.includes("execute")) {
    return buildEnglishActionPlan(detectedSector, context);
  }

  if (lower.includes("risk") || lower.includes("assumption")) {
    return `The three assumptions to test first:\n\n1. ${riskList[0].title}\nHow to test: ${riskList[0].test}\n\n2. ${riskList[1].title}\nHow to test: ${riskList[1].test}\n\n3. ${riskList[2].title}\nHow to test: ${riskList[2].test}`;
  }

  if (lower.includes("price") || lower.includes("pricing") || lower.includes("revenue")) {
    if (detectedSector.name === "tourism") {
      return "Start from cost per participant: guide, meals, homestay, local transport, community contribution, documentation, cleaning, and risk buffer. Test one-day, overnight, and school/corporate packages. Ask for a deposit before preparing the full operation.";
    }
    return "Start with three price levels: entry for quick validation, pro for regular users, and premium for intensive help. Measure willingness to pay with pre-orders, not surveys only.";
  }

  const block = blocks.find((item) => blockSynonyms[item.key].some((word) => lower.includes(word)) || lower.includes(item.title.toLowerCase()));
  if (block) {
    const generated = Object.keys(bmc || {}).length ? bmc : generateLocalBmc(idea || context.idea, { language: "en" }).bmc;
    const points = generated[block.key] || [];
    return `For ${block.title}, the current direction is:\n\n${points.map((point, index) => `${index + 1}. ${point}`).join("\n")}\n\nExecution advice: ${blockActionAdviceEnglish(block.key, detectedSector, context)}`;
  }

  return buildEnglishActionPlan(detectedSector, context);
}

function buildEnglishActionPlan(detectedSector, context) {
  if (detectedSector.name === "tourism") {
    return `30-day plan for ${context.product} in ${context.location}:\n\nWeek 1 - Local validation\n1. Meet local/customary leaders, guide candidates, homestay owners, and local SMEs.\n2. Map assets, restrictions, visitor capacity, safe routes, and benefit sharing.\n3. Choose one safe pilot package.\n\nWeek 2 - Product shape\n1. Build one-day and overnight packages with itinerary, price, cost, margin, and risk checklist.\n2. Prepare WhatsApp Business, booking form, simple catalog, and 10 authentic photos/videos.\n3. Draft visitor ethics briefing and bad-weather SOP.\n\nWeek 3 - Early buyers\n1. Contact 30 targets: travel communities, campuses, schools, offices, and local creators.\n2. Offer a limited 10-15 person pilot trip with deposit.\n3. Track incoming chats, deposits, objections, and frequently asked questions.\n\nWeek 4 - Pilot and improvement\n1. Run the small trip and record actual cost and operational issues.\n2. Ask for Google/Instagram reviews and short video testimonials.\n3. Revise price, itinerary, SOP, and capacity before bigger promotion.\n\nMain metrics: deposits collected, margin per participant, experience rating, repeat/referral intent, and number of local people/SMEs who benefit.`;
  }

  return "30-day plan: week 1 interview 15 potential customers, week 2 create a landing page and offer, week 3 run a small pre-order or pilot, week 4 evaluate conversion, margin, and feedback, then decide whether to continue, change segment, or adjust the value proposition.";
}

function blockActionAdviceEnglish(blockKey, detectedSector, context) {
  if (detectedSector.name !== "tourism") {
    return "Turn this block into one practical decision, then validate it within 7 days through interviews, a landing page, pre-order, small pilot, or real cost data.";
  }

  const advice = {
    customerSegments: "Start with one reachable segment, such as travel communities near Jakarta/Banten or campuses. List 30 potential buyers and contact them directly.",
    valuePropositions: `Make the value concrete: itinerary, duration, price, inclusions/exclusions, local impact, visitor rules, and why ${context.location} is different from ordinary tourism.`,
    channels: "Prioritize WhatsApp booking, Instagram/TikTok short videos, Google Maps, and community partners. First content should answer access, price, activities, safety, and visitor ethics.",
    customerRelationships: "Build trust through fast WhatsApp responses, pre-trip briefing, friendly guides, post-trip documentation, and review/referral follow-up within 24 hours.",
    revenueStreams: "Calculate cost per participant first. Build one-day, overnight, and group packages. Use deposits to prove demand before preparing food, guides, and homestays.",
    keyActivities: "Validate local permission, safety SOP, package design, pilot trip, then scale content and partnerships.",
    keyResources: "The most important assets are community trust, local guides, cultural stories, SOPs, and authentic content.",
    keyPartnerships: "Create simple written agreements with local leaders, guides, homestays, SMEs, transport providers, and communities so roles and benefit sharing are clear.",
    costStructure: "Separate variable cost per participant from fixed costs so the minimum group size and margin are visible."
  };
  return advice[blockKey] || advice.keyActivities;
}

function answerLocalChat({ idea = "", bmc = {}, risks = [], question = "", language = "id" }) {
  if (normalizeLanguage(language) === "en") {
    return answerLocalChatEnglish({ idea, bmc, risks, question });
  }
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
