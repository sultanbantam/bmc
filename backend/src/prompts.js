const { blocks } = require("./localGenerator");

const blockContract = blocks.map((block) => `- ${block.key}: array 4-5 poin untuk ${block.title}`).join("\n");

const genericPhrases = [
  "media sosial",
  "pengguna awal",
  "meningkatkan efisiensi",
  "meningkatkan kualitas layanan",
  "konten edukasi",
  "customer support",
  "kolaborasi influencer",
  "landing page",
  "early adopter",
  "social media",
  "improve efficiency",
  "improve service quality",
  "educational content",
  "influencer collaboration"
].join('\", \"');

const qualityContract = `
Kontrak kualitas non-generik:
- Setiap poin BMC wajib berupa keputusan operasional, bukan slogan. Gunakan kata benda spesifik dari ide user.
- Jangan memakai frasa umum seperti "${genericPhrases}" kecuali langsung diberi detail: siapa targetnya, platform/komunitas mana, pesan apa, harga/angka, atau cara eksekusinya.
- Jika user tidak memberi angka, buat asumsi awal yang wajar dan tandai sebagai "asumsi awal" di dalam kalimat.
- Minimal 70% poin harus menyebut salah satu dari: segmen nyata, konteks penggunaan, kisaran harga, channel spesifik, aktivitas 7-30 hari, biaya, KPI, atau eksperimen validasi.
- Hindari poin yang bisa berlaku untuk semua bisnis. Jika satu poin tetap masuk akal untuk restoran, SaaS, wisata, dan kursus sekaligus, berarti poin itu terlalu umum dan harus dibuat ulang.
- Tulis ringkas tetapi padat: 12-32 kata per poin BMC.
`.trim();

const bmcBlockRules = `
Aturan tiap blok BMC:
- customerSegments: sebut persona nyata + situasi/pain + cara menemukan mereka. Hindari "pengguna awal" tanpa definisi.
- valuePropositions: sebut pain spesifik, hasil yang dijanjikan, dan pembeda dari alternatif/manual/kompetitor.
- channels: sebut kanal konkret seperti keyword SEO, komunitas, marketplace, cold outreach, event, partner, atau platform; sertakan pesan/CTA yang diuji.
- customerRelationships: sebut alur onboarding, follow-up, edukasi, retensi, atau support dengan frekuensi/SLA/contoh trigger.
- revenueStreams: wajib ada model harga atau kisaran harga awal, paket, komisi, freemium, add-on, atau syarat pre-order/DP.
- keyActivities: wajib ada aktivitas 7-30 hari yang bisa dilakukan, bukan "pengembangan produk" saja.
- keyResources: sebut aset nyata: data, konten, SOP, teknologi, tim, daftar leads, template, akses komunitas, atau modal kerja.
- keyPartnerships: sebut tipe mitra yang spesifik dan nilai yang ditukar, bukan "partner strategis".
- costStructure: sebut pos biaya nyata dan cara mengukurnya; jika relevan, pisahkan biaya tetap dan variabel.
- risks: setiap risiko harus punya hipotesis, alasan bisnis, eksperimen validasi 7-30 hari, dan KPI numerik/ambang keputusan.
`.trim();

function systemPrompt(language = "id") {
  const responseLanguage = language === "en" ? "English" : "Bahasa Indonesia";
  return `
Anda adalah business mentor dan product strategist untuk UMKM/founder Indonesia dan global.
Tugas Anda bukan memberi teori BMC generik, tetapi mengubah ide bisnis mentah menjadi keputusan praktis yang bisa dijalankan.

Aturan kualitas:
1. Jawab seluruh output dalam ${responseLanguage} yang jelas, konkret, dan actionable.
2. Setiap poin harus spesifik terhadap ide, lokasi, segmen, channel, harga, operasi, atau risiko yang disebut user.
3. Jangan memakai frasa kosong seperti "meningkatkan kualitas layanan" tanpa contoh tindakan.
4. Beri prioritas pada validasi pasar, unit economics, channel akuisisi, dan risiko operasional.
5. Berpikir seperti konsultan yang sedang membantu founder mengambil keputusan minggu ini, bukan seperti penulis artikel.
6. Kembalikan JSON valid saja, tanpa markdown di luar JSON.

${qualityContract}
`.trim();
}

function buildBmcMessages(idea, localDraft, options = {}) {
  const language = normalizeLanguage(options.language);
  const knowledge = options.knowledge?.summary || "";
  return [
    { role: "system", content: systemPrompt(language) },
    {
      role: "user",
      content: `
Buat Business Model Canvas untuk ide berikut:
"${idea}"

Gunakan draft lokal ini sebagai baseline, tetapi perbaiki agar lebih tajam dan tidak generik:
${JSON.stringify(localDraft, null, 2)}

Rujukan knowledge base kurasi jika tersedia:
${knowledge || "-"}

Jika memakai rujukan, rangkum insightnya. Jangan menyalin kutipan panjang.

Bahasa output wajib: ${language === "en" ? "English" : "Bahasa Indonesia"}.

${bmcBlockRules}

Sebelum menjawab, lakukan self-check internal:
1. Apakah setiap poin bisa langsung diuji atau dikerjakan?
2. Apakah ada harga/range harga, channel spesifik, eksperimen 7-30 hari, dan KPI?
3. Apakah ada frasa generik tanpa detail? Jika ada, ganti sebelum mengirim JSON.

Format JSON wajib:
{
  "title": "judul pendek maksimal 56 karakter",
  "sector": "kategori bisnis",
  "bmc": {
${blockContract}
  },
  "risks": [
    { "title": "...", "why": "...", "test": "...", "metric": "..." }
  ],
  "actionPlan": "rencana 30 hari dengan minggu 1-4, eksperimen utama, target angka, dan decision rule",
  "nextQuestions": ["...", "...", "..."]
}
`.trim()
    }
  ];
}

function buildChatMessages({ idea, bmc, risks, question, localAnswer, language: requestedLanguage, knowledge: requestedKnowledge }) {
  const language = normalizeLanguage(requestedLanguage);
  const knowledge = requestedKnowledge?.summary || "";
  return [
    { role: "system", content: systemPrompt(language) },
    {
      role: "user",
      content: `
Jawab pertanyaan user berdasarkan BMC berikut.

Ide bisnis:
${idea || "-"}

BMC:
${JSON.stringify(bmc || {}, null, 2)}

Risiko:
${JSON.stringify(risks || [], null, 2)}

Pertanyaan user:
"${question}"

Baseline jawaban lokal:
${localAnswer}

Rujukan knowledge base kurasi jika tersedia:
${knowledge || "-"}

Jika memakai rujukan, rangkum insightnya. Jangan menyalin kutipan panjang.

Bahasa output wajib: ${language === "en" ? "English" : "Bahasa Indonesia"}.

Aturan jawaban chat:
- Jawab pertanyaan user secara langsung, lalu beri langkah eksekusi.
- Jika user meminta refine salah satu blok BMC, berikan 4-6 opsi baru yang lebih spesifik daripada isi saat ini.
- Wajib sebut minimal satu eksperimen 7-30 hari, KPI, dan ambang keputusan jika pertanyaan terkait strategi, validasi, harga, channel, atau publikasi.
- Jangan menjawab dengan nasihat generik seperti "gunakan media sosial" tanpa menyebut channel, pesan, target, dan cara mengukur.
- Untuk pricing, berikan range harga awal atau paket hipotesis dan cara menguji willingness to pay.
- Untuk channel/publikasi, sebut kanal spesifik, contoh angle konten/cold message, target jumlah outreach/konten, dan metrik.

Format JSON wajib:
{
  "answer": "jawaban praktis 2-6 paragraf pendek atau daftar bernomor",
  "suggestions": ["pertanyaan lanjutan 1", "pertanyaan lanjutan 2", "pertanyaan lanjutan 3"]
}
`.trim()
    }
  ];
}

function normalizeLanguage(value) {
  return String(value || "").toLowerCase() === "en" ? "en" : "id";
}

module.exports = {
  buildBmcMessages,
  buildChatMessages
};
