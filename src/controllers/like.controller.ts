import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Like } from "../entities/Like";
import { User } from "../entities/User";
import { Post } from "../entities/Post";

const likeRepository = AppDataSource.getRepository(Like);
const userRepository = AppDataSource.getRepository(User);
const postRepository = AppDataSource.getRepository(Post);

export const likePost = async (req: Request, res: Response) => {
    try {
        const { userId, postId } = req.body;
        
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) return res.status(404).json({ message: "User not found" });
        
        const post = await postRepository.findOneBy({ id: postId });
        if (!post) return res.status(404).json({ message: "Post not found" });

        const existingLike = await likeRepository.findOne({ where: { user: { id: userId }, post: { id: postId } } });
        if (existingLike) return res.status(400).json({ message: "Post already liked" });

        const like = likeRepository.create({ user, post });
        await likeRepository.save(like);
        
        res.status(201).json(like);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unexpected error";
        res.status(500).json({ message: errorMessage });
    }
};

export const unlikePost = async (req: Request, res: Response) => {
    try {
        const { userId, postId } = req.body;
        
        const like = await likeRepository.findOne({ 
            where: { user: { id: userId }, post: { id: postId } }
        });
        if (!like) return res.status(404).json({ message: "Like not found" });
        
        await likeRepository.remove(like);
        res.json({ message: "Post unliked successfully" });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unexpected error";
        res.status(500).json({ message: errorMessage });
    }
};