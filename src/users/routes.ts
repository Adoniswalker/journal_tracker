import { Router } from 'express';

// import { login, register } from 'controllers/auth';
// import { validatorLogin, validatorRegister, validatorChangePassword } from 'middleware/validation/auth';
import {Login, SignUp} from "./controller";

const userRoutes = Router();

userRoutes.post('/singup',  SignUp);
userRoutes.post('/login',  Login);
export default userRoutes;
