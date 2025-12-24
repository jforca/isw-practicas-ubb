import { Router } from 'express';
import { InternshipCenterControllers } from '@controllers/internship-centers.controller';

const router = Router();

router.post(
	'/create-one',
	InternshipCenterControllers.createOne,
);
router.get(
	'/find-one/:id',
	InternshipCenterControllers.findOne,
);
router.get(
	'/find-many',
	InternshipCenterControllers.findMany,
);
router.put(
	'/update-one/:id',
	InternshipCenterControllers.updateOne,
);
router.delete(
	'/delete-one/:id',
	InternshipCenterControllers.deleteOne,
);

export default router;
