import { AppDataSource } from '../../config/db.config';
import {
	Internship,
	InternshipEvaluation,
	EvaluationItem,
	EvaluationResponse,
} from '@entities';

export async function seedInternshipEvaluations() {
	const evalRepo = AppDataSource.getRepository(
		InternshipEvaluation,
	);
	const internshipRepo =
		AppDataSource.getRepository(Internship);
	const itemRepo =
		AppDataSource.getRepository(EvaluationItem);
	const responseRepo = AppDataSource.getRepository(
		EvaluationResponse,
	);

	const count = await evalRepo.count();
	if (count > 0) {
		console.log(
			'InternshipEvaluations ya existen — saltando seed.',
		);
		return;
	}

	const internships = await internshipRepo.find({
		relations: ['supervisor', 'coordinator'],
	});
	if (!internships.length) {
		console.log(
			'No hay internships para crear evaluaciones — crea internships primero.',
		);
		return;
	}

	const supItems = await itemRepo.find({
		where: { evaluationType: 'SUPERVISOR', isActive: true },
		order: { order: 'ASC', id: 'ASC' },
	});
	const reportItems = await itemRepo.find({
		where: { evaluationType: 'REPORT', isActive: true },
		order: { order: 'ASC', id: 'ASC' },
	});

	if (!supItems.length && !reportItems.length) {
		console.log(
			'No hay items de evaluación — ejecuta seedEvaluationItems primero.',
		);
		return;
	}

	const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
	const values = [7, 6, 5, 4, 3, 2];

	// Crear evaluaciones para varios internships (hasta 12 para más cobertura)
	const limit = Math.min(internships.length, 12);
	for (let k = 0; k < limit; k++) {
		const internship = internships[k];
		const ev = new InternshipEvaluation();
		ev.internship = internship;
		ev.supervisorGrade = null;
		ev.reportGrade = null;
		ev.finalGrade = null;
		ev.completedAt = new Date();
		ev.signature_document = null;
		const savedEv = await evalRepo.save(ev);

		// respuestas supervisor
		const responses: EvaluationResponse[] = [];
		for (let i = 0; i < supItems.length; i++) {
			const item = supItems[i];
			const resp = new EvaluationResponse();
			resp.evaluation = savedEv;
			resp.item = item;
			// rotar valores para diversidad
			const idx = (k + i) % letters.length;
			resp.selectedValue = letters[idx];
			resp.numericValue = values[idx];
			resp.score = values[idx];
			resp.comment = `Respuesta seed para item ${item.id}`;
			responses.push(resp);
		}
		await responseRepo.save(responses);

		const totalScore = responses.reduce(
			(sum, r) =>
				sum +
				(Number.isFinite(Number(r.score))
					? Number(r.score)
					: 0),
			0,
		);
		const avgGrade = responses.length
			? Math.round((totalScore / responses.length) * 100) /
				100
			: null;
		ev.supervisorGrade = avgGrade;

		// respuestas report
		if (reportItems.length) {
			const reportResponses: EvaluationResponse[] = [];
			for (let i = 0; i < reportItems.length; i++) {
				const item = reportItems[i];
				const resp = new EvaluationResponse();
				resp.evaluation = savedEv;
				resp.item = item;
				const idx = (k + i + 1) % letters.length;
				resp.selectedValue = letters[idx];
				resp.numericValue = values[idx];
				resp.score = values[idx];
				resp.comment = `Respuesta report seed para item ${item.id}`;
				reportResponses.push(resp);
			}
			await responseRepo.save(reportResponses);
			const reportTotal = reportResponses.reduce(
				(s, r) =>
					s +
					(Number.isFinite(Number(r.score))
						? Number(r.score)
						: 0),
				0,
			);
			ev.reportGrade = reportResponses.length
				? Math.round(
						(reportTotal / reportResponses.length) * 100,
					) / 100
				: null;
		}

		if (
			ev.supervisorGrade != null &&
			ev.reportGrade != null
		) {
			ev.finalGrade =
				Math.round(
					((ev.supervisorGrade + ev.reportGrade) / 2) * 100,
				) / 100;
		} else if (ev.supervisorGrade != null) {
			ev.finalGrade = ev.supervisorGrade;
		} else if (ev.reportGrade != null) {
			ev.finalGrade = ev.reportGrade;
		}

		await evalRepo.save(ev);
		console.log(
			`✓ Seed: Evaluación para internship ${internship.id} — sup:${ev.supervisorGrade} report:${ev.reportGrade} final:${ev.finalGrade}`,
		);
	}
}
