import { Express, Router } from 'express';
import InternshipCentersRouter from '@routes/internship-centers.route';
import { studentsRouter } from './students.routes';
import LogbookRouter from '@routes/logbook-entries.route';

export function routerApi(app: Express) {
	const api = Router();
	api.use('/internship-centers', InternshipCentersRouter);
	api.use('/students', studentsRouter);
	api.use('/logbook-entries', LogbookRouter);

	// Empezar a usar las rutas bajo /api
	app.use('/api', api);
}
