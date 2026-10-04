import { Router } from "express";
import { AnimeService } from "../services/AnimeService.js";
import { createAnimeController } from "../controllers/animeController.js";
import { KuhiProvider } from "../providers/anime/KuhiProvider.js";
import { FallbackAnimeProvider } from "../providers/anime/FallbackAnimeProvider.js";
import { CachedAnimeProvider } from "../providers/anime/CachedAnimeProvider.js";

export function createAnimeRouter(redis = null) {
  const router = Router();
  const provider = new CachedAnimeProvider(
    new FallbackAnimeProvider([new KuhiProvider()]),
    redis,
  );
  const controller = createAnimeController(new AnimeService(provider));

  router.get("/search", controller.search);
  router.get("/info/:id", controller.info);
  router.get("/watch/:episodeId", controller.watch);
  router.get("/top-airing", controller.topAiring);
  router.get("/recent-episodes", controller.recentEpisodes);
  router.get("/genres", controller.genres);
  router.get("/providers/status", controller.providerStatus);

  return router;
}
