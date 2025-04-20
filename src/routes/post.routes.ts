import { Router } from 'express';
import * as postController from '../controllers/post.controller';
import { validate } from '../middleware/validation.middleware';
import * as postValidations from '../validations/post.validation';

const router = Router();

router.post('/', validate(postValidations.createPostSchema), postController.createPost);
// Place the static route before the parameterized route to ensure proper matching
router.get('/user/:userId', postController.getPostsByUser);
router.get('/:id', postController.getPostById);
router.delete('/:id', postController.deletePost);

export default router;
