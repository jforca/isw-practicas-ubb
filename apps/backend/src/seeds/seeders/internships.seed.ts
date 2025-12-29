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
import fs from 'fs';

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

	const students = await userRepo.find({
		where: { user_role: 'student' },
	});
	const offersList = await offerRepo.find();
	const coordinators = await coordRepo.find();
	const supervisors = await supRepo.find({
		relations: ['internshipCenter'],
	});
	const systemUser = await userRepo.findOne({
		where: { email: 'system@example.com' },
	});

	if (
		!students.length ||
		!offersList.length ||
		!coordinators.length ||
		!supervisors.length ||
		!systemUser
	) {
		console.log(
			'Faltan entidades (students/offers/coordinator/supervisor/system user) para crear internships y postulaciones.',
		);
		return;
	}

	// Crear múltiples postulaciones (applications) para probar flujos.
	const appsToCreate: Partial<Application>[] = [];
	// Cada estudiante aplica a 2 ofertas distintas (si hay suficientes)
	for (let i = 0; i < students.length; i++) {
		const student = students[i];
		const firstOffer = offersList[i % offersList.length];
		const secondOffer =
			offersList[(i + 1) % offersList.length];

		// Alternar estado aprobado en algunas postulaciones
		appsToCreate.push({
			student,
			offer: firstOffer,
			status: i % 2 === 0 ? 'approved' : undefined,
		} as Partial<Application>);
		appsToCreate.push({
			student,
			offer: secondOffer,
			status: i % 3 === 0 ? 'approved' : undefined,
		} as Partial<Application>);
	}

	// Añadir algunas postulaciones extras para estudiantes repetidos
	if (students.length > 1 && offersList.length > 2) {
		appsToCreate.push({
			student: students[1],
			offer: offersList[2],
			status: 'approved',
		} as Partial<Application>);
		appsToCreate.push({
			student: students[0],
			offer: offersList[offersList.length - 1],
			status: 'approved',
		} as Partial<Application>);
	}

	const createdApps = await appRepo.save(
		appsToCreate as Application[],
	);
	console.log(
		`Seed: creadas ${createdApps.length} postulaciones (applications).`,
	);

	// Crear internships para una parte de las postulaciones (ej. cada 3ª)
	const relativePath = path.join(
		'archives',
		'convention',
		'convenio_practica_plantilla.pdf',
	);

	// Asegurar plantilla en runtime (mismo comportamiento que antes)
	try {
		const destDir = path.join(
			process.cwd(),
			'apps',
			'backend',
			'archives',
			'convention',
		);
		const destPath = path.join(
			destDir,
			'convenio_practica_plantilla.pdf',
		);

		if (!fs.existsSync(destPath)) {
			const candidates = [
				path.join(
					process.cwd(),
					'apps',
					'backend',
					'src',
					'archives',
					'convention',
					'convenio_practica_plantilla.pdf',
				),
				path.join(
					process.cwd(),
					'apps',
					'backend',
					'archives',
					'convention',
					'convenio_practica_plantilla.pdf',
				),
			];

			let found: string | null = null;
			for (const c of candidates) {
				if (fs.existsSync(c)) {
					found = c;
					break;
				}
			}

			if (found) {
				fs.mkdirSync(destDir, { recursive: true });
				fs.copyFileSync(found, destPath);
				console.log('✓ Plantilla copiada a:', destPath);
			} else {
				console.warn(
					'Plantilla no encontrada en candidatos, no se copió.',
				);
			}
		}
	} catch (err) {
		console.warn(
			'Error asegurando plantilla en archives:',
			err instanceof Error ? err.message : String(err),
		);
	}

	// Reusar repo de Document ya inicializado arriba

	let createdCount = 0;
	for (let i = 0; i < createdApps.length; i++) {
		const app = createdApps[i];
		// Crear internship para cada 3ª aplicación
		if (i % 3 !== 0) continue;

		const doc = new Document();
		doc.file_name = `final_report_dummy_${i}.pdf`;
		doc.file_path = relativePath;
		doc.mime_type = 'application/pdf';
		doc.uploaded_at = new Date();
		doc.uploader = systemUser as User;
		const savedDoc = await docRepo.save(doc);

		const coordinator =
			coordinators[i % coordinators.length];
		const supervisor = supervisors[i % supervisors.length];

		try {
			const sql = `INSERT INTO internship (coordinator_id, supervisor_id, application_id, final_report_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
			const params = [
				coordinator.id,
				supervisor.userId,
				app.id,
				savedDoc.id,
				'in_progress',
			];
			const res = await AppDataSource.manager.query(
				sql,
				params,
			);
			const createdId =
				Array.isArray(res) && res[0]
					? res[0].id
					: undefined;
			console.log(
				'Seed: internship creado (id:',
				createdId,
				')',
			);
			createdCount++;
		} catch (err) {
			const error = err as Error;
			console.error('Error insertando internship (SQL):', {
				coordinatorId: coordinator?.id,
				supervisorUserId: supervisor?.userId,
				applicationId: app?.id,
				finalReportId: savedDoc?.id,
				error: error.message,
			});
		}
	}

	console.log(
		`Seed: creados ${createdCount} internships a partir de las postulaciones.`,
	);
}
