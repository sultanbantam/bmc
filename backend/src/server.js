require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { generateBmc, chatBmc } = require("./bmcService");
const { listKnowledgeSources, uploadKnowledgeSource, searchKnowledge } = require("./knowledgeStore");
const { saveDrafts, schedulePosts, publishDuePosts, listSocialPosts, getSocialConfig, getPublishIntervalMs } = require("./socialStore");

const app = express();
const port = Number(process.env.PORT || 3001);

app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: "4mb" }));
app.use(cors(buildCorsOptions()));
app.use(rateLimit());

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "bmc-ai-backend",
    openai: Boolean(process.env.OPENAI_API_KEY),
    social: getSocialConfig(),
    time: new Date().toISOString()
  });
});

app.post("/api/bmc/generate", requireAppKey, async (req, res, next) => {
  try {
    const idea = String(req.body?.idea || "").trim();
    const result = await generateBmc(idea, { language: req.body?.language });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.post("/api/bmc/chat", requireAppKey, async (req, res, next) => {
  try {
    const result = await chatBmc({
      idea: req.body?.idea,
      bmc: req.body?.bmc,
      risks: req.body?.risks,
      question: req.body?.question,
      language: req.body?.language
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.post("/api/knowledge/upload", requireAppKey, async (req, res, next) => {
  try {
    res.json(uploadKnowledgeSource(req.body));
  } catch (error) {
    next(error);
  }
});

app.post("/api/knowledge/sources", requireAppKey, async (req, res, next) => {
  try {
    res.json({ sources: listKnowledgeSources() });
  } catch (error) {
    next(error);
  }
});

app.post("/api/knowledge/search", requireAppKey, async (req, res, next) => {
  try {
    const matches = searchKnowledge(req.body?.query, {
      language: req.body?.language,
      tags: req.body?.tags,
      limit: req.body?.limit
    });
    res.json({ matches });
  } catch (error) {
    next(error);
  }
});

app.post("/api/social/save", requireAppKey, async (req, res, next) => {
  try {
    res.json(saveDrafts(req.body));
  } catch (error) {
    next(error);
  }
});

app.post("/api/social/schedule", requireAppKey, async (req, res, next) => {
  try {
    res.json(schedulePosts(req.body));
  } catch (error) {
    next(error);
  }
});

app.post("/api/social/publish-due", requireAppKey, async (req, res, next) => {
  try {
    res.json(await publishDuePosts());
  } catch (error) {
    next(error);
  }
});

app.post("/api/social/list", requireAppKey, async (req, res, next) => {
  try {
    res.json({ posts: listSocialPosts(req.body) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/social/config", requireAppKey, async (req, res, next) => {
  try {
    res.json(getSocialConfig());
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: apiMessage(req, "notFound") });
});

app.use((error, req, res, next) => {
  const status = error.status && Number(error.status) >= 400 ? Number(error.status) : 500;
  res.status(status).json({
    error: status >= 500 ? "Backend error." : error.message,
    detail: process.env.NODE_ENV === "production" ? undefined : error.message
  });
});

app.listen(port, () => {
  console.log(`BMC AI backend running on port ${port}`);
  startSocialAutoPublisher();
});

function startSocialAutoPublisher() {
  if (process.env.SOCIAL_AUTO_PUBLISH !== "true") return;

  const intervalMs = getPublishIntervalMs();
  const run = async () => {
    try {
      const result = await publishDuePosts();
      if (result.processed > 0) {
        console.log(`Social auto-publisher processed ${result.processed} due post(s).`);
      }
    } catch (error) {
      console.error(`Social auto-publisher error: ${error.message}`);
    }
  };

  setTimeout(run, 5000).unref();
  setInterval(run, intervalMs).unref();
  console.log(`Social auto-publisher enabled every ${intervalMs}ms.`);
}

function buildCorsOptions() {
  const allowed = String(process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    origin(origin, callback) {
      if (!origin || allowed.length === 0 || allowed.includes("*") || allowed.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} is not allowed by CORS_ORIGIN.`));
    }
  };
}

const apiMessages = {
  id: {
    invalidAppKey: "APP_API_KEY tidak valid.",
    notFound: "Endpoint tidak ditemukan.",
    rateLimit: "Terlalu banyak request. Coba lagi sebentar."
  },
  en: {
    invalidAppKey: "Invalid APP_API_KEY.",
    notFound: "Endpoint not found.",
    rateLimit: "Too many requests. Please try again shortly."
  }
};

function apiMessage(req, key) {
  const language = requestLanguage(req);
  return apiMessages[language]?.[key] || apiMessages.id[key] || key;
}

function requestLanguage(req) {
  const bodyLanguage = String(req.body?.language || "").toLowerCase();
  const acceptLanguage = String(req.header?.("accept-language") || "").toLowerCase();
  if (bodyLanguage === "en" || acceptLanguage.startsWith("en")) return "en";
  return "id";
}
function requireAppKey(req, res, next) {
  const expected = process.env.APP_API_KEY;
  if (!expected) {
    next();
    return;
  }

  const received = req.header("x-app-key");
  if (received === expected) {
    next();
    return;
  }

  res.status(401).json({ error: apiMessage(req, "invalidAppKey") });
}

function rateLimit() {
  const windowMs = 60 * 1000;
  const maxRequests = 60;
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const current = hits.get(key) || { count: 0, resetAt: now + windowMs };

    if (current.resetAt < now) {
      current.count = 0;
      current.resetAt = now + windowMs;
    }

    current.count += 1;
    hits.set(key, current);

    if (current.count > maxRequests) {
      res.status(429).json({ error: apiMessage(req, "rateLimit") });
      return;
    }

    next();
  };
}
