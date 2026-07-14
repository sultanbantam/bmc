const { generateLocalBmc, answerLocalChat, blocks } = require("./localGenerator");
const { buildBmcMessages, buildChatMessages } = require("./prompts");
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

module.exports = {
  generateBmc,
  chatBmc
};
