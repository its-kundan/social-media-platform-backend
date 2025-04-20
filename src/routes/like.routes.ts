import { Router } from "express";
import * as likeController from "../controllers/like.controller";
import { validate } from "../middleware/validation.middleware";
import * as likeValidations from "../validations/like.validation";

const router = Router();

router.post("/", validate(likeValidations.likePostSchema), likeController.likePost);
router.delete("/", validate(likeValidations.unlikePostSchema), likeController.unlikePost);

export default router;