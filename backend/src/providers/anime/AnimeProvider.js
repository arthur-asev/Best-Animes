/** Provider boundary for anime catalog and playback operations. */
export class AnimeProvider {
  async search(_query, _page) { throw new Error("AnimeProvider.search must be implemented"); }
  async getInfo(_id) { throw new Error("AnimeProvider.getInfo must be implemented"); }
  async getWatchSources(_episodeId, _options) { throw new Error("AnimeProvider.getWatchSources must be implemented"); }
}
