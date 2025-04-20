import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { Hashtag } from "../entities/Hashtag";

const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);
const hashtagRepository = AppDataSource.getRepository(Hashtag);

export const createPost = async (req: Request, res: Response) => {
    try {
        const { content, authorId, hashtags } = req.body;
        
        const author = await userRepository.findOneBy({ id: authorId });
        if (!author) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const post = postRepository.create({ content, author });
        
        // Process hashtags
        if (hashtags && hashtags.length > 0) {
            const hashtagEntities = await Promise.all(
                hashtags.map(async (tag: string) => {
                    let hashtag = await hashtagRepository.findOne({ where: { tag } });
                    if (!hashtag) {
                        hashtag = hashtagRepository.create({ tag });
                        await hashtagRepository.save(hashtag);
                    }
                    return hashtag;
                })
            );
            post.hashtags = hashtagEntities;
        }
        
        await postRepository.save(post);
        res.status(201).json(post);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unexpected error";
        res.status(500).json({ message: errorMessage });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
        const post = await postRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["author", "likes", "hashtags"]
        });
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json({
            ...post,
            likeCount: post.likes.length
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unexpected error";
        res.status(500).json({ message: errorMessage });
    }
};

export const getPostsByUser = async (req: Request, res: Response) => {
    try {
        const { limit = 10, offset = 0 } = req.query;
        const posts = await postRepository.find({
            where: { author: { id: parseInt(req.params.userId) } },
            relations: ["author", "likes", "hashtags"],
            order: { createdAt: "DESC" },
            take: Number(limit),
            skip: Number(offset)
        });
        res.json(posts.map(post => ({
            ...post,
            likeCount: post.likes.length
        })));
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unexpected error";
        res.status(500).json({ message: errorMessage });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const result = await postRepository.delete(req.params.id);
        if (result.affected === 0)
            return res.status(404).json({ message: "Post not found" });
        res.json({ message: "Post deleted successfully" });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unexpected error";
        res.status(500).json({ message: errorMessage });
    }
};