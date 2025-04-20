import { Router } from "express";
import * as followController from "../controllers/follow.controller";
import { validate } from "../middleware/validation.middleware";
import * as followValidations from "../validations/follow.validation";

const router = Router();

router.post("/", validate(followValidations.followUserSchema), followController.followUser);
router.delete("/", validate(followValidations.unfollowUserSchema), followController.unfollowUser);

export default router;