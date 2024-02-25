import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
// import {validate} from "class-validator";
import {Journal} from "./model";
import logger from "../utils/logger";
import {sendErrorRes, sendSuccessRes} from "../utils/responseMessages";

export async function CreateJournal(req: Request, res: Response) {
    try {
        const {content} = req.body;

        const journalRepository = AppDataSource.getRepository(Journal);
        let journal = new Journal();
        journal.content = content;
        journal.author = res.locals.jwtPayload.id;
        await journalRepository.manager.save(journal)
        return res.status(201).json(sendSuccessRes('Journal created successfully', journal));
    } catch (error) {
        logger.error('Error in journal creation:', error);
        return res.status(500).json(sendErrorRes('Internal server error', {}, {}));
    }
}

