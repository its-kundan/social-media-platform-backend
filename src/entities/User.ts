import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Post } from "./Post";
import { Like } from "./Like";
import { Follow } from "./Follow";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    profilePicture: string;

    @OneToMany(() => Post, post => post.author)
    posts: Post[];

    @OneToMany(() => Like, like => like.user)
    likes: Like[];

    @OneToMany(() => Follow, follow => follow.follower)
    following: Follow[];

    @OneToMany(() => Follow, follow => follow.following)
    followers: Follow[];
}