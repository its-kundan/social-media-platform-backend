import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Hashtag } from '../entities/Hashtag';

const hashtagRepository = AppDataSource.getRepository(Hashtag);

export const getTrendingHashtags = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const hashtags = await hashtagRepository
      .createQueryBuilder('hashtag')
      // Use leftJoin instead of leftJoinAndSelect since we only need aggregated data
      .leftJoin('hashtag.posts', 'post')
      .select('hashtag.id', 'id')
      .addSelect('hashtag.tag', 'tag')
      .addSelect('COUNT(post.id)', 'postCount')
      // Group by all selected non-aggregated fields
      .groupBy('hashtag.id, hashtag.tag')
      .orderBy('postCount', 'DESC')
      .limit(limit)
      .getRawMany();

    res.json(hashtags);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
    res.status(500).json({ message: errorMessage });
  }
};
