import express from "express";
import axios from "axios";
import cors from "cors";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

// ----------------------
// Redis Upstash
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

  // Adicionar listener para detectar se o cliente cancelou a conexão.
  res.on('close', () => {
    if (!res.headersSent) {
      console.log(`⚠️ Cliente desconectado/requisição CANCELADA: ${url}`);
    }
  });

  try {
    // 1. Tentar buscar do Redis (CACHE REATIVADO)
    const cached = await redis.getBuffer(cacheKey);

    if (cached) {
      console.log("🟢 Cache hit:", url);
      
      // FIX: Se a flag 'rewrite' estiver ativa, significa que estamos lidando com um M3U8
      // Playlists M3U8 PRECISAM ser reescritas ANTES de serem enviadas ao player,
      // mesmo que venham do cache.
      if (rewrite) {
          // Define o Content-Type correto
          res.setHeader("Content-Type", "application/vnd.apple.mpegurl");

          let text = cached.toString("utf8");
          const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
          const proxyHost = `http://192.168.0.20:5000`;

          // Aplica a lógica de reescrita
          text = text.replace(/^(?!#)([^:\n\r]+)$/gm, (match) => {
              const fullUrl = new URL(match, baseUrl).href;
              return `${proxyHost}/stream?url=${encodeURIComponent(fullUrl)}`;
          });
          
          console.log("🔗 Cache Hit - Playlist Reescrevendo links para o proxy.");
          res.send(Buffer.from(text, "utf8"));
          return;
      } else {
          // Para segmentos (.ts) ou outros arquivos que não precisam de reescrita, 
          // basta enviar o conteúdo em cache diretamente.
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

    // 3. Reescrever playlist se necessário (LÓGICA REFORÇADA PARA PLAYLIST MESTRA E DE MÍDIA)
    if (rewrite && contentType.includes("application/vnd.apple.mpegurl")) {
      let text = Buffer.from(response.data).toString("utf8");
      // O baseUrl é crucial para resolver URLs relativas dentro da playlist
      const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);

      const segmentUrls = []; // Manter o rastreamento para pré-busca

      // Expressão Regular: Captura linhas que não começam com '#' (comentários)
      // e que não contêm '://' (provavelmente URLs absolutas já válidas/externas)
      text = text.replace(/^(?!#)([^:\n\r]+)$/gm, (match) => {

        // 1. Converte o caminho relativo/simples para URL completa original
        const fullUrl = new URL(match, baseUrl).href;

        // Host do seu proxy local
        const proxyHost = `http://192.168.0.20:5000`;

        // Verifica o tipo de arquivo apenas para fins de log e pré-busca
        if (match.endsWith(".ts") || match.endsWith(".aac")) {
          segmentUrls.push(fullUrl);
        } else if (match.endsWith(".m3u8")) {
          console.log("🔗 Convertendo Playlist de Mídia/Master para proxy:", fullUrl);
        }
        
        // ✅ RETORNA O PROXY URL: Este link será acessado pelo player na próxima requisição
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
    const ttl = url.endsWith(".m3u8") ? 600 : 3600;
    // Tentar salvar no Redis. Adiciona um try/catch para a operação Redis em si (CACHE REATIVADO)
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

    // Verifica se é um erro do Axios (erro de rede ou HTTP upstream)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Erro HTTP do servidor de destino (ex: 403 Forbidden, 404 Not Found)
        statusCode = error.response.status;
        const statusText = error.response.statusText;
        errorMessage = `Upstream HTTP Error: ${statusCode} ${statusText}.`;

        console.error(`❌ HTTP Upstream Error! URL: ${url}. Status: ${statusCode} ${statusText}. Data Size: ${error.response.data.length} bytes.`);

        // Loga os headers para verificação de permissões/tipos de conteúdo
        console.error("   Headers Upstream:", error.response.headers);

      } else if (error.request) {
        // Erro de rede (ex: timeout, DNS lookup failure, servidor inacessível)
        statusCode = 504; // Gateway Timeout
        errorMessage = `Network Error: Could not reach upstream server (${error.code}).`;

        console.error(`❌ Network/Timeout Error! URL: ${url}. Code: ${error.code}. Message: ${error.message}`);

      } else {
        // Erro na configuração da requisição Axios
        console.error("❌ Axios Configuration Error:", error.message);
      }
    } else if (error instanceof Redis.ReplyError) {
      // Erro do Redis (ex: limite de conexão, erro de comando)
      statusCode = 503;
      errorMessage = `Cache Service Error: ${error.message}`;
      console.error("❌ REDIS Error:", error.message);
    } else {
      // Outros erros (ex: erro de URL parsing, erro de lógica no proxy)
      console.error("❌ General Proxy Logic Error:", error.message);
    }

    // Retorna uma resposta amigável (sem expor detalhes internos do erro)
    // Usamos o status code correto (4xx ou 5xx) para o cliente
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
  
  // Configura o Content-Type corretamente
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
app.listen(5000, () => {
  console.log("🚀 Proxy HLS ultra-otimizado rodando em http://192.168.0.20:5000");
});
