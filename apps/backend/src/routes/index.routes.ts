import { Router, Express } from 'express';
import { studentsRouter } from './students.routes';
import { coordinatorRouter } from './coordinator.routes';

export function routerApi(app: Express) {
	const router = Router();

	// Ruta de prueba para /api
	router.get('/', (_req, res) => {
		res.json({
			message: 'API funcionando correctamente',
			timestamp: new Date().toISOString(),
		});
	});

	router.use('/students', studentsRouter);
	router.use('/coordinators', coordinatorRouter);

	app.use('/api', router);
}
