import jwt from 'jsonwebtoken';

import { JwtPayload } from '../types/JwtPayload';
// const secretKey = process.env.JWT_SECRET;
export const createJwtToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRATION,
    });
};
