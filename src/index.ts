import * as bodyParser from "body-parser";
import express, {Express} from "express";
import cors from "cors";
import "reflect-metadata";
import userRoutes from "./users/routes";

require('dotenv').config()
import { AppDataSource } from "./data-source"
import journalRoutes from "./jounal/routes";
import {checkMails} from "./utils/send_journals";
AppDataSource.initialize().then(async () => {
    const app:Express = express();
    app.use(cors())
    app.use(bodyParser.json());
    app.use('/users/', userRoutes);
    app.use('/journal/', journalRoutes);
    app.listen(process.env.PORT);
    await checkMails()

    console.log(`Express application is up and running on port ${process.env.PORT}`);

}).catch(error => console.log("TypeORM connection error: ", error))
