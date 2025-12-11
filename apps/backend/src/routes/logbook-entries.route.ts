import { Router } from 'express';
import { LogbookEntriesControllers } from '@controllers/logbook-entries.controller';

const router = Router();

router.get(
	'/find-many',
	LogbookEntriesControllers.findMany,
);
router.post(
	'/create-one',
	LogbookEntriesControllers.createOne,
);

export default router;
