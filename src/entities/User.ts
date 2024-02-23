import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {
    IsEmail,
} from "class-validator";


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    @IsEmail()
    email: string
    @Column()
    password: string
}
