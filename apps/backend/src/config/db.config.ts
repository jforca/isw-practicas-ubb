import { DataSource } from 'typeorm';
import { env } from '@lib/env';
import {
	User,
	Account,
	Session,
	Verification,
	InternshipEvaluation,
} from '@entities';

export const AppDataSource = new DataSource({
	type: 'postgres',
	url: env.DATABASE_URL,
	entities: [
		User,
		Account,
		Session,
		Verification,
		InternshipEvaluation,
	],
	synchronize: true,
	logging: false,
});

export async function connectDB() {
	try {
		await AppDataSource.initialize();
		console.log(
			'✅ Conexión exitosa a la base de datos PostgreSQL!',
		);
	} catch (error) {
		console.error(
			'Error al conectar con la base de datos:',
			error,
		);
		process.exit(1);
	}
}
