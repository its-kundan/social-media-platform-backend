import { Router } from "express";
import * as hashtagController from "../controllers/hashtag.controller";

const router = Router();

router.get("/trending", hashtagController.getTrendingHashtags);

export default router;