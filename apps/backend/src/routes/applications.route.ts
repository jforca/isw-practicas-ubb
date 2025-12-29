import { applicationsController } from '@controllers/applications.controller';
import { Router } from 'express';

const router = Router();

router.post(
	'/create-one',
	applicationsController.createOne,
);
router.get(
	'/find-by-student/:studentId',
	applicationsController.findByStudent,
);
router.get('/find-one/:id', applicationsController.findOne);
router.get('/find-many', applicationsController.findMany);
router.patch(
	'/update-status/:id',
	applicationsController.updateStatus,
);

export default router;
