import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { User } from "./User";

@Entity()
export class Follow {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.following)
    follower: User;

    @ManyToOne(() => User, user => user.followers)
    following: User;

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
}