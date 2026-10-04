// server.professional.mjs
import express from "express";
import axios from "axios";
import cors from "cors";
import Redis from "ioredis";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import crypto from "crypto";
import animeRoutes from "./src/routes/animeRoutes.js";
import mangaRoutes from "./src/routes/mangaRoutes.js";

dotenv.config();

/**
 * PROFESSIONAL PROXY
 * - Requires /sign (with SIGN_API_KEY) to issue short-lived tokens for master and segments
 * - /proxy and /stream accept token via query string (primary) or Authorization header (optional)
 * - Token contains { url, referer?, aud? } and expires quickly
 * - Player must send header x-player-auth: <player-id>
 */

const app = express();
app.use(express.json());
app.use(cors());

// quick safety: uncaught handlers
process.on("unhandledRejection", (e) => console.error("UNHANDLED_REJECTION:", e));
process.on("uncaughtException", (e) => console.error("UNCAUGHT_EXCEPTION:", e));

// ---------- CONFIG ----------
const PORT = Number(process.env.PORT || 5000);
const REDIS_URL = process.env.SERVER_API_REDIS_CONN_URL || "";
const STREAM_SECRET = process.env.STREAM_SECRET || "change-me";
const SIGN_API_KEY = process.env.SIGN_API_KEY || "";
const PROXY_HOST = process.env.PROXY_HOST || `http://localhost:${PORT}`;
const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS || "").split(",").map(s => s.trim()).filter(Boolean);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 1000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 10);
const PREFETCH_SEGMENTS = Number(process.env.PREFETCH_SEGMENTS || 6);
const PREFETCH_CONCURRENCY = Number(process.env.PREFETCH_CONCURRENCY || 3);
const REQUIRE_PLAYER_HEADER = process.env.REQUIRE_PLAYER_HEADER !== "false"; // default true
const TRUSTED_BACKEND_IPS = (process.env.TRUSTED_BACKEND_IPS || "").split(",").map(x => x.trim()).filter(Boolean);

// ---------- REDIS ----------
const redis = REDIS_URL ? new Redis(REDIS_URL, { tls: REDIS_URL.startsWith("rediss://") ? {} : undefined }) : null;
if (redis) {
  redis.ping().then(r => console.log("✅ Redis ping:", r)).catch(e => console.warn("⚠️ Redis ping failed:", e.message));
}

// ---------- SECURITY MIDDLEWARE ----------
app.use(helmet({
  contentSecurityPolicy: false, // keep relaxed for proxy payloads
}));

// Global rate limiter (per IP)
const globalLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Block common scraping UAs early
app.use((req, res, next) => {
  const ua = (req.headers["user-agent"] || "").toString().toLowerCase();
  const ip = req.ip || req.connection?.remoteAddress;
  const blocked = ["vlc", "python", "wget", "ffmpeg", "streamlink", "aria2", "httpx", "idmm", "downloader"];

  if (ua.includes("curl") && (ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1")) {
    return next();
  }

  if (blocked.some(b => ua.includes(b))) {
    return res.status(403).send("Blocked User Agent");
  }
  next();
});

// Keep API routes behind Helmet, the global rate limiter, and user-agent filtering.
app.use("/api/anime", animeRoutes);
app.use("/api/manga", mangaRoutes);
app.get("/genreslist", (_req, res) => res.redirect(307, "/api/anime/genres"));

// ---------- HELPERS ----------
function validateHost(urlString) {
  try {
    const hostname = new URL(urlString).hostname;
    if (ALLOWED_HOSTS.length === 0) return true;
    if (ALLOWED_HOSTS.includes("*")) return true;
    return ALLOWED_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

function signPayload(payload, expiresSec = 300) {
  return jwt.sign(payload, STREAM_SECRET, { expiresIn: `${expiresSec}s` });
}

function extractTokenFromRequest(req) {
  // 1. Prioritize query string (for HLS compatibility)
  if (req.query?.token) {
    return String(req.query.token).trim();
  }
  // 2. Fallback to Authorization header
  const authHeader = req.headers?.authorization;
  if (authHeader) {
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

function verifyToken(token) {
  try { return jwt.verify(token, STREAM_SECRET); } catch (e) { return null; }
}

function buildCacheKey(url) {
  return `cache:${crypto.createHash("sha256").update(url).digest("hex")}`;
}

function defaultHeaders(referer) {
  const hdrs = {
    "User-Agent": process.env.PROXY_USER_AGENT || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    Accept: "*/*",
  };
  if (referer) hdrs.Referer = referer;
  return hdrs;
}

async function rateLimitToken(token, max = 30, windowSec = 60) {
  if (!redis) return true;
  const key = `rl:token:${token}`;
  const val = await redis.incr(key);
  if (val === 1) {
    await redis.expire(key, windowSec);
  }
  return val <= max;
}

// ---------- PREFETCH ----------
async function fetchSegmentsConcurrently(urls = [], concurrency = PREFETCH_CONCURRENCY) {
  if (!redis || !Array.isArray(urls) || urls.length === 0) return;
  let idx = 0;
  async function worker() {
    while (idx < urls.length) {
      const i = idx++;
      const segUrl = urls[i];
      const key = buildCacheKey(segUrl);
      try {
        const exists = await redis.exists(key);
        if (!exists) {
          const resp = await axios.get(segUrl, { responseType: "arraybuffer", headers: defaultHeaders(), timeout: 10000, validateStatus: () => true });
          if (resp.status >= 200 && resp.status < 300) {
            await redis.setex(key, 3600, resp.data);
          }
        }
      } catch (e) {
        console.warn("prefetch error", segUrl, e.message || e);
      }
    }
  }
  const workers = Array.from({ length: Math.max(1, concurrency) }, () => worker());
  await Promise.all(workers);
}

// ---------- CORE: fetchRemote ----------
async function fetchRemote(rawUrl, res, rewrite = false, refererOverride = null, token = null) {
  try {
    rawUrl = String(rawUrl).trim();
    if (!validateHost(rawUrl)) {
      return res.status(403).json({ error: "Host not allowed" });
    }

    if (token) {
      const ok = await rateLimitToken(token, 200, 60);
      if (!ok) return res.status(429).json({ error: "Token rate limit exceeded" });
    }

    const cacheKey = buildCacheKey(rawUrl);
    const isM3U8 = rawUrl.toLowerCase().endsWith(".m3u8");
    const REDIS_M3U8_TTL = 5;
    const REDIS_SEGMENT_TTL = 3600;

    if (isM3U8) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else {
      res.setHeader('Cache-Control', `public, max-age=${REDIS_SEGMENT_TTL}`);
    }

    const cached = redis ? await redis.getBuffer(cacheKey) : null;
    if (cached) {
      if (rewrite && isM3U8) {
        res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
        let text = cached.toString("utf8");
        const base = rawUrl.substring(0, rawUrl.lastIndexOf("/") + 1);
        const masterQuery = (new URL(rawUrl)).search;
        text = text.replace(/^(?!#)(.+)$/gm, (line) => {
          const cleaned = line.trim();
          if (!cleaned) return line;
          let full;
          try {
            full = cleaned.startsWith("http") ? cleaned : new URL(cleaned, base).toString();
          } catch {
            return line;
          }
          if (!full.includes("?") && masterQuery) full = `${full}${masterQuery}`;

          // ✅ TOKEN COM DURAÇÃO DIFERENCIADA
          const isSegment = /\.(ts|m4s|aac|mp4|webm)(\?|$)/i.test(full);
          const tokenTTL = isSegment ? 7200 : 60; // 2h para segmentos, 60s para manifesto
          const signed = signPayload({ url: full, referer: refererOverride }, tokenTTL);

          return `${PROXY_HOST}/stream?token=${encodeURIComponent(signed)}${refererOverride ? `&referer=${encodeURIComponent(refererOverride)}` : ''}`;
        });
        return res.send(Buffer.from(text, "utf8"));
      } else {
        return res.send(cached);
      }
    }

    const axiosOpts = { responseType: "arraybuffer", headers: defaultHeaders(refererOverride), timeout: 20000, validateStatus: () => true };
    console.log("=> upstream fetch:", rawUrl, "referer:", refererOverride);
    const upstream = await axios.get(rawUrl, axiosOpts);
    console.log("<= upstream status:", upstream.status, rawUrl);

    if (!upstream || upstream.status >= 400) {
      const bodyPreview = upstream?.data ? Buffer.from(upstream.data).toString("utf8", 0, 300) : "";
      console.warn("upstream error preview:", upstream?.status, bodyPreview.replace(/\n/g, '\\n'));
      return res.status(upstream?.status || 502).send(upstream?.data || `Upstream error ${upstream?.status || 'N/A'}`);
    }

    const contentType = upstream.headers['content-type'] || "";
    res.setHeader("Content-Type", contentType);

    let data = Buffer.from(upstream.data);

    if (rewrite && isM3U8 && contentType.includes("application/vnd.apple.mpegurl")) {
      let text = data.toString("utf8");
      const base = rawUrl.substring(0, rawUrl.lastIndexOf("/") + 1);
      const masterQuery = (new URL(rawUrl)).search;
      const segs = [];

      text = text.replace(/^(?!#)(.+)$/gm, (line) => {
        const cleaned = String(line).trim();
        if (!cleaned) return line;
        let full;
        try {
          full = cleaned.startsWith("http") ? cleaned : new URL(cleaned, base).toString();
        } catch {
          return line;
        }
        if (!full.includes("?") && masterQuery) full = `${full}${masterQuery}`;
        if (/\.(ts|m4s|aac)(\?|$)/i.test(full)) segs.push(full);

        // ✅ TOKEN COM DURAÇÃO DIFERENCIADA
        const isSegment = /\.(ts|m4s|aac|mp4|webm)(\?|$)/i.test(full);
        const tokenTTL = isSegment ? 7200 : 60; // 2h para segmentos, 60s para manifesto
        const signed = signPayload({ url: full, referer: refererOverride }, tokenTTL);

        return `${PROXY_HOST}/stream?token=${encodeURIComponent(signed)}${refererOverride ? `&referer=${encodeURIComponent(refererOverride)}` : ''}`;
      });

      data = Buffer.from(text, "utf8");

      // limited prefetch
      if (segs.length > 0) {
        fetchSegmentsConcurrently(segs.slice(0, PREFETCH_SEGMENTS), PREFETCH_CONCURRENCY)
          .then(() => console.log("prefetch done"))
          .catch(e => console.warn("prefetch err", e));
      }
    }

    if (redis) {
      try {
        await redis.setex(cacheKey, isM3U8 ? REDIS_M3U8_TTL : REDIS_SEGMENT_TTL, data);
      } catch (e) { console.warn("redis setex err", e.message || e); }
    }

    return res.send(data);

  } catch (e) {
    console.error("fetchRemote error:", e && e.message ? e.message : e);
    return res.status(500).json({ error: "proxy_error", message: String(e) });
  }
}

// ---------- ENDPOINTS ----------

app.post("/sign", (req, res) => {
  const apiKey = req.headers["x-api-key"];
  if (!SIGN_API_KEY || apiKey !== SIGN_API_KEY) return res.status(403).json({ error: "forbidden" });

  const { url, referer, expiresIn } = req.body;
  if (!url || typeof url !== "string") return res.status(400).json({ error: "missing url" });
  if (!validateHost(url)) return res.status(403).json({ error: "host not allowed" });

  const token = signPayload({ url, referer }, Number(expiresIn) || 60);
  return res.json({ token });
});

// GET /proxy?token=...&referer=...
app.get("/proxy", async (req, res) => {
  const token = extractTokenFromRequest(req);
  if (!token) return res.status(400).json({ error: "missing token" });

  const payload = verifyToken(token);
  if (!payload || !payload.url) return res.status(403).json({ error: "invalid token" });

  if (REQUIRE_PLAYER_HEADER) {
    const playerHeader = req.headers["x-player-auth"];
    const ip = req.ip || req.connection?.remoteAddress;
    if (!playerHeader && !TRUSTED_BACKEND_IPS.includes(String(ip))) {
      return res.status(403).json({ error: "missing player header" });
    }
  }

  // ✅ FIX: definir refererQuery corretamente
  const refererQuery = req.query.referer ? decodeURIComponent(String(req.query.referer)) : null;
  const referer = refererQuery || payload.referer || null;
  const decodedUrl = payload.url;

  return fetchRemote(decodedUrl, res, true, referer, token);
});

// GET /stream?token=...&referer=...
app.get("/stream", async (req, res) => {
  const token = extractTokenFromRequest(req);
  if (!token) return res.status(400).json({ error: "missing token" });

  const payload = verifyToken(token);
  if (!payload || !payload.url) return res.status(403).json({ error: "invalid token" });

  // ✅ FIX: definir refererQuery
  const refererQuery = req.query.referer ? decodeURIComponent(String(req.query.referer)) : null;
  const referer = refererQuery || payload.referer || null;
  const decodedUrl = payload.url;

  if (decodedUrl.toLowerCase().endsWith(".m3u8")) {
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
  } else if (/\.(ts|m4s)$/i.test(decodedUrl)) {
    res.setHeader("Content-Type", "video/MP2T");
  }

  return fetchRemote(decodedUrl, res, decodedUrl.toLowerCase().endsWith(".m3u8"), referer, token);
});

app.get("/key", (req, res) => {
  const token = extractTokenFromRequest(req);
  if (!token) return res.status(400).send("missing token");
  const payload = verifyToken(token);
  if (!payload) return res.status(403).send("invalid token");
  const fakeKey = crypto.randomBytes(16);
  res.setHeader("Content-Type", "application/octet-stream");
  return res.send(fakeKey);
});

app.post("/clear-cache", async (req, res) => {
  const apiKey = req.headers["x-api-key"];
  if (!SIGN_API_KEY || apiKey !== SIGN_API_KEY) return res.status(403).json({ error: "forbidden" });
  if (!redis) return res.status(500).json({ error: "redis not configured" });
  try {
    await redis.flushall();
    return res.json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "failed" });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`🚀 Professional Proxy running at ${PROXY_HOST}`));
