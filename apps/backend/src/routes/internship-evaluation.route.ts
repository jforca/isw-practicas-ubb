import { Router } from 'express';
import {
	findOneController,
	findManyController,
	createController,
	updateController,
	deleteController,
} from '@controllers/internship-evaluation.controller';

const router = Router();

router.post('/', createController);
router.get('/find-many', findManyController);
router.get('/find-one/:id', findOneController);
router.patch('/update/:id', updateController);
router.delete('/delete/:id', deleteController);

export default router;
