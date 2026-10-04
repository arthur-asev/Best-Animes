/** Manga service intentionally has no concrete provider until one is selected. */
export class MangaService {
  constructor(provider = null) { this.provider = provider; }
  getProvider() {
    if (!this.provider) throw new Error("Manga provider is not configured");
    return this.provider;
  }
  search(query) { return this.getProvider().search(query); }
  getInfo(id) { return this.getProvider().getInfo(id); }
  getChapters(id) { return this.getProvider().getChapters(id); }
  getPages(chapterId) { return this.getProvider().getPages(chapterId); }
}
