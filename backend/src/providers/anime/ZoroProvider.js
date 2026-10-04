import { ANIME, StreamingServers, SubOrSub } from "@consumet/extensions";
import { AnimeProvider } from "./AnimeProvider.js";

const validServers = new Set(Object.values(StreamingServers));

function normalizeAnime(anime) {
  const title = typeof anime.title === "string"
    ? anime.title
    : anime.title?.english || anime.title?.romaji || anime.title?.userPreferred || "Untitled";
  return { ...anime, title };
}

function normalizeInfo(info) {
  return {
    ...normalizeAnime(info),
    episodes: (info.episodes || []).map((episode) => ({
      ...episode,
      number: Number(episode.number),
      title: episode.title || `Episode ${episode.number}`,
      isSubbed: Boolean(episode.isSubbed),
    })),
  };
}

export class ZoroProvider extends AnimeProvider {
  constructor(zoro = new ANIME.Zoro(process.env.ZORO_URL)) {
    super();
    this.zoro = zoro;
  }

  async search(query, page = 1) {
    const result = await this.zoro.search(query, page);
    return { ...result, results: (result.results || []).map(normalizeAnime) };
  }

  async getInfo(id) {
    return normalizeInfo(await this.zoro.fetchAnimeInfo(id));
  }

  async getWatchSources(episodeId, { server, dub = false } = {}) {
    const selectedServer = server || StreamingServers.VidCloud;
    if (!validServers.has(selectedServer)) {
      throw Object.assign(new Error("Unsupported streaming server"), { status: 400 });
    }
    return this.zoro.fetchEpisodeSources(
      episodeId,
      selectedServer,
      dub ? SubOrSub.DUB : SubOrSub.SUB,
    );
  }

  async getTopAiring(page = 1) {
    const result = await this.zoro.fetchTopAiring(page);
    return { ...result, results: (result.results || []).map(normalizeAnime) };
  }

  async getRecentEpisodes(page = 1) {
    const result = await this.zoro.fetchRecentlyUpdated(page);
    return { ...result, results: (result.results || []).map(normalizeAnime) };
  }

  async getGenres() {
    return this.zoro.fetchGenres();
  }
}
