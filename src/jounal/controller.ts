import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
// import {validate} from "class-validator";
import {Journal} from "./model";
import logger from "../utils/logger";

export async function CreateJournal(req: Request, res: Response) {
    try {
        const {content} = req.body;

        const journalRepository = AppDataSource.getRepository(Journal);
        let journal = new Journal();
        journal.content = content;
        journal.author = res.locals.jwtPayload.id;
        await journalRepository.manager.save(journal)
        // }
        return res.status(201).json({message: 'Journal created successfully'});
    } catch (error) {
        logger.error('Error in journal creation:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

