import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import {ErrorValidation} from "../../types/errors";
export const validatorLogin = (req: Request, res: Response, next: NextFunction) => {
    let { email, password } = req.body;
    const errorsValidation: ErrorValidation[] = [];

    email = !email ? '' : email;
    password = !password ? '' : password;

    if (!validator.isEmail(email)) {
        errorsValidation.push({ email: 'Email is invalid' });
    }

    if (validator.isEmpty(email)) {
        errorsValidation.push({ email: 'Email field is required' });
    }

    if (validator.isEmpty(password)) {
        errorsValidation.push({ password: 'Password field is required' });
    }

    if (errorsValidation.length !== 0) {
        return res.status(401).json({message: errorsValidation});
    }
    return next();
};

export const validatorRegister = (req: Request, res: Response, next: NextFunction) => {
    let { email, password, passwordConfirm } = req.body;
    const errorsValidation: ErrorValidation[] = [];

    email = !email ? '' : email;
    password = !password ? '' : password;
    passwordConfirm = !passwordConfirm ? '' : passwordConfirm;

    if (!validator.isEmail(email)) {
        errorsValidation.push({ email: 'Email is invalid' });
    }

    if (validator.isEmpty(email)) {
        errorsValidation.push({ email: 'Email is required' });
    }

    if (validator.isEmpty(password)) {
        errorsValidation.push({ password: 'Password is required' });
    }

    if (!validator.isLength(password, { min: 7 })) {
        errorsValidation.push({
            password: `Password must be at least 7 characters`,
        });
    }

    if (errorsValidation.length !== 0) {
        return res.status(401).json({message: errorsValidation});
    }
    return next();
};
