import { Router } from 'express';
import {
	findOneController,
	findManyController,
} from '@controllers/internship-centers.controller';

const router = Router();

router.get('/find-one/:id', findOneController);
router.get('/find-many', findManyController);

export default router;
