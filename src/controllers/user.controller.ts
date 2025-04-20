import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Like } from "../entities/Like";
import { Post } from "../entities/Post";
import { Follow } from "../entities/Follow";

const userRepository = AppDataSource.getRepository(User);
const postRepository = AppDataSource.getRepository(Post);
const likeRepository = AppDataSource.getRepository(Like);
const followRepository = AppDataSource.getRepository(Follow);

export const getUserFeed = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const { limit = 10, offset = 0 } = req.query;

        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ["following"]
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const followingIds = user.following.map(follow => follow.following.id);
        followingIds.push(userId); // Include user's own posts

        const posts = await postRepository.find({
            where: { author: { id: followingIds } },
            relations: ["author", "likes", "hashtags"],
            order: { createdAt: "DESC" },
            take: Number(limit),
            skip: Number(offset)
        });

        res.json(
            posts.map(post => ({
                ...post,
                likeCount: post.likes.length
            }))
        );
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unexpected error";
        res.status(500).json({ message: errorMessage });
    }
};

export const getPostsByHashtag = async (req: Request, res: Response) => {
    try {
        const tag = req.params.tag;
        const { limit = 10, offset = 0 } = req.query;

        const posts = await postRepository
            .createQueryBuilder("post")
            .leftJoinAndSelect("post.hashtags", "hashtag")
            .leftJoinAndSelect("post.author", "author")
            .leftJoinAndSelect("post.likes", "like")
            .where("LOWER(hashtag.tag) = LOWER(:tag)", { tag })
            .orderBy("post.createdAt", "DESC")
            .take(Number(limit))
            .skip(Number(offset))
            .getMany();

        res.json(
            posts.map(post => ({
                ...post,
                likeCount: post.likes.length
            }))
        );
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unexpected error";
        res.status(500).json({ message: errorMessage });
    }
};

export const getUserFollowers = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        const { limit = 10, offset = 0 } = req.query;

        const [followers, total] = await followRepository.findAndCount({
            where: { following: { id: userId } },
            relations: ["follower"],
            order: { createdAt: "DESC" },
            take: Number(limit),
            skip: Number(offset)
        });

        res.json({
            followers: followers.map(f => f.follower),
            total
        });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unexpected error";
        res.status(500).json({ message: errorMessage });
    }
};

export const getUserActivity = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        const { type, startDate, endDate, limit = 10, offset = 0 } = req.query;

        let query = postRepository
            .createQueryBuilder("post")
            .where("post.authorId = :userId", { userId })
            .orderBy("post.createdAt", "DESC");

        if (startDate) {
            query = query.andWhere("post.createdAt >= :startDate", { startDate });
        }
        if (endDate) {
            query = query.andWhere("post.createdAt <= :endDate", { endDate });
        }

        const posts = await query.take(Number(limit)).skip(Number(offset)).getMany();

        res.json(posts);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unexpected error";
        res.status(500).json({ message: errorMessage });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userRepository.find();
        res.json(users);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unexpected error";
        res.status(500).json({ message: errorMessage });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await userRepository.findOneBy({
            id: parseInt(req.params.id)
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unexpected error";
        res.status(500).json({ message: errorMessage });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const user = userRepository.create(req.body);
        const results = await userRepository.save(user);
        res.status(201).json(results);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unexpected error";
        res.status(500).json({ message: errorMessage });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await userRepository.findOneBy({
            id: parseInt(req.params.id)
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        userRepository.merge(user, req.body);
        const results = await userRepository.save(user);
        res.json(results);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unexpected error";
        res.status(500).json({ message: errorMessage });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const results = await userRepository.delete(req.params.id);
        if (results.affected === 0)
            return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unexpected error";
        res.status(500).json({ message: errorMessage });
    }
};