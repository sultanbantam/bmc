const { blocks } = require("./localGenerator");

const blockContract = blocks.map((block) => `- ${block.key}: array 4-5 poin untuk ${block.title}`).join("\n");

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
5. Kembalikan JSON valid saja, tanpa markdown di luar JSON.
`.trim();
}

function buildBmcMessages(idea, localDraft, options = {}) {
  const language = normalizeLanguage(options.language);
  return [
    { role: "system", content: systemPrompt(language) },
    {
      role: "user",
      content: `
Buat Business Model Canvas untuk ide berikut:
"${idea}"

Gunakan draft lokal ini sebagai baseline, tetapi perbaiki agar lebih tajam dan tidak generik:
${JSON.stringify(localDraft, null, 2)}

Bahasa output wajib: ${language === "en" ? "English" : "Bahasa Indonesia"}.

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
  "actionPlan": "rencana 30 hari ringkas dengan minggu 1-4 dan metrik utama",
  "nextQuestions": ["...", "...", "..."]
}
`.trim()
    }
  ];
}

function buildChatMessages({ idea, bmc, risks, question, localAnswer, language: requestedLanguage }) {
  const language = normalizeLanguage(requestedLanguage);
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

Bahasa output wajib: ${language === "en" ? "English" : "Bahasa Indonesia"}.

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
