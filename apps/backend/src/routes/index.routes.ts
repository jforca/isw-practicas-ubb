import { Express, Router } from 'express';
import InternshipCentersRouter from '@routes/internship-centers.route';
import studentsRouter from './students.route';
import LogbookRouter from '@routes/logbook-entries.route';
import ReportsRouter from '@routes/reports.route';

export function routerApi(app: Express) {
	const api = Router();
	api.use('/internship-centers', InternshipCentersRouter);
	api.use('/students', studentsRouter);
	api.use('/logbook-entries', LogbookRouter);
	api.use('/reports', ReportsRouter);

	app.use('/api', api);
}
