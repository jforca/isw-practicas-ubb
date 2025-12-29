import { AppDataSource } from '../../config/db.config';
import { Document, Internship, User } from '@entities';
import path from 'path';
import fs from 'fs';

export async function seedFinalReports() {
	const docRepo = AppDataSource.getRepository(Document);
	const internshipRepo =
		AppDataSource.getRepository(Internship);
	const userRepo = AppDataSource.getRepository(User);

	// Queremos crear algunos informes finales para internships que no los tengan.

	const systemUser = await userRepo.findOne({
		where: { email: 'system@example.com' },
	});
	if (!systemUser) {
		console.warn(
			'No se encontró usuario system@example.com para asignar como uploader de informes.',
		);
	}

	const internships = await internshipRepo.find();
	if (!internships.length) {
		console.log(
			'No hay internships para asociar informes finales.',
		);
		return;
	}

	const toFill: Internship[] = [];
	for (const it of internships) {
		// comprobar si tiene final_report_id mediante una consulta directa
		const res = await AppDataSource.manager.query(
			'SELECT final_report_id FROM internship WHERE id = $1',
			[it.id],
		);
		const fr =
			Array.isArray(res) && res[0]
				? res[0].final_report_id
				: null;
		if (!fr) toFill.push(it);
		if (toFill.length >= 5) break;
	}

	if (!toFill.length) {
		console.log(
			'No se encontraron internships sin informe final (final_report) — nada que hacer.',
		);
		return;
	}

	const relativePath = path.join(
		'archives',
		'reports',
		'final_report_dummy.pdf',
	);

	// Asegurar archivo dummy en runtime
	try {
		const destDir = path.join(
			process.cwd(),
			'apps',
			'backend',
			'archives',
			'reports',
		);
		const destPath = path.join(
			destDir,
			'final_report_dummy.pdf',
		);
		if (!fs.existsSync(destPath)) {
			const candidates = [
				path.join(
					process.cwd(),
					'apps',
					'backend',
					'src',
					'archives',
					'reports',
					'final_report_dummy.pdf',
				),
				path.join(
					process.cwd(),
					'apps',
					'backend',
					'archives',
					'reports',
					'final_report_dummy.pdf',
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
				console.log('✓ Informe dummy copiado a:', destPath);
			} else {
				// no fatal — seguimos creando documentos con ruta relativa
				console.warn(
					'Informe dummy no encontrado en candidatos; se usará ruta relativa en DB.',
				);
			}
		}
	} catch (err) {
		console.warn(
			'Error asegurando informe dummy en archives:',
			err instanceof Error ? err.message : String(err),
		);
	}

	let created = 0;
	for (const it of toFill) {
		const doc = new Document();
		doc.file_name = `final_report_internship_${it.id}.pdf`;
		doc.file_path = relativePath;
		doc.mime_type = 'application/pdf';
		doc.uploaded_at = new Date();

		// Asegurar que `uploader` sea un `User` no nulo
		let uploader: User | undefined =
			systemUser ?? undefined;
		if (!uploader) {
			uploader = (await userRepo.find({ take: 1 }))[0];
		}
		if (!uploader) {
			console.warn(
				'No hay usuario disponible para asignar como uploader — se omite este informe.',
			);
			continue;
		}
		doc.uploader = uploader;
		const saved = await docRepo.save(doc);

		try {
			await AppDataSource.manager.query(
				'UPDATE internship SET final_report_id = $1 WHERE id = $2',
				[saved.id, it.id],
			);
			created++;
			console.log(
				`Seed: asociado informe final (doc id ${saved.id}) a internship ${it.id}`,
			);
		} catch (err) {
			console.warn(
				'No se pudo actualizar internship con final_report:',
				err instanceof Error ? err.message : String(err),
			);
		}
	}

	console.log(
		`Seed: creados y asociados ${created} informes finales.`,
	);
}
