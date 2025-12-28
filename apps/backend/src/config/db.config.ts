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
	EvaluationItem,
	EvaluationResponse,
	Application,
	ApplicationDocuments,
	LogbookEntries,
	Offer,
	InternshipCenter,
	Supervisor,
	Internship,
	OffersType,
	OfferOfferType,
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
		EvaluationItem,
		EvaluationResponse,
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
		OffersType,
		OfferOfferType,
	],
	synchronize: true,
	logging: false,
});

export async function connectDB() {
	try {
		await AppDataSource.initialize();
		// Registrar suscriptor después de inicializar para evitar inicialización circular
		try {
			// require en tiempo de ejecución para posponer la evaluación del módulo
			// hasta después de que TypeORM haya procesado las entidades
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const {
				InternshipSubscriber,
			} = require('../subscribers/internship.subscriber');
			AppDataSource.subscribers.push(
				new InternshipSubscriber(),
			);
		} catch (subErr) {
			console.warn(
				'No se pudo registrar InternshipSubscriber:',
				subErr,
			);
		}

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
