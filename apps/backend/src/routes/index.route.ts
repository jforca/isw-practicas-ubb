import { Express, Router } from 'express';
import {
	InternshipCentersRouter,
	InternshipEvaluationRouter,
	StudentsRouter,
	LogbookRouter,
	OffersRouter,
	DocumentsRouter,
	ReportsRouter,
} from '@routes';

export function routerApi(app: Express) {
	const api = Router();
	api.use('/internship-centers', InternshipCentersRouter);
	api.use(
		'/internship-evaluations',
		InternshipEvaluationRouter,
	);
	api.use('/students', StudentsRouter);
	api.use('/offers', OffersRouter);
	api.use('/logbook-entries', LogbookRouter);
	api.use('/reports', ReportsRouter);
	api.use('/documents', DocumentsRouter);

	app.use('/api', api);
}
