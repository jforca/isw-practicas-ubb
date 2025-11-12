import { Express, Router } from 'express';
import InternshipCentersRouter from '@routes/internship-centers.route';

export function routerApi(app: Express) {
	const api = Router();
	api.use('/internship-centers', InternshipCentersRouter);

	// Empezar a usar las rutas bajo /api
	app.use('/api', api);
}
