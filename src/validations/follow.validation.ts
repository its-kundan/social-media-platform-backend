import Joi from "joi";

export const followUserSchema = Joi.object({
    followerId: Joi.number().required(),
    followingId: Joi.number().required()
});

export const unfollowUserSchema = Joi.object({
    followerId: Joi.number().required(),
    followingId: Joi.number().required()
});