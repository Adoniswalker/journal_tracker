import { Router } from 'express';

import {CreateJournal} from "./controller";
import {checkJwt} from "../middleware/checkJWT";
import {validatorJournal} from "../middleware/validations/jounal";

const journalRoutes = Router();

journalRoutes.post('/create', checkJwt, validatorJournal, CreateJournal);
export default journalRoutes;
