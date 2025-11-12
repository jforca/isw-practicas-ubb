import { Router } from 'express';
import {
	findOneController,
	findManyController,
	updateSupervisorController,
	updateReportController,
	clearSupervisorController,
	clearReportController,
	deleteController,
} from '@controllers/internship-evaluation.controller';

const router = Router();

router.get('/', findManyController);
router.get('/:id', findOneController);
router.patch('/:id/supervisor', updateSupervisorController);
router.patch('/:id/report', updateReportController);
router.post(
	'/:id/clear-supervisor',
	clearSupervisorController,
);
router.post('/:id/clear-report', clearReportController);
router.delete('/:id', deleteController);

export default router;
