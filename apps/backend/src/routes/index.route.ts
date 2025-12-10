import { Express, Router } from 'express';
import InternshipCentersRouter from '@routes/internship-centers.route';
import InternshipEvaluationRouter from '@routes/internship-evaluation.route';
import { studentsRouter } from './students.route';
import LogbookRouter from '@routes/logbook-entries.route';
import OffersRouter from '@routes/offers.route';

export function routerApi(app: Express) {
	const api = Router();
	api.use('/internship-centers', InternshipCentersRouter);
	api.use(
		'/internship-evaluations',
		InternshipEvaluationRouter,
	);
	api.use('/students', studentsRouter);
	api.use('/offers', OffersRouter);
	api.use('/logbook-entries', LogbookRouter);

	app.use('/api', api);
}
