import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { validate } from "../middleware/validation.middleware";
import * as userValidations from "../validations/user.validation";

const router = Router();

// CRUD routes
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.post("/", validate(userValidations.createUserSchema), userController.createUser);
router.put("/:id", validate(userValidations.updateUserSchema), userController.updateUser);
router.delete("/:id", userController.deleteUser);

// Special endpoints
router.get("/:userId/feed", userController.getUserFeed);
router.get("/posts/hashtag/:tag", userController.getPostsByHashtag);
router.get("/:id/followers", userController.getUserFollowers);
router.get("/:id/activity", userController.getUserActivity);

export default router;