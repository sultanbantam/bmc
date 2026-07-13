const { generateLocalBmc, answerLocalChat, blocks } = require("./localGenerator");
const { buildBmcMessages, buildChatMessages } = require("./prompts");

const requiredBmcKeys = blocks.map((block) => block.key);

async function generateBmc(idea) {
  const localDraft = generateLocalBmc(idea);

  if (!process.env.OPENAI_API_KEY) {
    return localDraft;
  }

  try {
    const aiDraft = await callOpenAiJson(buildBmcMessages(idea, localDraft));
    return normalizeBmcResponse(aiDraft, localDraft);
  } catch (error) {
    if (process.env.AI_FALLBACK_TO_LOCAL === "false") {
      throw error;
    }

    return {
      ...localDraft,
      warning: "OpenAI tidak tersedia atau respons tidak valid, jadi backend memakai fallback lokal.",
      debug: process.env.NODE_ENV === "production" ? undefined : error.message
    };
  }
}

async function chatBmc({ idea, bmc, risks, question }) {
  const cleanQuestion = String(question || "").trim();
  if (!cleanQuestion) {
    const error = new Error("Pertanyaan wajib diisi.");
    error.status = 400;
    throw error;
  }

  const localAnswer = answerLocalChat({ idea, bmc, risks, question: cleanQuestion });

  if (!process.env.OPENAI_API_KEY) {
    return {
      source: "local",
      answer: localAnswer,
      suggestions: [
        "Apa langkah 30 hari pertama?",
        "Asumsi mana yang paling berisiko?",
        "Bagaimana cara menguji harga?"
      ]
    };
  }

  try {
    const aiAnswer = await callOpenAiJson(buildChatMessages({ idea, bmc, risks, question: cleanQuestion, localAnswer }));
    return {
      source: "openai",
      answer: String(aiAnswer.answer || localAnswer).trim(),
      suggestions: normalizeStringArray(aiAnswer.suggestions, [
        "Apa eksperimen validasi paling murah?",
        "Channel mana yang harus diprioritaskan?",
        "Bagaimana menghitung HPP dan margin?"
      ], 3)
    };
  } catch (error) {
    if (process.env.AI_FALLBACK_TO_LOCAL === "false") {
      throw error;
    }

    return {
      source: "local",
      answer: localAnswer,
      warning: "OpenAI tidak tersedia atau respons tidak valid, jadi backend memakai fallback lokal.",
      debug: process.env.NODE_ENV === "production" ? undefined : error.message
    };
  }
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

module.exports = {
  generateBmc,
  chatBmc
};
