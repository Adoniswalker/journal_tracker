import { Router } from 'express';

// import { login, register } from 'controllers/auth.ts';
// import { validatorLogin, validatorRegister, validatorChangePassword } from 'middleware/validation/auth.ts';
import {Login, SignUp} from "./controller";
import {validatorLogin, validatorRegister} from "../middleware/validations/auth";

const userRoutes = Router();

userRoutes.post('/signup', validatorRegister, SignUp);
userRoutes.post('/login', validatorLogin,  Login);
export default userRoutes;
