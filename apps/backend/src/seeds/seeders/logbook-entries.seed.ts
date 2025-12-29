import { AppDataSource } from '../../config/db.config';
import { LogbookEntries, Internship } from '@entities';

export async function seedLogbookEntries() {
	const repo = AppDataSource.getRepository(LogbookEntries);
	const internshipRepo =
		AppDataSource.getRepository(Internship);

	const count = await repo.count();
	if (count > 0) {
		console.log(
			'Logbook entries ya existen — saltando seed.',
		);
		return;
	}

	const internships = await internshipRepo.find();
	if (!internships.length) {
		console.log(
			'No hay internships para agregar bitácoras.',
		);
		return;
	}

	const entries = [] as LogbookEntries[];
	for (
		let i = 0;
		i < Math.min(internships.length, 6);
		i++
	) {
		const intern = internships[i];
		for (let j = 0; j < 3; j++) {
			const e = new LogbookEntries();
			e.title = `Bitácora ${j + 1} - Internship ${intern.id}`;
			e.body = `Entrada seed automática para la bitácora ${j + 1} del internship ${intern.id}. Actividades realizadas, aprendizajes y observaciones.`;
			e.internship = intern as Internship;
			entries.push(e);
		}
	}

	await repo.save(entries);
	console.log(
		`Seed: creadas ${entries.length} bitácoras (logbook entries).`,
	);
}
