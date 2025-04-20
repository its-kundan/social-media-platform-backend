import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Follow } from '../entities/Follow';
import { User } from '../entities/User';

const followRepository = AppDataSource.getRepository(Follow);
const userRepository = AppDataSource.getRepository(User);

export const followUser = async (req: Request, res: Response) => {
  try {
    const { followerId, followingId } = req.body;

    if (followerId === followingId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const follower = await userRepository.findOneBy({ id: followerId });
    if (!follower) return res.status(404).json({ message: 'Follower user not found' });

    const following = await userRepository.findOneBy({ id: followingId });
    if (!following) return res.status(404).json({ message: 'Following user not found' });

    const existingFollow = await followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });
    if (existingFollow) return res.status(400).json({ message: 'Already following this user' });

    const follow = followRepository.create({ follower, following });
    await followRepository.save(follow);

    return res.status(201).json(follow);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unexpected error';
    return res.status(500).json({ message: errorMessage });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const { followerId, followingId } = req.body;

    const follow = await followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });
    if (!follow) return res.status(404).json({ message: 'Follow relationship not found' });

    await followRepository.remove(follow);
    return res.json({ message: 'Unfollowed successfully' });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unexpected error';
    return res.status(500).json({ message: errorMessage });
  }
};
