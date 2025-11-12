import { Router } from 'express';
import { InternshipCenterControllers } from '@controllers/internship-centers.controller';

const router = Router();

router.get(
	'/find-one/:id',
	InternshipCenterControllers.findOne,
);
router.get(
	'/find-many',
	InternshipCenterControllers.findMany,
);

export default router;
