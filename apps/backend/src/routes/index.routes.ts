import { Express, Router } from 'express';
import InternshipCentersRouter from '@routes/internship-centers.route';
import InternshipEvaluationRouter from '@routes/internship-evaluation.route';

export function routerApi(app: Express) {
	const api = Router();
	api.use('/internship-centers', InternshipCentersRouter);
	api.use(
		'/internship-evaluations',
		InternshipEvaluationRouter,
	);

	app.use('/api', api);
}
