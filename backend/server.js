import express from "express";
import axios from "axios";
import cors from "cors";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

// ----------------------
// Redis Upstash Setup
// ----------------------
const redis = new Redis(process.env.SERVER_API_REDIS_CONN_URL, { tls: {} });

redis.ping()
  .then(res => console.log("✅ Redis ping:", res))
  .catch(console.error);

// ----------------------
// Função de pré-busca concorrente
// ----------------------
async function fetchSegmentsConcurrently(urls, concurrency = 5, readyThreshold = 2) {
  let index = 0;
  let readyCount = 0;

  async function worker() {
    while (index < urls.length) {
      const i = index++;
      const segUrl = urls[i];
      const cacheKey = `cache:${segUrl}`;

      try {
        const exists = await redis.exists(cacheKey);
        if (!exists) {
          const response = await axios.get(segUrl, {
            responseType: "arraybuffer",
            // ADICIONANDO HEADERS PARA PREVENIR 403 DURANTE O PRE-FETCH DOS SEGMENTOS
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              Referer: "https://megacloud.blog/embed-2/v3/e-1/vlFkDBBfoRWN?k=1",
            },
          });
          // Cache está ATIVO
          // Mantém o TTL alto (3600s) para o segmento de mídia (.ts)
          await redis.setex(cacheKey, 3600, response.data);

          readyCount++;
          if (readyCount === readyThreshold) {
            console.log("▶️ Threshold atingido, player já pode iniciar");
          }

          console.log("🟢 Pré-buscado:", segUrl);
        } else {
          readyCount++;
        }
      } catch (err) {
        // Registro de erro mais específico para a pré-busca
        const status = err.response?.status;
        const code = err.code;
        console.error(`❌ Erro pré-busca segmento: ${segUrl}. Status: ${status || 'N/A'}. Código Axios: ${code || 'N/A'}. Mensagem: ${err.message}`);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
}

// ----------------------
// Função principal de fetch com cache
// ----------------------
async function fetchRemote(url, res, rewrite = false) {
  // Define o cache key no início para uso no cache, log e tratamento de erros.
  const cacheKey = `cache:${url}`; 
  const isM3U8 = url.endsWith(".m3u8");

  // DEFINIÇÃO DO TTL OTIMIZADA: M3U8 usa TTL bem curto para evitar playlist defasada
  const REDIS_M3U8_TTL = 5; // 5 segundos, essencial para streams live/near-live
  const REDIS_SEGMENT_TTL = 3600; // 1 hora para segmentos (.ts)

  // Adicionar listener para detectar se o cliente cancelou a conexão.
  res.on('close', () => {
    if (!res.headersSent) {
      console.log(`⚠️ Cliente desconectado/requisição CANCELADA: ${url}`);
    }
  });

  // --- Aplicação dos Cabeçalhos de Cache no Cliente (Browser) ---
  if (isM3U8) {
    // IMPORTANTE: Previne que o navegador/player armazene em cache a playlist,
    // garantindo que ele sempre peça a versão mais recente do nosso proxy.
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); 
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  } else {
    // Permite cache no cliente para segmentos por 1h (para reduzir carga no proxy)
    res.setHeader('Cache-Control', `public, max-age=${REDIS_SEGMENT_TTL}`); 
  }
  // -----------------------------------------------------------------


  try {
    // 1. Tentar buscar do Redis
    const cached = await redis.getBuffer(cacheKey);

    if (cached) {
      console.log("🟢 Cache hit:", url);
      
      if (rewrite && isM3U8) {
          // Playlists M3U8 PRECISAM ser reescritas ANTES de serem enviadas ao player,
          // mesmo que venham do cache.
          res.setHeader("Content-Type", "application/vnd.apple.mpegurl");

          let text = cached.toString("utf8");
          const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
          const proxyHost = `http://localhost:5000`;

          // Aplica a lógica de reescrita
          text = text.replace(/^(?!#)([^:\n\r]+)$/gm, (match) => {
              const fullUrl = new URL(match, baseUrl).href;
              return `${proxyHost}/stream?url=${encodeURIComponent(fullUrl)}`;
          });
          
          console.log("🔗 Cache Hit - Playlist Reescrevendo links para o proxy.");
          res.send(Buffer.from(text, "utf8"));
          return;
      } else {
          // Para segmentos (.ts) ou outros arquivos
          res.send(cached);
          return;
      }
    }

    console.log("🔵 Cache miss:", url);

    // 2. Fazer requisição remota
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        // Manter os headers para evitar bloqueios
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://megacloud.blog/embed-2/v3/e-1/vlFkDBBfoRWN?k=1",
      },
    });

    const contentType = response.headers["content-type"] || "";
    res.setHeader("Content-Type", contentType);

    let data = response.data;

    // 3. Reescrever playlist e iniciar pré-busca se for M3U8
    if (rewrite && isM3U8 && contentType.includes("application/vnd.apple.mpegurl")) {
      let text = Buffer.from(response.data).toString("utf8");
      const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
      const segmentUrls = []; 

      // Host do seu proxy local
      const proxyHost = `http://localhost:5000`;

      // Expressão Regular: Captura linhas que não começam com '#' (comentários)
      text = text.replace(/^(?!#)([^:\n\r]+)$/gm, (match) => {

        const fullUrl = new URL(match, baseUrl).href;

        if (match.endsWith(".ts") || match.endsWith(".aac")) {
          segmentUrls.push(fullUrl);
        } else if (match.endsWith(".m3u8")) {
          console.log("🔗 Convertendo Playlist de Mídia/Master para proxy:", fullUrl);
        }
        
        // ✅ RETORNA O PROXY URL
        return `${proxyHost}/stream?url=${encodeURIComponent(fullUrl)}`;
      });

      data = Buffer.from(text, "utf8");

      // Pré-busca segmentos em background
      if (segmentUrls.length > 0) {
          fetchSegmentsConcurrently(segmentUrls, 5, 2)
            .then(() => console.log("✅ Pré-busca concluída"))
            .catch(console.error);
      }
    }

    // 4. Salvar no cache e responder
    const ttl = isM3U8 ? REDIS_M3U8_TTL : REDIS_SEGMENT_TTL;
    
    try {
      await redis.setex(cacheKey, ttl, data); 
    } catch (redisError) {
      console.error("⚠️ Erro ao salvar no Redis:", redisError.message);
      // Continua a resposta mesmo que o cache falhe
    }


    res.send(data);
  } catch (error) {
    // ----------------------------------------------------
    // TRATAMENTO DE ERRO AVANÇADO
    // ----------------------------------------------------
    let statusCode = 500;
    let errorMessage = "Internal Proxy Error: Could not fetch resource.";

    if (axios.isAxiosError(error)) {
      if (error.response) {
        statusCode = error.response.status;
        const statusText = error.response.statusText;
        errorMessage = `Upstream HTTP Error: ${statusCode} ${statusText}.`;

        console.error(`❌ HTTP Upstream Error! URL: ${url}. Status: ${statusCode} ${statusText}. Data Size: ${error.response.data.length} bytes.`);
        console.error("   Headers Upstream:", error.response.headers);

      } else if (error.request) {
        statusCode = 504; // Gateway Timeout
        errorMessage = `Network Error: Could not reach upstream server (${error.code}).`;
        console.error(`❌ Network/Timeout Error! URL: ${url}. Code: ${error.code}. Message: ${error.message}`);

      } else {
        console.error("❌ Axios Configuration Error:", error.message);
      }
    } else if (error instanceof Redis.ReplyError) {
      statusCode = 503;
      errorMessage = `Cache Service Error: ${error.message}`;
      console.error("❌ REDIS Error:", error.message);
    } else {
      console.error("❌ General Proxy Logic Error:", error.message);
    }

    res.status(statusCode).json({ error: "Failed to process request. Check server logs for details." });
  }
}

// ----------------------
// Endpoints
// ----------------------

// 1️⃣ Proxy da playlist (Master Playlist)
app.get("/proxy", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL parameter" });
  // A master playlist DEVE ser reescrita (rewrite = true)
  await fetchRemote(url, res, true);
});

// 2️⃣ Endpoint para segmentos .ts ou playlists adicionais (Media Playlists)
app.get("/stream", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL parameter" });

  console.log("🎯 Streaming:", url);

  // Detecta se a URL que veio do próprio proxy é uma nova playlist M3U8
  const isM3U8 = url.endsWith(".m3u8");
  
  // Configura o Content-Type corretamente (embora fetchRemote também o faça após o fetch)
  if (isM3U8) res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
  else if (url.endsWith(".ts")) res.setHeader("Content-Type", "video/MP2T");
  
  // Se for uma Playlist de Mídia, ELA TAMBÉM PRECISA SER REESCRITA
  await fetchRemote(url, res, isM3U8);
});

// 3️⃣ Limpar cache
app.get("/clear-cache", async (req, res) => {
  try {
    await redis.flushall();
    res.json({ success: true, message: "Cache limpo!" });
  } catch (err) {
    // Log de erro de cache
    console.error("❌ Erro ao limpar cache:", err.message);
    res.status(500).json({ success: false, error: "Failed to clear cache. Check server logs." });
  }
});

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy HLS ultra-otimizado rodando em http://localhost:${PORT}`);
});