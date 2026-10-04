import axios from "axios";
import { AnimeProvider } from "./AnimeProvider.js";
import { logEvent } from "../../utils/logger.js";

const DEFAULT_BASE_URL = "http://kuhi:8000";

function normalizeTitle(title) {
  if (typeof title === "string") return title;
  return title?.english || title?.romaji || title?.userPreferred || title?.native || "Untitled";
}

function normalizeAnime(anime = {}) {
  const anilistId = anime.anilistId ?? anime.id ?? anime.mediaId ?? anime.media?.id;
  return {
    ...anime,
    id: anilistId != null ? String(anilistId) : anime.id,
    anilistId: anilistId != null ? (Number(anilistId) || String(anilistId)) : undefined,
    title: normalizeTitle(anime.title ?? anime.media?.title),
  };
}

function encodePath(value) {
  return encodeURIComponent(String(value));
}

function buildEpisodeId(anilistId, number, type = "sub") {
  return `kuhi:${anilistId}:${Number(number)}:${type}`;
}

function parseEpisodeId(value) {
  const match = String(value).match(/^kuhi:([^:]+):(\d+):(sub|dub)$/i);
  if (!match) {
    throw Object.assign(new Error("Invalid Kuhi episode id"), { status: 400 });
  }

  return {
    anilistId: match[1],
    episode: Number(match[2]),
    type: match[3].toLowerCase(),
  };
}

function normalizeEpisode(anilistId, episode, type) {
  const number = Number(episode?.number ?? episode?.episode ?? episode?.ep ?? 0);
  if (!number) return null;

  return {
    ...episode,
    id: buildEpisodeId(anilistId, number, type),
    animeId: String(anilistId),
    number,
    title: episode.title || episode.name || `Episode ${number}`,
    isSubbed: type === "sub",
    isDubbed: type === "dub",
    audio: type,
  };
}

function extractProviderEpisodes(payload) {
  const providers = payload?.providers || payload?.data?.providers || {};
  const episodes = [];

  for (const providerData of Object.values(providers)) {
    for (const type of ["sub", "dub"]) {
      for (const episode of providerData?.episodes?.[type] || []) {
        episodes.push({ episode, type });
      }
    }
  }

  return episodes;
}

function normalizeSources(payload = {}) {
  const streams = Array.isArray(payload.streams) ? payload.streams : [];
  const subtitles = Array.isArray(payload.subtitles) ? payload.subtitles : [];

  const sources = streams
    .filter((stream) => stream?.url)
    .map((stream) => {
      const kind = String(stream.type || "hls").toLowerCase();
      const type = kind === "hls"
        ? "application/x-mpegURL"
        : kind === "mp4"
          ? "video/mp4"
          : kind === "dash"
            ? "application/dash+xml"
            : kind;
      const referer = stream.referer || stream.headers?.Referer || stream.headers?.referer || null;

      return {
        url: stream.url,
        type,
        quality: stream.quality || stream.server || "auto",
        server: stream.server,
        referer,
      };
    });

  const firstReferer = sources.find((source) => source.referer)?.referer || null;

  return {
    ...payload,
    sources,
    subtitles,
    headers: firstReferer ? { Referer: firstReferer } : {},
  };
}

export class KuhiProvider extends AnimeProvider {
  constructor({
    baseUrl = process.env.KUHI_URL || DEFAULT_BASE_URL,
    timeout = Number(process.env.KUHI_TIMEOUT_MS || 15000),
    client = null,
  } = {}) {
    super();
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.client = client || axios.create({
      baseURL: this.baseUrl,
      timeout,
      headers: { Accept: "application/json" },
    });
  }

  async request(endpoint, config) {
    const startedAt = Date.now();
    try {
      const response = await this.client.get(endpoint, config);
      logEvent("kuhi.request", {
        endpoint,
        status: response.status ?? 200,
        durationMs: Date.now() - startedAt,
        provider: response.data?.provider ?? null,
      });
      return response;
    } catch (error) {
      logEvent("kuhi.request", {
        endpoint,
        status: error.response?.status ?? null,
        durationMs: Date.now() - startedAt,
        error: error.code === "ECONNABORTED" ? "timeout" : "request_failed",
      });
      throw error;
    }
  }

  async search(query, page = 1) {
    const { data } = await this.request("/anime/search", {
      params: { query, page, per_page: 20 },
    });

    const results = Array.isArray(data) ? data : (data?.results || []);
    return {
      ...(Array.isArray(data) ? {} : data),
      page: data?.page ?? page,
      results: results.map(normalizeAnime),
    };
  }

  async getInfo(id) {
    const [infoResponse, episodesResponse] = await Promise.all([
      this.request(`/anime/info/${encodePath(id)}`),
      this.request(`/anime/episodes/${encodePath(id)}`),
    ]);

    const info = normalizeAnime(infoResponse.data);
    const episodes = extractProviderEpisodes(episodesResponse.data)
      .map(({ episode, type }) => normalizeEpisode(id, episode, type))
      .filter(Boolean);

    const uniqueEpisodes = Array.from(
      new Map(episodes.map((episode) => [episode.id, episode])).values(),
    ).sort((a, b) => a.number - b.number || a.audio.localeCompare(b.audio));

    return {
      ...info,
      id: String(id),
      anilistId: info.anilistId ?? (Number(id) || id),
      episodes: uniqueEpisodes,
    };
  }

  async getWatchSources(episodeId, { dub = false } = {}) {
    const parsed = parseEpisodeId(episodeId);
    const type = dub ? "dub" : parsed.type;

    const { data } = await this.request(`/anime/extract/${encodePath(parsed.anilistId)}`, {
      params: { e: parsed.episode, type },
    });

    return normalizeSources(data);
  }

  async getTopAiring(page = 1) {
    const { data } = await this.request("/anime/trending", {
      params: { page, per_page: 20 },
    });
    const results = Array.isArray(data) ? data : (data?.results || []);
    return { ...(Array.isArray(data) ? {} : data), results: results.map(normalizeAnime) };
  }

  async getRecentEpisodes(page = 1) {
    const { data } = await this.request("/anime/recent", {
      params: { page, per_page: 20 },
    });
    const results = Array.isArray(data) ? data : (data?.results || []);
    return { ...(Array.isArray(data) ? {} : data), results: results.map(normalizeAnime) };
  }

  async getGenres() {
    const { data } = await this.request("/anime/genres");
    return data;
  }

  async getProviderStatus() {
    const { data } = await this.request("/anime/providers/status");
    return data;
  }
}
