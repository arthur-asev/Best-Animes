import crypto from "node:crypto";
import { AnimeProvider } from "./AnimeProvider.js";
import { logEvent } from "../../utils/logger.js";

const CACHE_METHODS = {
  search: Number(process.env.CATALOG_SEARCH_TTL_SECONDS || 300),
  getInfo: Number(process.env.CATALOG_INFO_TTL_SECONDS || 1800),
  getTopAiring: Number(process.env.CATALOG_TOP_TTL_SECONDS || 300),
  getRecentEpisodes: Number(process.env.CATALOG_RECENT_TTL_SECONDS || 120),
  getGenres: Number(process.env.CATALOG_GENRES_TTL_SECONDS || 86400),
};

export class CachedAnimeProvider extends AnimeProvider {
  constructor(provider, redis) {
    super();
    this.provider = provider;
    this.redis = redis;
  }

  async invoke(method, args) {
    const ttl = CACHE_METHODS[method];
    if (!this.redis || !ttl || ttl <= 0) return this.provider[method](...args);
    const digest = crypto.createHash("sha256").update(JSON.stringify(args)).digest("hex");
    const key = `catalog:v1:${method}:${digest}`;
    try {
      const cached = await this.redis.get(key);
      if (cached !== null) {
        logEvent("catalog.cache", { method, result: "hit" });
        return JSON.parse(cached);
      }
    } catch {
      logEvent("catalog.cache", { method, result: "read_error" });
    }
    logEvent("catalog.cache", { method, result: "miss" });
    const result = await this.provider[method](...args);
    try {
      await this.redis.setex(key, ttl, JSON.stringify(result));
    } catch {
      logEvent("catalog.cache", { method, result: "write_error" });
    }
    return result;
  }

  search(...args) { return this.invoke("search", args); }
  getInfo(...args) { return this.invoke("getInfo", args); }
  getWatchSources(...args) { return this.provider.getWatchSources(...args); }
  getTopAiring(...args) { return this.invoke("getTopAiring", args); }
  getRecentEpisodes(...args) { return this.invoke("getRecentEpisodes", args); }
  getGenres(...args) { return this.invoke("getGenres", args); }
  getProviderStatus(...args) { return this.provider.getProviderStatus(...args); }
}
