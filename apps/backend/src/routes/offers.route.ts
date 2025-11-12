import { Router } from 'express';
import { offersController } from '@controllers/offers.controller';

const router = Router();

router.get('/find-one/:id', offersController.findOne);
router.get('/find-many', offersController.findMany);

export default router;
