const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dataDir = process.env.BMC_DATA_DIR || path.join(__dirname, "..", "data");
const storePath = path.join(dataDir, "knowledge.json");

function listKnowledgeSources() {
  const store = readStore();
  return store.sources
    .map((source) => ({
      id: source.id,
      title: source.title,
      author: source.author,
      year: source.year,
      language: source.language,
      tags: source.tags,
      fileName: source.fileName,
      chunks: store.chunks.filter((chunk) => chunk.sourceId === source.id).length,
      createdAt: source.createdAt
    }))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

function uploadKnowledgeSource(payload = {}) {
  const title = clean(payload.title) || clean(payload.fileName) || "Untitled source";
  const content = clean(payload.content);
  if (!content || content.length < 80) {
    const error = new Error("Konten knowledge wajib diisi minimal 80 karakter.");
    error.status = 400;
    throw error;
  }

  const store = readStore();
  const source = {
    id: createId("src"),
    title,
    author: clean(payload.author),
    year: clean(payload.year),
    language: normalizeLanguage(payload.language),
    tags: normalizeTags(payload.tags),
    fileName: clean(payload.fileName),
    createdAt: new Date().toISOString()
  };
  const chunks = chunkText(content).map((chunk, index) => ({
    id: createId("chk"),
    sourceId: source.id,
    index,
    text: chunk,
    normalized: normalizeText(chunk),
    tags: source.tags,
    language: source.language,
    createdAt: source.createdAt
  }));

  store.sources.push(source);
  store.chunks.push(...chunks);
  writeStore(store);

  return { source, chunks: chunks.length };
}

function searchKnowledge(query, options = {}) {
  const cleanQuery = clean(query);
  if (!cleanQuery) return [];

  const store = readStore();
  const queryTerms = terms(cleanQuery);
  const requestedLanguage = normalizeLanguage(options.language);
  const requestedTags = normalizeTags(options.tags);
  const limit = Math.max(1, Math.min(Number(options.limit || 5), 12));
  const sourceById = new Map(store.sources.map((source) => [source.id, source]));

  return store.chunks
    .map((chunk) => {
      const source = sourceById.get(chunk.sourceId);
      if (!source) return null;
      const chunkTerms = new Set(terms(chunk.normalized || chunk.text));
      const normalized = chunk.normalized || normalizeText(chunk.text);
      const termScore = queryTerms.reduce((score, term) => score + (chunkTerms.has(term) ? 3 : normalized.includes(term) ? 1 : 0), 0);
      const tagScore = requestedTags.reduce((score, tag) => score + (chunk.tags.includes(tag) ? 2 : 0), 0);
      const languageScore = chunk.language === requestedLanguage ? 1 : 0;
      const score = termScore + tagScore + languageScore;
      if (score <= 0) return null;
      return {
        score,
        chunkId: chunk.id,
        sourceId: source.id,
        title: source.title,
        author: source.author,
        year: source.year,
        language: source.language,
        tags: chunk.tags,
        snippet: makeSnippet(chunk.text, queryTerms)
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function buildKnowledgeContext(query, options = {}) {
  const matches = searchKnowledge(query, options);
  if (!matches.length) return { matches, summary: "" };

  const summary = matches
    .map((match, index) => {
      const source = [match.title, match.author, match.year].filter(Boolean).join(", ");
      return `${index + 1}. ${source}: ${match.snippet}`;
    })
    .join("\n");

  return { matches, summary };
}

function readStore() {
  ensureStore();
  try {
    const parsed = JSON.parse(fs.readFileSync(storePath, "utf8"));
    return {
      sources: Array.isArray(parsed.sources) ? parsed.sources : [],
      chunks: Array.isArray(parsed.chunks) ? parsed.chunks : []
    };
  } catch {
    return { sources: [], chunks: [] };
  }
}

function writeStore(store) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(storePath, `${JSON.stringify(store, null, 2)}\n`);
}

function ensureStore() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(storePath)) writeStore({ sources: [], chunks: [] });
}

function chunkText(value) {
  const paragraphs = clean(value)
    .split(/\n{2,}/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const chunks = [];
  let current = "";
  paragraphs.forEach((paragraph) => {
    if ((current + " " + paragraph).trim().length > 1400 && current.length > 0) {
      chunks.push(current.trim());
      current = paragraph;
      return;
    }
    current = `${current} ${paragraph}`.trim();
  });
  if (current) chunks.push(current.trim());

  if (chunks.length) return chunks;
  const fallback = clean(value);
  return fallback.match(/.{1,1200}(\s|$)/g)?.map((item) => item.trim()).filter(Boolean) || [];
}

function makeSnippet(text, queryTerms) {
  const compact = text.replace(/\s+/g, " ").trim();
  const lower = compact.toLowerCase();
  const firstHit = queryTerms.map((term) => lower.indexOf(term)).filter((index) => index >= 0).sort((a, b) => a - b)[0] || 0;
  const start = Math.max(0, firstHit - 120);
  const snippet = compact.slice(start, start + 420);
  return `${start > 0 ? "..." : ""}${snippet}${start + 420 < compact.length ? "..." : ""}`;
}

function terms(value) {
  return normalizeText(value)
    .split(" ")
    .filter((term) => term.length >= 3)
    .filter((term) => !stopWords.has(term))
    .slice(0, 40);
}

function normalizeText(value) {
  return clean(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTags(value) {
  const source = Array.isArray(value) ? value : String(value || "").split(",");
  return source
    .map((tag) => clean(tag).toLowerCase().replace(/\s+/g, "-"))
    .filter(Boolean)
    .slice(0, 12);
}

function normalizeLanguage(value) {
  return String(value || "").toLowerCase() === "en" ? "en" : "id";
}

function clean(value) {
  return String(value || "").trim();
}

function createId(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

const stopWords = new Set([
  "dan",
  "atau",
  "yang",
  "untuk",
  "dengan",
  "dari",
  "pada",
  "the",
  "and",
  "for",
  "with",
  "from",
  "this",
  "that",
  "into"
]);

module.exports = {
  listKnowledgeSources,
  uploadKnowledgeSource,
  searchKnowledge,
  buildKnowledgeContext
};