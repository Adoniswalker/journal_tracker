import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import bcrypt from 'bcryptjs';
import {Journal} from "../jounal/model";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    email: string

    @Column()
    password: string

    @OneToMany(() => Journal, article => article.author)
    journals: Journal[];
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }
    checkIfPasswordMatch(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
