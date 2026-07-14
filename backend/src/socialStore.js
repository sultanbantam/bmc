const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dataDir = process.env.BMC_DATA_DIR || path.join(__dirname, "..", "data");
const storePath = path.join(dataDir, "social-posts.json");
const livePublishers = new Set(["X"]);

function saveDrafts(payload = {}) {
  const posts = normalizePosts(payload.posts);
  if (!posts.length) {
    const error = new Error("Minimal satu draft post wajib dikirim.");
    error.status = 400;
    throw error;
  }

  const store = readStore();
  const now = new Date().toISOString();
  const saved = posts.map((post) => ({
    id: createId("post"),
    platform: post.platform,
    title: post.title,
    caption: post.caption,
    hashtags: post.hashtags,
    image: post.image,
    scheduledAt: null,
    status: "draft",
    publishMode: "manual",
    externalId: "",
    error: "",
    createdAt: now,
    updatedAt: now
  }));
  store.posts.push(...saved);
  writeStore(store);
  return { saved, count: saved.length };
}

function schedulePosts(payload = {}) {
  const posts = normalizePosts(payload.posts);
  const scheduledAt = parseSchedule(payload.scheduledAt);
  if (!posts.length) {
    const error = new Error("Minimal satu post wajib dijadwalkan.");
    error.status = 400;
    throw error;
  }

  const store = readStore();
  const now = new Date().toISOString();
  const scheduled = posts.map((post, index) => ({
    id: createId("post"),
    platform: post.platform,
    title: post.title,
    caption: post.caption,
    hashtags: post.hashtags,
    image: post.image,
    scheduledAt: new Date(scheduledAt.getTime() + index * 30 * 60 * 1000).toISOString(),
    status: "scheduled",
    publishMode: resolvePublishMode(post.platform),
    externalId: "",
    error: "",
    createdAt: now,
    updatedAt: now
  }));
  store.posts.push(...scheduled);
  writeStore(store);
  return { scheduled, count: scheduled.length, config: getSocialConfig() };
}

async function publishDuePosts() {
  const store = readStore();
  const now = Date.now();
  const due = store.posts.filter((post) => post.status === "scheduled" && post.scheduledAt && Date.parse(post.scheduledAt) <= now);
  const results = [];

  for (const post of due) {
    try {
      const result = await publishPost(post);
      post.status = result.status;
      post.externalId = result.externalId || "";
      post.error = result.error || "";
      post.updatedAt = new Date().toISOString();
      results.push({
        id: post.id,
        platform: post.platform,
        status: post.status,
        externalId: post.externalId,
        error: post.error
      });
    } catch (error) {
      post.status = "failed";
      post.error = error.message;
      post.updatedAt = new Date().toISOString();
      results.push({ id: post.id, platform: post.platform, status: "failed", error: error.message });
    }
  }

  writeStore(store);
  return { processed: results.length, results, config: getSocialConfig() };
}

function listSocialPosts(options = {}) {
  const limit = Math.max(1, Math.min(Number(options.limit || 20), 100));
  const store = readStore();
  return store.posts
    .slice()
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, limit);
}

function getSocialConfig() {
  const mode = getPublishMode();
  const livePlatforms = getLivePlatforms();
  return {
    mode,
    autoPublish: process.env.SOCIAL_AUTO_PUBLISH === "true",
    intervalMs: getPublishIntervalMs(),
    livePlatforms,
    configuredPublishers: {
      X: Boolean(process.env.X_USER_TOKEN)
    }
  };
}

async function publishPost(post) {
  if (post.publishMode === "mock") {
    return { status: "published", externalId: `mock_${post.id}` };
  }

  if (post.publishMode === "manual") {
    return {
      status: "needs_credentials",
      error: `Live publisher untuk ${post.platform} belum dikonfigurasi. Post tetap tersimpan untuk dipublish manual nanti.`
    };
  }

  if (post.platform === "X") {
    return publishToX(post);
  }

  throw new Error(`Live publisher untuk ${post.platform} belum tersedia.`);
}

async function publishToX(post) {
  const token = clean(process.env.X_USER_TOKEN);
  if (!token) {
    throw new Error("X_USER_TOKEN belum diisi. Buat OAuth 2.0 user token dengan izin tweet.write lalu simpan di .env.");
  }

  const text = formatXText(post);
  const response = await fetch("https://api.x.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.detail || data?.title || data?.error || `X publish failed ${response.status}`);
  }
  return { status: "published", externalId: data?.data?.id || "" };
}

function formatXText(post) {
  const maxLength = Math.max(40, Math.min(Number(process.env.X_TEXT_LIMIT || 280), 4000));
  const hashtags = clean(post.hashtags).replace(/\s+/g, " ");
  const caption = clean(post.caption).replace(/\n{3,}/g, "\n\n");
  const fullText = [caption, hashtags].filter(Boolean).join("\n\n").trim();
  if (fullText.length <= maxLength) return fullText;

  if (hashtags && hashtags.length < maxLength - 24) {
    const captionLimit = maxLength - hashtags.length - 3;
    return `${caption.slice(0, captionLimit).trim()}...\n\n${hashtags}`.slice(0, maxLength);
  }

  return `${fullText.slice(0, maxLength - 3).trim()}...`;
}

function resolvePublishMode(platform) {
  if (getPublishMode() !== "live") return "mock";
  if (livePublishers.has(platform) && getLivePlatforms().includes(platform)) return "live";
  return "manual";
}

function getPublishMode() {
  return clean(process.env.SOCIAL_PUBLISH_MODE).toLowerCase() === "live" ? "live" : "mock";
}

function getLivePlatforms() {
  const configured = String(process.env.SOCIAL_LIVE_PLATFORMS || "X")
    .split(",")
    .map((item) => normalizePlatform(item))
    .filter(Boolean);
  return configured.length ? [...new Set(configured)] : ["X"];
}

function getPublishIntervalMs() {
  const raw = Number(process.env.SOCIAL_PUBLISH_INTERVAL_MS || 300000);
  if (!Number.isFinite(raw)) return 300000;
  return Math.max(60000, Math.min(raw, 3600000));
}

function normalizePosts(value) {
  const source = Array.isArray(value) ? value : [];
  return source
    .map((post) => ({
      platform: normalizePlatform(post.platform || "LinkedIn"),
      title: clean(post.title || post.platform || "Social post"),
      caption: clean(post.caption),
      hashtags: clean(post.hashtags),
      image: clean(post.image)
    }))
    .filter((post) => post.caption)
    .slice(0, 20);
}

function normalizePlatform(value) {
  const raw = clean(value);
  const lower = raw.toLowerCase();
  if (lower === "twitter" || lower === "x") return "X";
  if (lower === "linkedin" || lower === "linked in") return "LinkedIn";
  if (lower === "instagram" || lower === "ig") return "Instagram";
  if (lower === "tiktok" || lower === "tik tok") return "TikTok";
  if (lower === "facebook" || lower === "fb") return "Facebook";
  return raw || "LinkedIn";
}

function parseSchedule(value) {
  const date = value ? new Date(value) : new Date(Date.now() + 5 * 60 * 1000);
  if (Number.isNaN(date.getTime())) {
    const error = new Error("Format jadwal tidak valid.");
    error.status = 400;
    throw error;
  }
  return date;
}

function readStore() {
  ensureStore();
  try {
    const parsed = JSON.parse(fs.readFileSync(storePath, "utf8"));
    return { posts: Array.isArray(parsed.posts) ? parsed.posts : [] };
  } catch {
    return { posts: [] };
  }
}

function writeStore(store) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(storePath, `${JSON.stringify(store, null, 2)}\n`);
}

function ensureStore() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(storePath)) writeStore({ posts: [] });
}

function clean(value) {
  return String(value || "").trim();
}

function createId(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

module.exports = {
  saveDrafts,
  schedulePosts,
  publishDuePosts,
  listSocialPosts,
  getSocialConfig,
  getPublishIntervalMs
};