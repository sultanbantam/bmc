require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { generateBmc, chatBmc } = require("./bmcService");

const app = express();
const port = Number(process.env.PORT || 3001);

app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: "1mb" }));
app.use(cors(buildCorsOptions()));
app.use(rateLimit());

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "bmc-ai-backend",
    openai: Boolean(process.env.OPENAI_API_KEY),
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

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan." });
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
});

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
      callback(new Error(`Origin ${origin} tidak diizinkan oleh CORS_ORIGIN.`));
    }
  };
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

  res.status(401).json({ error: "APP_API_KEY tidak valid." });
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
      res.status(429).json({ error: "Terlalu banyak request. Coba lagi sebentar." });
      return;
    }

    next();
  };
}
