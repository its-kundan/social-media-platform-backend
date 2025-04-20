import Joi from "joi";

export const createPostSchema = Joi.object({
    content: Joi.string().required().max(1000),
    authorId: Joi.number().required(),
    hashtags: Joi.array().items(Joi.string()).optional()
});