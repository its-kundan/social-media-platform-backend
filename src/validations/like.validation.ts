import Joi from "joi";

export const likePostSchema = Joi.object({
    userId: Joi.number().required(),
    postId: Joi.number().required()
});

export const unlikePostSchema = Joi.object({
    userId: Joi.number().required(),
    postId: Joi.number().required()
});