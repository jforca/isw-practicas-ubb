import { AppDataSource } from '@config/db.config';
import { InternshipEvaluation } from '@entities/internship-evaluation.entity';
import { Internship } from '@entities/internship.entity';
import { EvaluationItem } from '@entities/evaluation-item.entity';
import { EvaluationResponse } from '@entities/evaluation-response.entity';
import { Document } from '@entities/documents.entity';

const internshipEvaluationRepo =
	AppDataSource.getRepository(InternshipEvaluation);
const internshipRepo =
	AppDataSource.getRepository(Internship);
const itemRepo =
	AppDataSource.getRepository(EvaluationItem);
const responseRepo = AppDataSource.getRepository(
	EvaluationResponse,
);
const documentRepo = AppDataSource.getRepository(Document);

export async function getEvaluation(id: number) {
	try {
		const evalEntity =
			await internshipEvaluationRepo.findOne({
				where: { id },
				relations: [
					'internship',
					'internship.supervisor',
					'responses',
					'responses.item',
					'signature_document',
				],
			});
		return evalEntity;
	} catch (error) {
		console.error(
			'Error al obtener evaluación por id:',
			error,
		);
		throw error;
	}
}

export async function listRubricItems(
	type: 'SUPERVISOR' | 'REPORT',
) {
	try {
		return await itemRepo.find({
			where: { evaluationType: type, isActive: true },
			order: { section: 'ASC', order: 'ASC', id: 'ASC' },
		});
	} catch (error) {
		console.error(
			'Error al listar pauta de evaluación:',
			error,
		);
		throw error;
	}
}

export async function getEvaluationResponses(
	evaluationId: number,
) {
	try {
		return await responseRepo.find({
			where: { evaluation: { id: evaluationId } },
			relations: ['item', 'evaluation'],
			order: { id: 'ASC' },
		});
	} catch (error) {
		console.error(
			'Error al obtener respuestas de evaluación:',
			error,
		);
		throw error;
	}
}

export async function attachSignatureDocument(
	evaluationId: number,
	documentId: number,
) {
	const evaluation = await internshipEvaluationRepo.findOne(
		{ where: { id: evaluationId } },
	);
	if (!evaluation) return null;
	const doc = await documentRepo.findOne({
		where: { id: documentId },
	});
	if (!doc) return null;
	evaluation.signature_document = doc;
	const saved =
		await internshipEvaluationRepo.save(evaluation);
	return saved;
}

type TOption = { key: string; score: number };
type TRubricSchema = { options?: TOption[] } | null;

function parseNumericValue(
	selectedValue: string,
	item: EvaluationItem,
): number {
	const schema = item.optionsSchema
		? safeParseJSON(item.optionsSchema)
		: null;
	if (schema && Array.isArray(schema.options)) {
		const opt = schema.options.find(
			(o) => String(o.key) === String(selectedValue),
		);
		if (opt && typeof opt.score === 'number')
			return Number(opt.score);
	}

	// Mapeo directo de letras A-F a puntajes (escala 0-7)
	const letterScores: Record<string, number> = {
		A: 7,
		B: 6,
		C: 5,
		D: 4,
		E: 2,
		F: 0,
	};

	const upperVal = String(selectedValue).toUpperCase();
	if (upperVal in letterScores) {
		return letterScores[upperVal];
	}

	const n = Number(selectedValue);
	if (!Number.isNaN(n)) return n;
	return 0;
}

function safeParseJSON(json: string | null): TRubricSchema {
	if (!json) return null;
	try {
		const parsed: unknown = JSON.parse(json);
		if (parsed && typeof parsed === 'object') {
			const obj = parsed as { options?: unknown };
			if (obj.options === undefined) {
				return {} as TRubricSchema;
			}
			if (Array.isArray(obj.options)) {
				const options: TOption[] = (
					obj.options as unknown[]
				).filter((o): o is TOption => {
					if (typeof o !== 'object' || o === null)
						return false;
					const cand = o as {
						key?: unknown;
						score?: unknown;
					};
					return (
						typeof cand.key === 'string' &&
						typeof cand.score === 'number'
					);
				});
				return { options } as TRubricSchema;
			}
		}
		return null;
	} catch {
		return null;
	}
}

function computeAggregatedGrade(
	responses: EvaluationResponse[],
) {
	if (responses.length === 0) return 0;

	let totalScore = 0;
	let count = 0;

	for (const res of responses) {
		const numericValue = Number(res.numericValue || 0);
		totalScore += numericValue;
		count += 1;
	}

	if (count === 0) return 0;

	// Promedio simple de todos los items
	const average = totalScore / count;

	// Redondear a 2 decimales
	const grade = Math.round(average * 100) / 100;

	return grade;
}

export type TSubmitEvaluationResponsesResult =
	| { ok: true; evaluation: InternshipEvaluation }
	| { ok: false; error: string; missingItemIds?: number[] };

export async function submitEvaluationResponses(
	evaluationId: number,
	type: 'SUPERVISOR' | 'REPORT',
	answers: Array<{
		itemId: number;
		value: string | number;
		comment?: string;
	}>,
): Promise<TSubmitEvaluationResponsesResult> {
	const evaluation = await internshipEvaluationRepo.findOne(
		{ where: { id: evaluationId } },
	);
	if (!evaluation)
		return {
			ok: false,
			error: 'Evaluación no encontrada',
		} as const;

	const items = await itemRepo.find({
		where: { evaluationType: type, isActive: true },
	});
	const itemMap = new Map<number, EvaluationItem>(
		items.map((i) => [i.id, i]),
	);

	// Permitir guardado parcial e incremental para ambos tipos
	// Se calcula la nota con las respuestas disponibles

	const upserts: EvaluationResponse[] = [];
	for (const ans of answers) {
		const item = itemMap.get(Number(ans.itemId));
		if (!item) continue;
		const selectedStr = String(ans.value);
		const nVal = parseNumericValue(selectedStr, item);

		let existing = await responseRepo.findOne({
			where: {
				evaluation: { id: evaluationId },
				item: { id: item.id },
			},
			relations: ['item', 'evaluation'],
		});
		if (!existing) {
			existing = new EvaluationResponse();
			existing.evaluation = evaluation;
			existing.item = item;
		}
		existing.selectedValue = selectedStr;
		existing.numericValue = nVal;
		existing.score = nVal; // Guardar directamente el valor numérico
		existing.comment =
			typeof ans.comment === 'string' ? ans.comment : null;
		upserts.push(existing);
	}

	await responseRepo.save(upserts);

	// Obtener todas las respuestas del tipo que se está guardando (no todas)
	const typeResponses = await responseRepo.find({
		where: {
			evaluation: { id: evaluationId },
			item: { evaluationType: type },
		},
		relations: ['item'],
	});

	const grade = computeAggregatedGrade(typeResponses);
	if (type === 'SUPERVISOR') {
		evaluation.supervisorGrade = grade;
	} else {
		evaluation.reportGrade = grade;
	}

	// Cargar la evaluación actualizada para obtener ambas notas
	const freshEval = await internshipEvaluationRepo.findOne({
		where: { id: evaluationId },
	});
	if (!freshEval) {
		return {
			ok: false,
			error:
				'Evaluación no encontrada después de actualizar',
		} as const;
	}

	// Copiar las notas calculadas
	freshEval.supervisorGrade =
		freshEval.supervisorGrade || evaluation.supervisorGrade;
	freshEval.reportGrade =
		freshEval.reportGrade || evaluation.reportGrade;

	// Si es SUPERVISOR, actualizar la nota de supervisor
	if (type === 'SUPERVISOR') {
		freshEval.supervisorGrade = grade;
	}
	// Si es REPORT, actualizar la nota de report
	else {
		freshEval.reportGrade = grade;
	}

	// Calcular nota final como promedio de supervisor y report
	const supervisorGrade =
		Number(freshEval.supervisorGrade) || 0;
	const reportGrade = Number(freshEval.reportGrade) || 0;

	if (supervisorGrade > 0 && reportGrade > 0) {
		// Ambas notas existen, promediar
		freshEval.finalGrade =
			Math.round(
				((supervisorGrade + reportGrade) / 2) * 100,
			) / 100;
	} else if (supervisorGrade > 0) {
		// Solo supervisor tiene nota
		freshEval.finalGrade = supervisorGrade;
	} else if (reportGrade > 0) {
		// Solo report tiene nota
		freshEval.finalGrade = reportGrade;
	} else {
		// Ninguna tiene nota
		freshEval.finalGrade = 0;
	}

	freshEval.completedAt =
		freshEval.completedAt || new Date();

	const savedEval =
		await internshipEvaluationRepo.save(freshEval);
	return { ok: true, evaluation: savedEval } as const;
}

async function applySupervisorNote(
	evaluationId: number,
	supervisorGrade: number,
) {
	try {
		const ev = await internshipEvaluationRepo.findOne({
			where: { id: evaluationId },
			relations: ['internship'],
		});
		if (!ev || !ev.internship) return null;
		ev.supervisorGrade = supervisorGrade;
		ev.completedAt = ev.completedAt || new Date();
		const saved = await internshipEvaluationRepo.save(ev);
		return saved;
	} catch (error) {
		console.error(
			'Error al asignar nota del supervisor:',
			error,
		);
		throw error;
	}
}

async function applyReportNote(
	evaluationId: number,
	reportGrade: number,
) {
	try {
		const ev = await internshipEvaluationRepo.findOne({
			where: { id: evaluationId },
			relations: ['internship'],
		});
		if (!ev || !ev.internship) return null;
		ev.reportGrade = reportGrade;
		if (
			typeof ev.supervisorGrade === 'number' &&
			!Number.isNaN(ev.supervisorGrade)
		) {
			const s = Number(ev.supervisorGrade) || 0;
			const r = Number(reportGrade) || 0;
			ev.finalGrade =
				Math.round(((s + r) / (s > 0 ? 2 : 1)) * 100) / 100;
		} else {
			ev.finalGrade =
				Math.round((Number(reportGrade) || 0) * 100) / 100;
		}
		ev.completedAt = ev.completedAt || new Date();
		const saved = await internshipEvaluationRepo.save(ev);
		return saved;
	} catch (error) {
		console.error(
			'Error al asignar nota del informe:',
			error,
		);
		throw error;
	}
}

export async function deleteEvaluation(
	evaluationId: number,
) {
	try {
		const ev = await internshipEvaluationRepo.findOneBy({
			id: evaluationId,
		});
		if (!ev) return false;
		await internshipEvaluationRepo.remove(ev);
		return true;
	} catch (error) {
		console.error('Error al eliminar evaluación:', error);
		throw error;
	}
}

export async function listEvaluations() {
	try {
		return await internshipEvaluationRepo.find({
			relations: [
				'internship',
				'internship.supervisor',
				'internship.supervisor.user',
				'internship.coordinator',
				'internship.coordinator.user',
				'internship.application',
				'internship.application.student',
				'signature_document',
			],
		});
	} catch (error) {
		console.error('Error al listar evaluaciones:', error);
		throw error;
	}
}

export async function createEvaluation(data: {
	internshipId?: number;
	supervisorGrade?: number;
	reportGrade?: number;
	finalGrade?: number;
	completedAt?: Date;
}) {
	try {
		const ev = new InternshipEvaluation();
		ev.supervisorGrade = Number(data.supervisorGrade ?? 0);
		ev.reportGrade = Number(data.reportGrade ?? 0);
		ev.finalGrade = Number(data.finalGrade ?? 0);
		ev.completedAt = data.completedAt ?? new Date();

		if (typeof data.internshipId !== 'number') {
			return null;
		}

		const internship = await internshipRepo.findOneBy({
			id: data.internshipId,
		});
		if (!internship) {
			return null;
		}

		ev.internship = internship;

		const saved = await internshipEvaluationRepo.save(ev);
		return saved;
	} catch (error) {
		console.error('Error al crear evaluación:', error);
		throw error;
	}
}

export async function updateEvaluation(
	id: number,
	changes: Partial<{
		supervisorGrade: number;
		reportGrade: number;
		supervisorComments: string;
		reportComments: string;
	}>,
) {
	let evaluation: InternshipEvaluation | null = null;

	if (typeof changes.supervisorGrade !== 'undefined') {
		evaluation = await applySupervisorNote(
			id,
			Number(changes.supervisorGrade ?? 0),
		);
		if (!evaluation) return null;
	}

	if (typeof changes.reportGrade !== 'undefined') {
		evaluation = await applyReportNote(
			id,
			Number(changes.reportGrade ?? 0),
		);
		if (!evaluation) return null;
	}

	if (!evaluation) {
		evaluation = await internshipEvaluationRepo.findOne({
			where: { id },
		});
		if (!evaluation) return null;
	}

	let dirty = false;
	if (typeof changes.supervisorComments !== 'undefined') {
		evaluation.supervisorComments =
			changes.supervisorComments;
		dirty = true;
	}
	if (typeof changes.reportComments !== 'undefined') {
		evaluation.reportComments = changes.reportComments;
		dirty = true;
	}

	if (dirty) {
		evaluation =
			await internshipEvaluationRepo.save(evaluation);
	}

	return evaluation;
}
