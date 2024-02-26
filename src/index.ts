import * as bodyParser from "body-parser";
import express, {Express} from "express";
import cors from "cors";
import "reflect-metadata";
import userRoutes from "./users/routes";

require('dotenv').config()
import { AppDataSource } from "./data-source"
import journalRoutes from "./jounal/routes";
import {checkMails} from "./utils/send_journals";
import envVarsSchema from "./utils/env_validator";
import cron from "node-cron";
import logger from "./utils/logger";
AppDataSource.initialize().then(async () => {
    const app:Express = express();
    app.use(cors())
    app.use(bodyParser.json());
    app.use('/users/', userRoutes);
    app.use('/journal/', journalRoutes);
    app.listen(envVarsSchema.PORT);
    // const task = cron.schedule('0 12 * * *', () => {
    //     const executeTask = async () => {
    //         try {
    //             await checkMails()
    //         } catch (error) {
    //             logger.error('Error running scheduled task:', error);
    //         }
    //     };
    //
    //     executeTask(); // Run the task using the function
    // });
    //
    // task.start();

    await checkMails()
    logger.info(`Express application is up and running on port ${envVarsSchema.PORT}`);

}).catch(error => logger.error("TypeORM connection error: ", error))
