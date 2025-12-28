import { Router } from 'express';
import { offersController } from '@controllers/offers.controller';

const router = Router();

router.get('/types', offersController.findOfferTypes);
router.get('/find-one/:id', offersController.findOne);
router.get('/find-many', offersController.findMany);
router.post('/create-one', offersController.createOne);
router.put('/update-one/:id', offersController.updateOne);
router.delete(
	'/delete-one/:id',
	offersController.deleteOne,
);

export default router;
