import { ProviderNotConfiguredError } from "../providers/anime/ProviderNotConfiguredError.js";

export class AnimeService {
  constructor(provider = null) { this.provider = provider; }

  getProvider() {
    if (!this.provider) throw new ProviderNotConfiguredError();
    return this.provider;
  }

  async search(query, page) { return this.getProvider().search(query, page); }
  async getInfo(id) { return this.getProvider().getInfo(id); }
  async getWatchSources(episodeId, options) { return this.getProvider().getWatchSources(episodeId, options); }
  async getTopAiring(page) { return this.getProvider().getTopAiring(page); }
  async getRecentEpisodes(page) { return this.getProvider().getRecentEpisodes(page); }
  async getGenres() { return this.getProvider().getGenres(); }
  async getProviderStatus() { return this.getProvider().getProviderStatus(); }
}
