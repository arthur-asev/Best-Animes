import { AnimeProvider } from "./AnimeProvider.js";
import { logEvent } from "../../utils/logger.js";

/** Tries providers in order and moves to the next one only when an operation fails. */
export class FallbackAnimeProvider extends AnimeProvider {
  constructor(providers = []) {
    super();
    this.providers = providers.filter(Boolean);
  }

  async invoke(operation, ...args) {
    let lastError;
    for (const provider of this.providers) {
      if (typeof provider[operation] !== "function") continue;
      try {
        return await provider[operation](...args);
      } catch (error) {
        if (error.status === 400 || (error.response?.status && error.response.status < 500)) throw error;
        lastError = error;
        logEvent("anime.provider.fallback", { operation, provider: provider.constructor?.name || "anonymous" });
      }
    }
    if (lastError) throw lastError;
    throw new Error(`No anime provider implements ${operation}`);
  }

  search(...args) { return this.invoke("search", ...args); }
  getInfo(...args) { return this.invoke("getInfo", ...args); }
  getWatchSources(...args) { return this.invoke("getWatchSources", ...args); }
  getTopAiring(...args) { return this.invoke("getTopAiring", ...args); }
  getRecentEpisodes(...args) { return this.invoke("getRecentEpisodes", ...args); }
  getGenres(...args) { return this.invoke("getGenres", ...args); }
  getProviderStatus(...args) { return this.invoke("getProviderStatus", ...args); }
}
