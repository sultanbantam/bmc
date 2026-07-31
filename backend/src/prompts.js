const { blocks } = require("./localGenerator");

function blockContractFor(language) {
  return blocks.map((block) => {
    const description = language === "en"
      ? `array of 4-5 points for ${block.title}`
      : `array 4-5 poin untuk ${block.title}`;
    return `- ${block.key}: ${description}`;
  }).join("\n");
}

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

const qualityContractId = `
Kontrak kualitas non-generik:
- Setiap poin BMC wajib berupa keputusan operasional, bukan slogan. Gunakan kata benda spesifik dari ide user.
- Jangan memakai frasa umum seperti "${genericPhrases}" kecuali langsung diberi detail: siapa targetnya, platform/komunitas mana, pesan apa, harga/angka, atau cara eksekusinya.
- Jika user tidak memberi angka, buat asumsi awal yang wajar dan tandai sebagai "asumsi awal" di dalam kalimat.
- Minimal 70% poin harus menyebut salah satu dari: segmen nyata, konteks penggunaan, kisaran harga, channel spesifik, aktivitas 7-30 hari, biaya, KPI, atau eksperimen validasi.
- Hindari poin yang bisa berlaku untuk semua bisnis. Jika satu poin tetap masuk akal untuk restoran, SaaS, wisata, dan kursus sekaligus, berarti poin itu terlalu umum dan harus dibuat ulang.
- Tulis ringkas tetapi padat: 12-32 kata per poin BMC.
`.trim();

const qualityContractEn = `
Non-generic quality contract:
- Every BMC point must be an operational decision, not a slogan. Use concrete nouns from the user's idea.
- Do not use generic phrases such as "${genericPhrases}" unless immediately paired with detail: exact target, platform/community, message, price/number, or execution method.
- If the user gives no numbers, create a reasonable starting assumption and label it as an "initial assumption" inside the sentence.
- At least 70% of points must mention one of these: real target segment, usage context, price range, specific channel, 7-30 day activity, cost, KPI, or validation experiment.
- Avoid points that could apply to any business. If a point still makes sense for a restaurant, SaaS, tourism, and education business at once, rewrite it.
- Keep points concise but dense: 12-32 words per BMC point.
`.trim();

const bmcBlockRulesId = `
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

const bmcBlockRulesEn = `
Rules for each BMC block:
- customerSegments: name real personas + situation/pain + how to find them. Avoid "early adopters" without definition.
- valuePropositions: state the specific pain, promised outcome, and difference from manual alternatives or competitors.
- channels: name concrete channels such as SEO keywords, communities, marketplaces, cold outreach, events, partners, or platforms; include the message/CTA to test.
- customerRelationships: state onboarding, follow-up, education, retention, or support flow with frequency, SLA, or trigger examples.
- revenueStreams: must include a pricing model or starting price range, package, commission, freemium, add-on, pre-order, or deposit rule.
- keyActivities: must include 7-30 day activities that can actually be done, not only "product development".
- keyResources: name real assets: data, content, SOPs, technology, team, lead lists, templates, community access, or working capital.
- keyPartnerships: name specific partner types and the value exchanged, not "strategic partners".
- costStructure: name real cost items and how to measure them; split fixed and variable costs if relevant.
- risks: each risk must include a hypothesis, business reason, 7-30 day validation experiment, and numeric KPI/decision threshold.
`.trim();

function systemPrompt(language = "id") {
  if (language === "en") {
    return `
You are a business mentor and product strategist for SMEs and early-stage founders in Indonesia and global markets.
Your job is not to explain generic BMC theory. Your job is to turn raw business ideas into practical decisions founders can execute.

Quality rules:
1. Write every output field entirely in English, even if the user writes in Indonesian or mixed language.
2. Every point must be specific to the user's idea, location, segment, channel, price, operations, or risk.
3. Do not use empty phrases such as "improve service quality" without concrete action.
4. Prioritize market validation, unit economics, acquisition channels, and operational risk.
5. Think like a consultant helping a founder decide what to do this week, not like an article writer.
6. Return valid JSON only, with no markdown outside the JSON.

${qualityContractEn}
`.trim();
  }

  return `
Anda adalah business mentor dan product strategist untuk UMKM/founder Indonesia dan global.
Tugas Anda bukan memberi teori BMC generik, tetapi mengubah ide bisnis mentah menjadi keputusan praktis yang bisa dijalankan.

Aturan kualitas:
1. Jawab seluruh output dalam Bahasa Indonesia yang jelas, konkret, dan actionable.
2. Setiap poin harus spesifik terhadap ide, lokasi, segmen, channel, harga, operasi, atau risiko yang disebut user.
3. Jangan memakai frasa kosong seperti "meningkatkan kualitas layanan" tanpa contoh tindakan.
4. Beri prioritas pada validasi pasar, unit economics, channel akuisisi, dan risiko operasional.
5. Berpikir seperti konsultan yang sedang membantu founder mengambil keputusan minggu ini, bukan seperti penulis artikel.
6. Kembalikan JSON valid saja, tanpa markdown di luar JSON.

${qualityContractId}
`.trim();
}

function buildBmcMessages(idea, localDraft, options = {}) {
  const language = normalizeLanguage(options.language);
  const knowledge = options.knowledge?.summary || "";
  const content = language === "en"
    ? buildBmcUserPromptEn(idea, localDraft, knowledge)
    : buildBmcUserPromptId(idea, localDraft, knowledge);

  return [
    { role: "system", content: systemPrompt(language) },
    { role: "user", content }
  ];
}

function buildBmcUserPromptId(idea, localDraft, knowledge) {
  return `
Buat Business Model Canvas untuk ide berikut:
"${idea}"

Gunakan draft lokal ini sebagai baseline, tetapi perbaiki agar lebih tajam dan tidak generik:
${JSON.stringify(localDraft, null, 2)}

Rujukan knowledge base kurasi jika tersedia:
${knowledge || "-"}

Jika memakai rujukan, rangkum insightnya. Jangan menyalin kutipan panjang.

Bahasa output wajib: Bahasa Indonesia.

${bmcBlockRulesId}

Sebelum menjawab, lakukan self-check internal:
1. Apakah setiap poin bisa langsung diuji atau dikerjakan?
2. Apakah ada harga/range harga, channel spesifik, eksperimen 7-30 hari, dan KPI?
3. Apakah ada frasa generik tanpa detail? Jika ada, ganti sebelum mengirim JSON.

Format JSON wajib:
{
  "title": "judul pendek maksimal 56 karakter",
  "sector": "kategori bisnis",
  "bmc": {
${blockContractFor("id")}
  },
  "risks": [
    { "title": "...", "why": "...", "test": "...", "metric": "..." }
  ],
  "actionPlan": "rencana 30 hari dengan minggu 1-4, eksperimen utama, target angka, dan decision rule",
  "nextQuestions": ["...", "...", "..."]
}
`.trim();
}

function buildBmcUserPromptEn(idea, localDraft, knowledge) {
  return `
Create a Business Model Canvas for this idea:
"${idea}"

Use this local draft as a baseline, but sharpen it so it becomes specific and non-generic:
${JSON.stringify(localDraft, null, 2)}

Curated knowledge base references if available:
${knowledge || "-"}

If you use references, summarize the insight. Do not copy long quotes.

Required output language: English. This is mandatory even if the user's idea is written in Indonesian.

${bmcBlockRulesEn}

Before answering, do an internal self-check:
1. Can every point be tested or executed directly?
2. Are there price/range, specific channels, 7-30 day experiments, and KPIs?
3. Is there any generic phrase without details? If yes, rewrite it before sending JSON.

Required JSON format:
{
  "title": "short title, maximum 56 characters, in English",
  "sector": "business category in English",
  "bmc": {
${blockContractFor("en")}
  },
  "risks": [
    { "title": "...", "why": "...", "test": "...", "metric": "..." }
  ],
  "actionPlan": "30-day plan with weeks 1-4, main experiment, target numbers, and decision rule",
  "nextQuestions": ["...", "...", "..."]
}
`.trim();
}

function buildChatMessages({ idea, bmc, risks, question, localAnswer, language: requestedLanguage, knowledge: requestedKnowledge }) {
  const language = normalizeLanguage(requestedLanguage);
  const knowledge = requestedKnowledge?.summary || "";
  const content = language === "en"
    ? buildChatUserPromptEn({ idea, bmc, risks, question, localAnswer, knowledge })
    : buildChatUserPromptId({ idea, bmc, risks, question, localAnswer, knowledge });

  return [
    { role: "system", content: systemPrompt(language) },
    { role: "user", content }
  ];
}

function buildChatUserPromptId({ idea, bmc, risks, question, localAnswer, knowledge }) {
  return `
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

Bahasa output wajib: Bahasa Indonesia.

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
`.trim();
}

function buildChatUserPromptEn({ idea, bmc, risks, question, localAnswer, knowledge }) {
  return `
Answer the user's question based on this BMC.

Business idea:
${idea || "-"}

BMC:
${JSON.stringify(bmc || {}, null, 2)}

Risks:
${JSON.stringify(risks || [], null, 2)}

User question:
"${question}"

Local baseline answer:
${localAnswer}

Curated knowledge base references if available:
${knowledge || "-"}

If you use references, summarize the insight. Do not copy long quotes.

Required output language: English. This is mandatory even if the user's question is written in Indonesian.

Chat answer rules:
- Answer the user's question directly, then give execution steps.
- If the user asks to refine a BMC block, provide 4-6 new options that are more specific than the current content.
- Mention at least one 7-30 day experiment, KPI, and decision threshold if the question relates to strategy, validation, pricing, channels, or publishing.
- Do not give generic advice such as "use social media" without naming the channel, message, target, and measurement method.
- For pricing, give an initial price range or package hypothesis and a way to test willingness to pay.
- For channels/publishing, name specific channels, sample content angle or cold message, target outreach/content volume, and metrics.

Required JSON format:
{
  "answer": "practical answer in 2-6 short paragraphs or a numbered list",
  "suggestions": ["follow-up question 1", "follow-up question 2", "follow-up question 3"]
}
`.trim();
}

function buildInvestorProposalMessages({ idea, bmc, risks, assumptions, language: requestedLanguage, knowledge: requestedKnowledge }) {
  const language = normalizeLanguage(requestedLanguage);
  const knowledge = requestedKnowledge?.summary || "";
  const content = language === "en"
    ? buildInvestorProposalPromptEn({ idea, bmc, risks, assumptions, knowledge })
    : buildInvestorProposalPromptId({ idea, bmc, risks, assumptions, knowledge });

  return [
    { role: "system", content: systemPrompt(language) },
    { role: "user", content }
  ];
}

function buildInvestorProposalPromptId({ idea, bmc, risks, assumptions, knowledge }) {
  return `
Ubah BMC berikut menjadi proposal bisnis untuk diskusi calon investor.

Ide bisnis:
${idea || "-"}

BMC:
${JSON.stringify(bmc || {}, null, 2)}

Risiko/asumsi:
${JSON.stringify(risks || [], null, 2)}

Data investor dari founder:
${JSON.stringify(assumptions || {}, null, 2)}

Rujukan knowledge base kurasi jika tersedia:
${knowledge || "-"}

Bahasa output wajib: Bahasa Indonesia.

Aturan proposal investor:
- Jangan mengarang traction. Pisahkan data nyata, asumsi, dan gap data.
- Wajib spesifik ke ide bisnis user, segmen target nyata, channel akuisisi konkret, pricing/range harga, eksperimen 7-30 hari, KPI, dan decision rule.
- Jangan memakai kalimat umum seperti "media sosial", "pengguna awal", "meningkatkan efisiensi", atau "konten edukasi" tanpa detail target, kanal, pesan, angka, dan cara ukur.
- Jika angka belum ada, tulis sebagai asumsi awal dan jelaskan bukti apa yang harus dikumpulkan.
- Proposal harus bisa langsung dipakai founder sebagai draft diskusi investor awal.

Format JSON wajib:
{
  "title": "judul proposal pendek",
  "readinessScore": 0,
  "readinessSummary": "ringkasan kesiapan investor",
  "scoreBreakdown": [
    { "label": "Kejelasan BMC", "score": 0, "note": "catatan" }
  ],
  "financials": [
    { "label": "Target pendanaan", "value": "..." }
  ],
  "evidence": ["bukti/gap data 1"],
  "sections": [
    { "title": "1. Ringkasan Eksekutif", "paragraphs": ["..."], "bullets": ["..."] }
  ]
}
`.trim();
}

function buildInvestorProposalPromptEn({ idea, bmc, risks, assumptions, knowledge }) {
  return `
Turn the following BMC into an investor-facing business proposal.

Business idea:
${idea || "-"}

BMC:
${JSON.stringify(bmc || {}, null, 2)}

Risks/assumptions:
${JSON.stringify(risks || [], null, 2)}

Founder investor data:
${JSON.stringify(assumptions || {}, null, 2)}

Curated knowledge base references if available:
${knowledge || "-"}

Required output language: English. This is mandatory even if the user wrote in Indonesian.

Investor proposal rules:
- Do not invent traction. Separate real data, assumptions, and data gaps.
- Be specific to the user's business idea, real target segments, concrete acquisition channels, pricing/range, 7-30 day experiments, KPIs, and decision rules.
- Do not use generic phrases such as "social media", "early adopters", "improve efficiency", or "educational content" without target, channel, message, number, and measurement detail.
- If numbers are missing, label them as initial assumptions and state what evidence must be collected.
- The proposal should be usable as an early investor discussion draft.

Required JSON format:
{
  "title": "short proposal title",
  "readinessScore": 0,
  "readinessSummary": "investor readiness summary",
  "scoreBreakdown": [
    { "label": "BMC clarity", "score": 0, "note": "note" }
  ],
  "financials": [
    { "label": "Funding ask", "value": "..." }
  ],
  "evidence": ["evidence/data gap 1"],
  "sections": [
    { "title": "1. Executive Summary", "paragraphs": ["..."], "bullets": ["..."] }
  ]
}
`.trim();
}
function normalizeLanguage(value) {
  return String(value || "").toLowerCase() === "en" ? "en" : "id";
}

module.exports = {
  buildBmcMessages,
  buildChatMessages
};
