import { Router } from "express";

const router = Router();
const unavailable = (_req, res) => res.status(501).json({ error: "manga_provider_unavailable" });
router.get("/search", unavailable);
router.get("/info/:id", unavailable);
router.get("/chapter/:chapterId", unavailable);

export default router;
