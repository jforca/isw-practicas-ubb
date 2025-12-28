import { AppDataSource } from '../../config/db.config';
import {
	Internship,
	Application,
	Document,
	Offer,
	Coordinator,
	Supervisor,
	User,
} from '@entities';
import path from 'path';

export async function seedInternships() {
	const internshipRepo =
		AppDataSource.getRepository(Internship);
	const appRepo = AppDataSource.getRepository(Application);
	const docRepo = AppDataSource.getRepository(Document);
	const offerRepo = AppDataSource.getRepository(Offer);
	const coordRepo =
		AppDataSource.getRepository(Coordinator);
	const supRepo = AppDataSource.getRepository(Supervisor);
	const userRepo = AppDataSource.getRepository(User);

	const count = await internshipRepo.count();
	if (count > 0) {
		console.log('Internships ya existen — saltando seed.');
		return;
	}

	const student = await userRepo.findOne({
		where: { user_role: 'student' },
	});
	const offer = (await offerRepo.find({ take: 1 }))[0];
	const coordinators = await coordRepo.find();
	const supervisors = await supRepo.find({
		relations: ['internshipCenter'],
	});
	const systemUser = await userRepo.findOne({
		where: { email: 'system@example.com' },
	});

	if (
		!student ||
		!offer ||
		!coordinators.length ||
		!supervisors.length ||
		!systemUser
	) {
		console.log(
			'Faltan entidades (student/offer/coordinator/supervisor/system user) para crear internships.',
		);
		return;
	}

	// crear documento final report (puede reutilizar la plantilla)
	const templatePath = path.join(
		process.cwd(),
		'apps/backend/src/archives/convention/convenio_practica_plantilla.pdf',
	);

	const doc = new Document();
	doc.file_name = 'final_report_dummy.pdf';
	doc.file_path = templatePath;
	doc.mime_type = 'application/pdf';
	doc.uploaded_at = new Date();
	doc.uploader = systemUser;
	const savedDoc = await docRepo.save(doc);

	// crear aplicación
	const application = new Application();
	application.student = student;
	application.offer = offer;
	const savedApp = await appRepo.save(application);

	// Crear internship con SQL directo para insertar FK sin problemas de tipos
	try {
		const sql = `INSERT INTO internship (coordinator_id, supervisor_id, application_id, final_report_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
		const params = [
			coordinators[0].id,
			supervisors[0].userId,
			savedApp.id,
			savedDoc.id,
			'in_progress',
		];

		const res = await AppDataSource.manager.query(
			sql,
			params,
		);
		const createdId =
			Array.isArray(res) && res[0] ? res[0].id : undefined;
		console.log(
			'Seed: internship creado (id:',
			createdId,
			')',
		);
	} catch (err) {
		const error = err as Error;
		console.error('Error insertando internship (SQL):', {
			coordinatorId: coordinators[0]?.id,
			supervisorUserId: supervisors[0]?.userId,
			applicationId: savedApp?.id,
			finalReportId: savedDoc?.id,
			error: error.message,
		});
		throw err;
	}
}
