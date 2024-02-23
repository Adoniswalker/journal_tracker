import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {validate} from "class-validator";
import {Journal} from "./model";

export async function CreateJournal(req: Request, res: Response) {
    try {
        const {content} = req.body;

        const journalRepository = AppDataSource.getRepository(Journal);
        let journal = new Journal();
        journal.content = content;
        journal.author = res.locals.jwtPayload.id;
        const errors = await validate(journal);
        if (errors.length > 0) {
            return res.status(403).json(errors)
        } else {
            await journalRepository.manager.save(journal)
        }
        return res.status(201).json({message: 'Journal created successfully'});
    } catch (error) {
        console.error('Error in content creation:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

