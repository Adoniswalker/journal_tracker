import {NextFunction} from "express";
import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {JwtPayload} from "../types/JwtPayload";
import {sendErrorRes} from "../utils/responseMessages";
import logger from "../utils/logger";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.status(401).json(sendErrorRes( `Authorization header not provided`, {}, {}));
    }

    const token = authHeader.split(' ')[1];
    let jwtPayload: { [key: string]: any };
    try {
        jwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as { [key: string]: any };
        ['iat', 'exp'].forEach((keyToRemove) => delete jwtPayload[keyToRemove]);
        res.locals.jwtPayload = jwtPayload as JwtPayload;
    } catch (err) {
        logger.error(`JWT error ${err}`)
        return res.status(401).json(sendErrorRes( `JWT error ${err}`, {}, {}));
    }
    return next()
};
