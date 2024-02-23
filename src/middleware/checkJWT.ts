import {NextFunction} from "express";
import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {JwtPayload} from "../types/JwtPayload";
import {createJwtToken} from "../utils/createJwtToken";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.status(201).json({message: 'Authorization header not provided'});
    }

    const token = authHeader.split(' ')[1];
    let jwtPayload: { [key: string]: any };
    try {
        jwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as { [key: string]: any };
        ['iat', 'exp'].forEach((keyToRemove) => delete jwtPayload[keyToRemove]);
        res.locals.jwtPayload = jwtPayload as JwtPayload;
    } catch (err) {
        return res.status(401).json({message: `JWT error ${err}`});
    }

    try {
        // Refresh and send a new token on every request
        const newToken = createJwtToken(jwtPayload as JwtPayload);
        res.setHeader('token', `Bearer ${newToken}`);
        return next();
    } catch (err) {
        return res.status(401).json({message: 'Token can\'t be created'});
    }
};
