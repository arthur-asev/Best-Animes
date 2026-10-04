import { Router } from "express";
import { AnimeService } from "../services/AnimeService.js";
import { createAnimeController } from "../controllers/animeController.js";
import { ZoroProvider } from "../providers/anime/ZoroProvider.js";

const router = Router();
const controller = createAnimeController(new AnimeService(new ZoroProvider()));

router.get("/search", controller.search);
router.get("/info/:id", controller.info);
router.get("/watch/:episodeId", controller.watch);
router.get("/top-airing", controller.topAiring);
router.get("/recent-episodes", controller.recentEpisodes);
router.get("/genres", controller.genres);

export default router;
