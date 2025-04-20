import Joi from "joi";

export const createUserSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    bio: Joi.string().optional(),
    profilePicture: Joi.string().optional()
});

export const updateUserSchema = Joi.object({
    username: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    bio: Joi.string().optional(),
    profilePicture: Joi.string().optional()
}).min(1);