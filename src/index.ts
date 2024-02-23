import * as bodyParser from "body-parser";
import express, {Express} from "express";
import "reflect-metadata";
import userRoutes from "./users/routes";

require('dotenv').config()
import { AppDataSource } from "./data-source"
import journalRoutes from "./jounal/routes";
AppDataSource.initialize().then(async () => {
    const app:Express = express();
    app.use(bodyParser.json());
    app.use('/users/', userRoutes);
    app.use('/journal/', journalRoutes);
    app.listen(3000);

    console.log("Express application is up and running on port 3000");

}).catch(error => console.log("TypeORM connection error: ", error))
