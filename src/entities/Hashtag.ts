import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Post } from "./Post";

@Entity()
export class Hashtag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    tag: string;

    @ManyToMany(() => Post, post => post.hashtags)
    posts: Post[];
}