import { DataSource } from 'typeorm';
import { env } from '@lib/env';
import {
	Document,
	User,
	Account,
	Session,
	Verification,
	Student,
	Coordinator,
	InternshipEvaluation,
	Application,
	ApplicationDocuments,
	LogbookEntries,
	Offer,
	InternshipCenter,
	Supervisor,
	Internship,
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
		Student,
		Coordinator,
		Document,
		Application,
		ApplicationDocuments,
		LogbookEntries,
		Offer,
		InternshipCenter,
		Supervisor,
		Internship,
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
