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
	ev.supervisorGrade = 0;
	ev.reportGrade = 0;
	ev.finalGrade = 0;
	ev.completedAt = new Date();
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
	for (const item of supItems) {
		const resp = new EvaluationResponse();
		resp.evaluation = savedEv;
		resp.item = item;
		if (item.optionsSchema) {
			resp.selectedValue = 'SI';
			resp.numericValue = 1;
			resp.score =
				Number(item.weight || 1) *
				Math.min(1, Number(item.maxScore || 1));
		} else {
			const base = Math.min(
				Number(item.maxScore || 1),
				Math.ceil(Number(item.maxScore || 1) * 0.7),
			);
			resp.selectedValue = String(base);
			resp.numericValue = base;
			resp.score = Number(item.weight || 1) * base;
		}
		resp.comment = null;
		responses.push(resp);
	}

	await responseRepo.save(responses);

	let totalWeighted = 0;
	let totalMax = 0;
	for (const r of responses) {
		const maxWeighted =
			Number(r.item.maxScore || 1) *
			Number(r.item.weight || 1);
		totalMax += maxWeighted;
		totalWeighted += Math.min(
			Number(r.score || 0),
			maxWeighted,
		);
	}
	const ratio = totalMax > 0 ? totalWeighted / totalMax : 0;
	const supGrade = Math.round(ratio * 7 * 100) / 100;
	savedEv.supervisorGrade = supGrade;
	savedEv.finalGrade = supGrade; // aún sin encargado
	await evalRepo.save(savedEv);

	console.log(
		'Seed: internship evaluation creada con respuestas de supervisor y firma faltante.',
	);
}
