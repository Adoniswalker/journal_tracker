import {NextFunction, Request, Response} from "express";
import {ErrorValidation} from "../../types/errors";
import validator from "validator";
import {sendErrorRes} from "../../utils/responseMessages";

export const validatorJournal = (req: Request, res: Response, next: NextFunction) => {
    let { content } = req.body;
    const errorsValidation: ErrorValidation[] = [];

    content = !content ? '' : content;

    if (validator.isEmpty(content)) {
        errorsValidation.push({ content: 'Journal is required' });
    }

    if (!validator.isLength(content, {min:0, max:500})) {
        errorsValidation.push({ content: 'Journal is too long. Kindly reduce it to 500 chars' });
    }

    if (errorsValidation.length !== 0) {
        return res.status(401).json(sendErrorRes("Kindly correct the errors", errorsValidation, {
            content: content,
        }));
    }
    return next();
};
