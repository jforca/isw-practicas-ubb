import { Router, Express } from 'express';

export function routerApi(app: Express) {
	const router = Router();

	// Ruta de prueba para /api
	router.get('/', (_req, res) => {
		res.json({
			message: 'API funcionando correctamente',
			timestamp: new Date().toISOString(),
		});
	});

	app.use('/api', router);
}
