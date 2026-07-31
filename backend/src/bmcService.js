const { generateLocalBmc, answerLocalChat, blocks } = require("./localGenerator");
const { buildBmcMessages, buildChatMessages, buildInvestorProposalMessages } = require("./prompts");
const { buildKnowledgeContext } = require("./knowledgeStore");

const requiredBmcKeys = blocks.map((block) => block.key);

async function generateBmc(idea, options = {}) {
  const language = normalizeLanguage(options.language);
  const knowledge = buildKnowledgeContext(idea, { language, limit: 4 });
  const localDraft = attachKnowledge(generateLocalBmc(idea, { language }), knowledge, language);

  if (!process.env.OPENAI_API_KEY) {
    return localDraft;
  }

  try {
    const aiDraft = await callOpenAiJson(buildBmcMessages(idea, localDraft, { language, knowledge }));
    return normalizeBmcResponse(aiDraft, localDraft);
  } catch (error) {
    if (process.env.AI_FALLBACK_TO_LOCAL === "false") {
      throw error;
    }

    return {
      ...localDraft,
      warning: language === "en"
        ? "OpenAI is unavailable or returned an invalid response, so the backend used the local fallback."
        : "OpenAI tidak tersedia atau respons tidak valid, jadi backend memakai fallback lokal.",
      debug: process.env.NODE_ENV === "production" ? undefined : error.message
    };
  }
}

async function chatBmc({ idea, bmc, risks, question, language: requestedLanguage }) {
  const language = normalizeLanguage(requestedLanguage);
  const cleanQuestion = String(question || "").trim();
  if (!cleanQuestion) {
    const error = new Error(language === "en" ? "Question is required." : "Pertanyaan wajib diisi.");
    error.status = 400;
    throw error;
  }

  const knowledge = buildKnowledgeContext(`${idea || ""}\n${cleanQuestion}`, { language, limit: 4 });
  const localAnswer = withKnowledgeAnswer(answerLocalChat({ idea, bmc, risks, question: cleanQuestion, language }), knowledge, language);

  if (!process.env.OPENAI_API_KEY) {
    return {
      source: "local",
      answer: localAnswer,
      suggestions: [
        ...(language === "en"
          ? ["What are the first 30-day actions?", "Which assumption is riskiest?", "How should I test pricing?"]
          : ["Apa langkah 30 hari pertama?", "Asumsi mana yang paling berisiko?", "Bagaimana cara menguji harga?"])
      ]
    };
  }

  try {
    const aiAnswer = await callOpenAiJson(buildChatMessages({ idea, bmc, risks, question: cleanQuestion, localAnswer, language, knowledge }));
    return {
      source: "openai",
      answer: String(aiAnswer.answer || localAnswer).trim(),
      suggestions: normalizeStringArray(aiAnswer.suggestions, [
        ...(language === "en"
          ? ["What is the cheapest validation experiment?", "Which channel should be prioritized?", "How do I calculate cost and margin?"]
          : ["Apa eksperimen validasi paling murah?", "Channel mana yang harus diprioritaskan?", "Bagaimana menghitung HPP dan margin?"])
      ], 3)
    };
  } catch (error) {
    if (process.env.AI_FALLBACK_TO_LOCAL === "false") {
      throw error;
    }

    return {
      source: "local",
      answer: localAnswer,
      warning: language === "en"
        ? "OpenAI is unavailable or returned an invalid response, so the backend used the local fallback."
        : "OpenAI tidak tersedia atau respons tidak valid, jadi backend memakai fallback lokal.",
      debug: process.env.NODE_ENV === "production" ? undefined : error.message
    };
  }
}

async function generateInvestorProposal({ idea, bmc, risks, assumptions, language: requestedLanguage }) {
  const language = normalizeLanguage(requestedLanguage);
  const cleanIdea = String(idea || "").trim();
  if (!cleanIdea) {
    const error = new Error(language === "en" ? "Business idea is required." : "Ide bisnis wajib diisi.");
    error.status = 400;
    throw error;
  }

  const localBmc = generateLocalBmc(cleanIdea, { language });
  const safeBmc = bmc && typeof bmc === "object" ? bmc : localBmc.bmc;
  const safeRisks = Array.isArray(risks) && risks.length ? risks : localBmc.risks;
  const cleanAssumptions = sanitizeAssumptions(assumptions);
  const knowledge = buildKnowledgeContext(`${cleanIdea}\n${JSON.stringify(cleanAssumptions)}`, { language, limit: 4 });
  const localDraft = buildLocalInvestorProposal({ idea: cleanIdea, bmc: safeBmc, risks: safeRisks, assumptions: cleanAssumptions, language });

  if (!process.env.OPENAI_API_KEY) return localDraft;

  try {
    const aiDraft = await callOpenAiJson(buildInvestorProposalMessages({
      idea: cleanIdea,
      bmc: safeBmc,
      risks: safeRisks,
      assumptions: cleanAssumptions,
      language,
      knowledge
    }));
    return normalizeInvestorProposalResponse(aiDraft, localDraft);
  } catch (error) {
    if (process.env.AI_FALLBACK_TO_LOCAL === "false") throw error;
    return {
      ...localDraft,
      source: "local",
      warning: language === "en"
        ? "OpenAI is unavailable or returned an invalid response, so the backend used the local investor proposal fallback."
        : "OpenAI tidak tersedia atau respons tidak valid, jadi backend memakai fallback proposal investor lokal.",
      debug: process.env.NODE_ENV === "production" ? undefined : error.message
    };
  }
}
function attachKnowledge(draft, knowledge, language) {
  if (!knowledge.matches.length) return draft;
  const note = language === "en"
    ? `Curated knowledge used: ${knowledge.matches.map((item) => item.title).join(", ")}.`
    : `Knowledge kurasi digunakan: ${knowledge.matches.map((item) => item.title).join(", ")}.`;
  const keyResources = Array.isArray(draft.bmc?.keyResources) ? draft.bmc.keyResources : [];
  const keyActivities = Array.isArray(draft.bmc?.keyActivities) ? draft.bmc.keyActivities : [];

  return {
    ...draft,
    knowledge: knowledge.matches,
    bmc: {
      ...draft.bmc,
      keyResources: [note, ...keyResources].slice(0, 5),
      keyActivities: [
        language === "en"
          ? "Review relevant curated references before validating the riskiest assumptions."
          : "Tinjau rujukan kurasi yang relevan sebelum menguji asumsi paling berisiko.",
        ...keyActivities
      ].slice(0, 5)
    }
  };
}

function withKnowledgeAnswer(answer, knowledge, language) {
  if (!knowledge.matches.length) return answer;
  const heading = language === "en" ? "Relevant curated references" : "Rujukan kurasi relevan";
  const references = knowledge.matches
    .slice(0, 3)
    .map((item, index) => `${index + 1}. ${item.title}: ${item.snippet}`)
    .join("\n");
  return `${answer}\n\n${heading}:\n${references}`;
}
function normalizeLanguage(value) {
  return String(value || "").toLowerCase() === "en" ? "en" : "id";
}

async function callOpenAiJson(messages) {
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const temperature = Number(process.env.OPENAI_TEMPERATURE || 0.35);

  const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      response_format: { type: "json_object" }
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || `OpenAI request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI response has no message content.");
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`OpenAI returned invalid JSON: ${error.message}`);
  }
}

function normalizeBmcResponse(aiDraft, fallback) {
  const bmc = {};
  requiredBmcKeys.forEach((key) => {
    bmc[key] = normalizeStringArray(aiDraft?.bmc?.[key], fallback.bmc[key], 5);
  });

  return {
    title: String(aiDraft?.title || fallback.title).trim().slice(0, 80),
    idea: fallback.idea,
    sector: String(aiDraft?.sector || fallback.sector).trim(),
    source: "openai",
    bmc,
    risks: normalizeRisks(aiDraft?.risks, fallback.risks),
    actionPlan: String(aiDraft?.actionPlan || fallback.actionPlan).trim(),
    nextQuestions: normalizeStringArray(aiDraft?.nextQuestions, fallback.nextQuestions, 3)
  };
}

function normalizeStringArray(value, fallback, max = 5) {
  const source = Array.isArray(value) ? value : [];
  const cleaned = source
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, max);

  if (cleaned.length) return cleaned;
  return (fallback || []).slice(0, max);
}

function normalizeRisks(value, fallback) {
  const source = Array.isArray(value) ? value : [];
  const cleaned = source
    .map((risk) => ({
      title: String(risk?.title || "").trim(),
      why: String(risk?.why || "").trim(),
      test: String(risk?.test || "").trim(),
      metric: String(risk?.metric || "").trim()
    }))
    .filter((risk) => risk.title && risk.why && risk.test)
    .slice(0, 3);

  return cleaned.length ? cleaned : fallback;
}

function sanitizeAssumptions(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    fundingAsk: String(source.fundingAsk || "").trim(),
    currentRevenue: String(source.currentRevenue || "").trim(),
    productPrice: String(source.productPrice || "").trim(),
    grossMargin: String(source.grossMargin || "").trim(),
    monthlyCustomers: String(source.monthlyCustomers || "").trim(),
    tractionEvidence: String(source.tractionEvidence || "").trim(),
    useOfFunds: String(source.useOfFunds || "").trim(),
    milestones: String(source.milestones || "").trim()
  };
}

function buildLocalInvestorProposal({ bmc, risks, assumptions, language }) {
  const en = language === "en";
  const scoreData = calculateProposalScore(bmc, assumptions, language);
  const customer = firstBmcItem(bmc, "customerSegments", en ? "Not provided yet" : "Belum diisi");
  const value = firstBmcItem(bmc, "valuePropositions", en ? "Not provided yet" : "Belum diisi");
  const channel = firstBmcItem(bmc, "channels", en ? "Not provided yet" : "Belum diisi");
  const revenue = firstBmcItem(bmc, "revenueStreams", en ? "Not provided yet" : "Belum diisi");
  const cost = firstBmcItem(bmc, "costStructure", en ? "Not provided yet" : "Belum diisi");
  const risk = Array.isArray(risks) && risks[0] ? risks[0] : {};
  const noData = en ? "Not provided yet" : "Belum diisi";
  const title = en ? "Investor Proposal - Business Plan" : "Proposal Investor - Rencana Bisnis";
  const readinessSummary = scoreData.score >= 80
    ? (en ? "Ready for an early investor conversation, pending verified traction and unit economics." : "Siap untuk diskusi investor awal, dengan catatan traction dan unit economics tetap perlu diverifikasi.")
    : scoreData.score >= 55
      ? (en ? "Direction is visible, but evidence for demand, pricing, and milestones needs strengthening." : "Arah bisnis sudah terlihat, tetapi bukti demand, pricing, dan milestone perlu diperkuat.")
      : (en ? "Several investor-critical assumptions are still missing." : "Beberapa asumsi penting untuk investor masih kosong.");

  const financials = buildProposalFinancials(assumptions, language);
  const evidence = buildProposalEvidence(assumptions, language);
  const sections = en ? [
    { title: "1. Executive Summary", paragraphs: ["This is an investor discussion draft based on the current BMC and founder-provided assumptions."], bullets: [`Initial target segment: ${customer}`, `Core value proposition: ${value}`, `Funding ask: ${assumptions.fundingAsk || noData}`] },
    { title: "2. Market and Customer", paragraphs: ["The first market should be narrow, reachable, and measurable before scaling acquisition."], bullets: [`Segment to validate: ${customer}`, `First acquisition channel: ${channel}`, "7-day test: interview 15 target users and record pain, workaround, budget, and buying trigger."] },
    { title: "3. Business Model and Pricing", paragraphs: ["The business model should start with one paid offer and visible cost assumptions."], bullets: [`Pricing hypothesis: ${assumptions.productPrice || revenue}`, `Gross margin: ${assumptions.grossMargin || noData}`, `Key cost item: ${cost}`, "30-day test: ask 20 prospects to choose entry/pro/premium packages and target 3 paid commitments or deposits."] },
    { title: "4. Go-To-Market and KPIs", paragraphs: ["Founder-led acquisition should precede automated campaigns so objections are visible."], bullets: [`Channel 1: ${channel}`, "Channel 2: direct outreach to 30 named prospects from communities, LinkedIn, WhatsApp groups, or partner lists.", "KPI: lead conversion above 8%, reply rate above 15%, and at least 5 qualified conversations in 14 days."] },
    { title: "5. Risks, Use of Funds, and Milestones", paragraphs: ["Funding should be tied to measurable milestones and de-risking actions."], bullets: [`Main risk: ${risk.title || noData}`, `Validation test: ${risk.test || "Run a 7-30 day pilot with conversion, willingness-to-pay, and delivery quality metrics."}`, `Use of funds: ${assumptions.useOfFunds || noData}`, `Milestones: ${assumptions.milestones || noData}`] }
  ] : [
    { title: "1. Ringkasan Eksekutif", paragraphs: ["Ini adalah draft diskusi investor berdasarkan BMC saat ini dan asumsi yang diberikan founder."], bullets: [`Segmen awal: ${customer}`, `Value proposition inti: ${value}`, `Target pendanaan: ${assumptions.fundingAsk || noData}`] },
    { title: "2. Pasar dan Pelanggan", paragraphs: ["Pasar pertama harus sempit, mudah dijangkau, dan bisa diukur sebelum akuisisi diskalakan."], bullets: [`Segmen yang divalidasi: ${customer}`, `Channel pertama: ${channel}`, "Tes 7 hari: wawancarai 15 target user dan catat pain, solusi saat ini, budget, serta trigger pembelian."] },
    { title: "3. Model Bisnis dan Pricing", paragraphs: ["Model bisnis sebaiknya dimulai dari satu penawaran berbayar dan asumsi biaya yang terlihat."], bullets: [`Hipotesis harga: ${assumptions.productPrice || revenue}`, `Gross margin: ${assumptions.grossMargin || noData}`, `Pos biaya utama: ${cost}`, "Tes 30 hari: minta 20 prospek memilih paket entry/pro/premium dan targetkan 3 komitmen bayar atau DP."] },
    { title: "4. Go-To-Market dan KPI", paragraphs: ["Akuisisi founder-led perlu dilakukan sebelum kampanye otomatis agar keberatan pasar terlihat jelas."], bullets: [`Channel 1: ${channel}`, "Channel 2: outreach ke 30 prospek bernama dari komunitas, LinkedIn, grup WhatsApp, atau daftar partner.", "KPI: lead conversion di atas 8%, reply rate di atas 15%, dan minimal 5 percakapan qualified dalam 14 hari."] },
    { title: "5. Risiko, Use of Funds, dan Milestone", paragraphs: ["Pendanaan harus terhubung ke milestone terukur dan aksi pengurangan risiko."], bullets: [`Risiko utama: ${risk.title || noData}`, `Cara validasi: ${risk.test || "Jalankan pilot 7-30 hari dengan metrik conversion, willingness to pay, dan kualitas delivery."}`, `Use of funds: ${assumptions.useOfFunds || noData}`, `Milestone: ${assumptions.milestones || noData}`] }
  ];

  return { title, source: "local", readinessScore: scoreData.score, readinessSummary, scoreBreakdown: scoreData.breakdown, financials, evidence, sections };
}
function calculateProposalScore(bmc, assumptions, language) {
  const noData = language === "en" ? "Not provided yet" : "Belum diisi";
  const bmcCompleteness = requiredBmcKeys.filter((key) => Array.isArray(bmc?.[key]) && bmc[key].length >= 3).length;
  const bmcScore = Math.round((bmcCompleteness / requiredBmcKeys.length) * 20);
  const breakdown = [
    { label: language === "en" ? "BMC clarity" : "Kejelasan BMC", score: bmcScore, note: `${bmcCompleteness}/9` },
    { label: language === "en" ? "Funding ask" : "Target pendanaan", score: assumptions.fundingAsk ? 12 : 0, note: assumptions.fundingAsk || noData },
    { label: language === "en" ? "Pricing and margin" : "Pricing dan margin", score: (assumptions.productPrice ? 8 : 0) + (assumptions.grossMargin ? 8 : 0), note: [assumptions.productPrice, assumptions.grossMargin].filter(Boolean).join("; ") || noData },
    { label: language === "en" ? "Traction" : "Traction", score: (assumptions.currentRevenue ? 8 : 0) + (assumptions.monthlyCustomers ? 6 : 0) + (assumptions.tractionEvidence ? 10 : 0), note: assumptions.tractionEvidence || assumptions.currentRevenue || noData },
    { label: language === "en" ? "Use of funds" : "Use of funds", score: assumptions.useOfFunds ? 14 : 0, note: assumptions.useOfFunds || noData },
    { label: language === "en" ? "Milestones and KPIs" : "Milestone dan KPI", score: assumptions.milestones ? 12 : 0, note: assumptions.milestones || noData }
  ];
  return { score: clampScore(breakdown.reduce((sum, item) => sum + item.score, 0)), breakdown };
}

function firstBmcItem(bmc, key, fallback) {
  const items = Array.isArray(bmc?.[key]) ? bmc[key] : [];
  return String(items[0] || fallback).trim();
}

function buildProposalFinancials(assumptions, language) {
  const noData = language === "en" ? "Not provided yet" : "Belum diisi";
  const labels = language === "en"
    ? ["Funding ask", "Current revenue", "Price/package", "Gross margin", "Monthly customers"]
    : ["Target pendanaan", "Revenue saat ini", "Harga/paket", "Gross margin", "Pelanggan/bulan"];
  const values = [assumptions.fundingAsk, assumptions.currentRevenue, assumptions.productPrice, assumptions.grossMargin, assumptions.monthlyCustomers];
  return labels.map((label, index) => ({ label, value: values[index] || noData }));
}

function buildProposalEvidence(assumptions, language) {
  const noData = language === "en" ? "Not provided yet" : "Belum diisi";
  return language === "en"
    ? [
        `Revenue evidence: ${assumptions.currentRevenue || noData}`,
        `Customer/usage evidence: ${assumptions.monthlyCustomers || noData}`,
        `Traction proof: ${assumptions.tractionEvidence || noData}`,
        "Next 30-day evidence: paid commitments, activation rate, repeat usage, testimonials, and delivery cost data."
      ]
    : [
        `Bukti revenue: ${assumptions.currentRevenue || noData}`,
        `Bukti pelanggan/penggunaan: ${assumptions.monthlyCustomers || noData}`,
        `Bukti traction: ${assumptions.tractionEvidence || noData}`,
        "Bukti 30 hari berikutnya: komitmen bayar, activation rate, repeat usage, testimoni, dan data biaya delivery."
      ];
}

function normalizeInvestorProposalResponse(aiDraft, fallback) {
  return {
    title: String(aiDraft?.title || fallback.title).trim().slice(0, 100),
    source: "openai",
    readinessScore: clampScore(aiDraft?.readinessScore ?? fallback.readinessScore),
    readinessSummary: String(aiDraft?.readinessSummary || fallback.readinessSummary).trim(),
    scoreBreakdown: normalizeScoreBreakdown(aiDraft?.scoreBreakdown, fallback.scoreBreakdown),
    financials: normalizeLabelValueList(aiDraft?.financials, fallback.financials),
    evidence: normalizeStringArray(aiDraft?.evidence, fallback.evidence, 8),
    sections: normalizeProposalSections(aiDraft?.sections, fallback.sections)
  };
}

function normalizeProposalSections(value, fallback) {
  const cleaned = (Array.isArray(value) ? value : [])
    .map((section) => ({
      title: String(section?.title || "").trim(),
      paragraphs: normalizeStringArray(section?.paragraphs, [], 5),
      bullets: normalizeStringArray(section?.bullets, [], 10)
    }))
    .filter((section) => section.title && (section.paragraphs.length || section.bullets.length))
    .slice(0, 10);
  return cleaned.length ? cleaned : fallback;
}

function normalizeScoreBreakdown(value, fallback) {
  const cleaned = (Array.isArray(value) ? value : [])
    .map((item) => ({
      label: String(item?.label || "").trim(),
      score: clampScore(item?.score ?? 0),
      note: String(item?.note || "").trim()
    }))
    .filter((item) => item.label)
    .slice(0, 8);
  return cleaned.length ? cleaned : fallback;
}

function normalizeLabelValueList(value, fallback) {
  const cleaned = (Array.isArray(value) ? value : [])
    .map((item) => ({
      label: String(item?.label || "").trim(),
      value: String(item?.value || "").trim()
    }))
    .filter((item) => item.label && item.value)
    .slice(0, 10);
  return cleaned.length ? cleaned : fallback;
}

function clampScore(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}
module.exports = {
  generateBmc,
  chatBmc,
  generateInvestorProposal
};
