const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dataDir = process.env.BMC_DATA_DIR || path.join(__dirname, "..", "data");
const storePath = path.join(dataDir, "social-posts.json");

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
    publishMode: process.env.SOCIAL_PUBLISH_MODE === "live" ? "live" : "mock",
    externalId: "",
    error: "",
    createdAt: now,
    updatedAt: now
  }));
  store.posts.push(...scheduled);
  writeStore(store);
  return { scheduled, count: scheduled.length };
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
      post.error = "";
      post.updatedAt = new Date().toISOString();
      results.push({ id: post.id, platform: post.platform, status: post.status, externalId: post.externalId });
    } catch (error) {
      post.status = "failed";
      post.error = error.message;
      post.updatedAt = new Date().toISOString();
      results.push({ id: post.id, platform: post.platform, status: "failed", error: error.message });
    }
  }

  writeStore(store);
  return { processed: results.length, results };
}

function listSocialPosts(options = {}) {
  const limit = Math.max(1, Math.min(Number(options.limit || 20), 100));
  const store = readStore();
  return store.posts
    .slice()
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, limit);
}

async function publishPost(post) {
  if (post.publishMode !== "live") {
    return { status: "published", externalId: `mock_${post.id}` };
  }

  if (post.platform === "X" && process.env.X_USER_TOKEN) {
    const response = await fetch("https://api.x.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.X_USER_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: `${post.caption}\n\n${post.hashtags}`.trim().slice(0, 280) })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.detail || data?.title || `X publish failed ${response.status}`);
    return { status: "published", externalId: data?.data?.id || "" };
  }

  throw new Error(`Live publisher untuk ${post.platform} belum dikonfigurasi.`);
}

function normalizePosts(value) {
  const source = Array.isArray(value) ? value : [];
  return source
    .map((post) => ({
      platform: clean(post.platform || "LinkedIn"),
      title: clean(post.title || post.platform || "Social post"),
      caption: clean(post.caption),
      hashtags: clean(post.hashtags),
      image: clean(post.image)
    }))
    .filter((post) => post.caption)
    .slice(0, 20);
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
  listSocialPosts
};