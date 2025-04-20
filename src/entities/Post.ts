import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";
import { Like } from "./Like";
import { Hashtag } from "./Hashtag";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @ManyToOne(() => User, user => user.posts)
    author: User;

    @OneToMany(() => Like, like => like.post)
    likes: Like[];

    @ManyToMany(() => Hashtag, hashtag => hashtag.posts)
    @JoinTable()
    hashtags: Hashtag[];
}