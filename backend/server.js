// backend/server.js
import express from "express";
import axios from "axios";
import cors from "cors";
import Redis from "ioredis";

const app = express();
app.use(cors());

// 🚀 Conexão Redis (pode ajustar se for remoto)
const redis = new Redis(process.env.SERVER_API_REDIS_CONN_URL)

// 🧠 Função de fetch com cache
async function fetchRemote(url, res, rewrite = false) {
  const cacheKey = `cache:${url}`;

  try {
    // 1️⃣ Verifica cache
    const cached = await redis.getBuffer(cacheKey);
    if (cached) {
      console.log("🟢 Cache hit:", url);
      res.send(cached);
      return;
    }

    console.log("🔵 Cache miss:", url);
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Referer: "https://megacloud.blog/embed-2/v3/e-1/vlFkDBBfoRWN?k=1",
      },
    });

    const contentType = response.headers["content-type"] || "";
    res.setHeader("Content-Type", contentType);

    let data = response.data;

    // 2️⃣ Se for playlist .m3u8, reescreve os caminhos relativos
    if (rewrite && contentType.includes("application/vnd.apple.mpegurl")) {
      let text = Buffer.from(response.data).toString("utf8");
      const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);

      text = text.replace(
        /^(?!#)([^:\n\r]+)$/gm,
        (match) => {
          const fullUrl = new URL(match, baseUrl).href;
          const encoded = encodeURIComponent(fullUrl);
          return `http://localhost:5000/stream?url=${encoded}`;
        }
      );

      data = Buffer.from(text, "utf8");
    }

    // 3️⃣ Armazena no cache (TTL de 10 minutos para m3u8, 1 hora para ts)
    const ttl = url.endsWith(".m3u8") ? 600 : 3600;
    await redis.setex(cacheKey, ttl, data);

    // 4️⃣ Envia a resposta
    res.send(data);
  } catch (error) {
    console.error("❌ Proxy error:", error.message);
    res
      .status(error.response?.status || 500)
      .json({ error: "Failed to fetch resource" });
  }
}

// Proxy principal — reescreve playlists e faz cache
app.get("/proxy", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL parameter" });
  await fetchRemote(url, res, true);
});

// Proxy de segmentos — cache direto
app.get("/stream", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL parameter" });
  await fetchRemote(url, res, false);
});

app.listen(5000, () => {
  console.log("🚀 Proxy com cache Redis rodando em http://localhost:5000");
});
