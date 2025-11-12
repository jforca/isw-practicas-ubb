import { Express, Router } from 'express';
import InternshipCentersRouter from '@routes/internship-centers.route';
import { studentsRouter } from './students.routes';

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

	app.use('/api', router);
	const api = Router();
	api.use('/internship-centers', InternshipCentersRouter);

	// Empezar a usar las rutas bajo /api
	app.use('/api', api);
}
