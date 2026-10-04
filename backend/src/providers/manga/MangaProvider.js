/** Future Manga provider contract; no concrete provider is selected yet. */
export class MangaProvider {
  async search(_query) { throw new Error("MangaProvider.search must be implemented"); }
  async getInfo(_id) { throw new Error("MangaProvider.getInfo must be implemented"); }
  async getChapters(_id) { throw new Error("MangaProvider.getChapters must be implemented"); }
  async getPages(_chapterId) { throw new Error("MangaProvider.getPages must be implemented"); }
}
