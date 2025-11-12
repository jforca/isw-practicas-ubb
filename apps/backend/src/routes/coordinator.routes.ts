import { Router } from 'express';
import { listCoordinators } from '@controllers/coordinator.controller';

export const coordinatorRouter = Router();

coordinatorRouter.get('/', listCoordinators);
