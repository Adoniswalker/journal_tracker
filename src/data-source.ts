import "reflect-metadata"
import { DataSource } from "typeorm"
import {User} from "./users/model";
import {Journal} from "./jounal/model";

require('dotenv').config()
export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User, Journal],
    migrations: [],
    subscribers: [],
})
