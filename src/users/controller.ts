import {Request, Response} from "express";
import {User} from "./model";
import {AppDataSource} from "../data-source";
import {createJwtToken} from "../utils/createJwtToken";
import {JwtPayload} from "../types/JwtPayload";
import logger from "../utils/logger";

export async function SignUp(req: Request, res: Response) {
    try {
        const {email, password} = req.body;

        // Check if the email already exists
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({where: {email}});
        if (existingUser) {
            return res.status(400).json({email: ` ${existingUser.email} already exists`});
        }
        let user = new User();
        user.email = email;
        user.password = password;
        user.hashPassword();
        await userRepository.manager.save(user)
        // Return success response
        return res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        logger.error('Error in user registration:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}


// Route to handle user login
export async function Login(req: Request, res: Response) {
    try {
        const {email, password} = req.body;

        // Find user by email and password
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({email: email});
        if (!user) {
            return res.status(401).json({message: 'Incorrect email or password'});
        }
        if (!user.checkIfPasswordMatch(password)) {
            return res.status(401).json({message: 'Incorrect email or password'});
        }
        const jwtPayload: JwtPayload = {
            id: user.id,
            email: user.email,
        };
        try {
            const token = createJwtToken(jwtPayload);
            return res.status(200).json({message: 'Login successful', token: `Bearer ${token}`});
        } catch (err) {
            logger.error("Error in token creation", err)
            return res.status(401).json({message: 'Token can\'t be created'});

        }
        // Return success response
    } catch (error) {
        logger.error('Error in user login:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

