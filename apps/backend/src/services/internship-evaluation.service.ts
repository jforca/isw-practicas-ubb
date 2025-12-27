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
	let totalWeightedScore = 0;
	let totalWeightMax = 0;
	for (const res of responses) {
		const item = res.item;
		const maxWeighted =
			Number(item.maxScore || 1) * Number(item.weight || 1);
		totalWeightMax += maxWeighted;
		totalWeightedScore += Math.min(
			Number(res.score || 0),
			maxWeighted,
		);
	}
	if (totalWeightMax <= 0) return 0;
	const ratio = totalWeightedScore / totalWeightMax; // 0..1
	const grade = Math.round(ratio * 7 * 100) / 100; // scale to 7.00
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

	const providedIds = new Set<number>(
		answers.map((a) => Number(a.itemId)),
	);
	const missing = items.filter(
		(i) => !providedIds.has(i.id),
	);
	if (missing.length > 0) {
		return {
			ok: false,
			error: 'Faltan respuestas para completar la pauta',
			missingItemIds: missing.map((m) => m.id),
		} as const;
	}

	const upserts: EvaluationResponse[] = [];
	for (const ans of answers) {
		const item = itemMap.get(Number(ans.itemId));
		if (!item) continue;
		const selectedStr = String(ans.value);
		const nVal = parseNumericValue(selectedStr, item);
		const score =
			Math.min(Number(item.maxScore || 1), nVal) *
			Number(item.weight || 1);

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
		existing.score = score;
		existing.comment =
			typeof ans.comment === 'string' ? ans.comment : null;
		upserts.push(existing);
	}

	await responseRepo.save(upserts);
	const updatedResponses = await responseRepo.find({
		where: { evaluation: { id: evaluationId } },
		relations: ['item'],
	});

	const grade = computeAggregatedGrade(updatedResponses);
	if (type === 'SUPERVISOR') {
		evaluation.supervisorGrade = grade;
	} else {
		evaluation.reportGrade = grade;
	}
	if (
		typeof evaluation.supervisorGrade === 'number' &&
		!Number.isNaN(evaluation.supervisorGrade) &&
		typeof evaluation.reportGrade === 'number' &&
		!Number.isNaN(evaluation.reportGrade)
	) {
		const s = Number(evaluation.supervisorGrade) || 0;
		const r = Number(evaluation.reportGrade) || 0;
		evaluation.finalGrade =
			Math.round(((s + r) / 2) * 100) / 100;
	} else {
		evaluation.finalGrade =
			Math.round(
				((Number(evaluation.supervisorGrade) || 0) +
					(Number(evaluation.reportGrade) || 0)) *
					100,
			) / 100;
	}
	evaluation.completedAt =
		evaluation.completedAt || new Date();

	const savedEval =
		await internshipEvaluationRepo.save(evaluation);
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
	}>,
) {
	if (typeof changes.supervisorGrade !== 'undefined') {
		const updated = await applySupervisorNote(
			id,
			Number(changes.supervisorGrade ?? 0),
		);
		if (!updated) return null;
	}

	if (typeof changes.reportGrade !== 'undefined') {
		const updated = await applyReportNote(
			id,
			Number(changes.reportGrade ?? 0),
		);
		return updated;
	}

	return await getEvaluation(id);
}
