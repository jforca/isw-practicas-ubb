import { Router } from 'express';
import { LogbookEntriesControllers } from '@controllers/logbook-entries.controller';

const router = Router();

router.get('/find-many', LogbookEntriesControllers.findAll);

export default router;
