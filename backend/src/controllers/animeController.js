import { ProviderNotConfiguredError } from "../providers/anime/ProviderNotConfiguredError.js";

export function createAnimeController(service) {
  const handle = (operation) => async (req, res) => {
    try {
      const result = await operation(req);
      return res.json(result);
    } catch (error) {
      if (error.status === 400) return res.status(400).json({ error: "invalid_request", message: error.message });
      if (error instanceof ProviderNotConfiguredError) return res.status(503).json({ error: "anime_provider_unavailable" });
      console.error("Anime API error:", error.message);
      return res.status(502).json({ error: "anime_provider_error" });
    }
  };

  return {
    search: handle((req) => {
      const query = String(req.query.q || "").trim();
      if (!query) return Promise.reject(Object.assign(new Error("q is required"), { status: 400 }));
      return service.search(query, Number(req.query.page) || 1);
    }),
    info: handle((req) => service.getInfo(req.params.id)),
    watch: handle((req) => service.getWatchSources(req.params.episodeId, {
      server: req.query.server ? String(req.query.server) : undefined,
      dub: req.query.dub === "true",
    })),
    topAiring: handle((req) => service.getTopAiring(Number(req.query.page) || 1)),
    recentEpisodes: handle((req) => service.getRecentEpisodes(Number(req.query.page) || 1)),
    genres: handle(() => service.getGenres()),
  };
}
