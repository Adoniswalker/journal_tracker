import { Router } from 'express';

import {CreateJournal} from "./controller";
import {checkJwt} from "../middleware/checkJWT";

const journalRoutes = Router();

journalRoutes.post('/create', checkJwt, CreateJournal);
export default journalRoutes;
