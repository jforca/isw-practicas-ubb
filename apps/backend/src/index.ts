import '@lib/env';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import { connectDB } from './config/db.config';
import { routerApi } from './routes/index.routes';

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Ruta principal de bienvenida
app.get('/', (req: Request, res: Response) => {
	console.log(req.headers);
	res.send('¡Bienvenido a mi API REST con TypeORM!');
});

// Inicializa la conexión a la base de datos
connectDB()
	.then(() => {
		// Carga todas las rutas de la aplicación
		routerApi(app);

		// Levanta el servidor Express
		const PORT = process.env.PORT || 3000;
		app.listen(PORT, () => {
			console.log(
				`Servidor iniciado en http://localhost:${PORT}`,
			);
		});
	})
	.catch((error: unknown) => {
		console.log(
			'Error al conectar con la base de datos:',
			error,
		);
		process.exit(1);
	});
