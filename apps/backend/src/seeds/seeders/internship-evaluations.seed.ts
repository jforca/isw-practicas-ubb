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

	const internship = internships[0];

	const ev = new InternshipEvaluation();
	ev.internship = internship;
	ev.supervisorGrade = null;
	ev.reportGrade = null;
	ev.finalGrade = null;
	ev.completedAt = null;
	ev.signature_document = null;
	const savedEv = await evalRepo.save(ev);

	const supItems = await itemRepo.find({
		where: { evaluationType: 'SUPERVISOR', isActive: true },
		order: { order: 'ASC', id: 'ASC' },
	});
	if (!supItems.length) {
		console.log(
			'No hay items de SUPERVISOR — ejecuta seedEvaluationItems primero.',
		);
		return;
	}

	const responses: EvaluationResponse[] = [];
	const letters = ['A', 'B', 'C', 'D', 'E'];
	const values = [7, 6, 5, 4, 3];

	for (let i = 0; i < supItems.length; i++) {
		const item = supItems[i];
		const resp = new EvaluationResponse();
		resp.evaluation = savedEv;
		resp.item = item;
		const idx = i % 5;
		resp.selectedValue = letters[idx];
		resp.numericValue = values[idx];
		resp.score = values[idx];
		resp.comment = null;
		responses.push(resp);
	}

	await responseRepo.save(responses);

	// Recalcular nota promedio para supervisor (coerce a número para evitar NaN)
	const totalScore = responses.reduce((sum, r) => {
		const sc = Number(r.score);
		return sum + (Number.isFinite(sc) ? sc : 0);
	}, 0);
	const avgGrade = responses.length
		? Math.round((totalScore / responses.length) * 100) /
			100
		: null;
	ev.supervisorGrade = avgGrade;

	// Crear respuestas de REPORT también
	const reportItems = await itemRepo.find({
		where: { evaluationType: 'REPORT', isActive: true },
		order: { order: 'ASC', id: 'ASC' },
	});
	if (reportItems.length) {
		const reportResponses: EvaluationResponse[] = [];
		for (let i = 0; i < reportItems.length; i++) {
			const item = reportItems[i];
			const resp = new EvaluationResponse();
			resp.evaluation = savedEv;
			resp.item = item;
			const idx = i % 5;
			resp.selectedValue = letters[idx];
			resp.numericValue = values[idx];
			resp.score = values[idx];
			resp.comment = null;
			reportResponses.push(resp);
		}
		await responseRepo.save(reportResponses);

		const reportTotalScore = reportResponses.reduce(
			(sum, r) => {
				const sc = Number(r.score);
				return sum + (Number.isFinite(sc) ? sc : 0);
			},
			0,
		);
		const reportAvgGrade = reportResponses.length
			? Math.round(
					(reportTotalScore / reportResponses.length) * 100,
				) / 100
			: null;
		ev.reportGrade = reportAvgGrade;
	}

	// Calcular nota final si hay ambas notas
	if (
		ev.supervisorGrade != null &&
		ev.reportGrade != null
	) {
		ev.finalGrade =
			Math.round(
				((ev.supervisorGrade + ev.reportGrade) / 2) * 100,
			) / 100;
	}

	await evalRepo.save(ev);

	console.log(
		`✓ Seed: Evaluación creada con ${responses.length} respuestas de supervisor (${avgGrade}) y ${reportItems.length} respuestas de report (${ev.reportGrade}). Nota final: ${ev.finalGrade}`,
	);
}
