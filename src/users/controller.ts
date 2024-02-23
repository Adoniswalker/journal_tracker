import {Request, Response} from "express";
import {User} from "../entities/User";
import {AppDataSource} from "../data-source";

// app.post('/register', async (req: Request, res: Response) => {
export async function SignUp(req: Request, res: Response) {
    try {
        const {email, password} = req.body;

        // Check if the email already exists
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({where: {email}});
        if (existingUser) {
            return res.status(400).json({message: 'Email already exists'});
        }

        // Create a new user
        const newUser = userRepository.create({email, password});
        await userRepository.save(newUser);

        // Return success response
        return res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        console.error('Error in user registration:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}


// Route to handle user login
export async function Login(req: Request, res: Response) {
    try {
        const {email, password} = req.body;

        // Find user by email and password
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({where: {email, password}});
        if (!user) {
            return res.status(401).json({message: 'Invalid email or password'});
        }

        // Return success response
        return res.status(200).json({message: 'Login successful'});
    } catch (error) {
        console.error('Error in user login:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

