import { AppDataSource } from '@config/db.config';
import { InternshipEvaluation } from '@entities/internship-evaluation.entity';
import { Internship } from '@entities/internship.entity';

const internshipEvaluationRepo =
	AppDataSource.getRepository(InternshipEvaluation);
const internshipRepo =
	AppDataSource.getRepository(Internship);

export async function getEvaluation(id: number) {
	try {
		const evalEntity =
			await internshipEvaluationRepo.findOne({
				where: { id },
				relations: ['internship', 'internship.supervisor'],
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

async function applySupervisorNote(
	evaluationId: number,
	supervisorGrade: number,
	supervisorComments: string,
) {
	try {
		const ev = await internshipEvaluationRepo.findOne({
			where: { id: evaluationId },
			relations: ['internship'],
		});
		if (!ev || !ev.internship) return null;
		ev.supervisorGrade = supervisorGrade;
		ev.supervisorComments = supervisorComments;
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
	reportComments: string,
) {
	try {
		const ev = await internshipEvaluationRepo.findOne({
			where: { id: evaluationId },
			relations: ['internship'],
		});
		if (!ev || !ev.internship) return null;
		ev.reportGrade = reportGrade;
		ev.reportComments = reportComments;
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
			relations: ['internship'],
		});
	} catch (error) {
		console.error('Error al listar evaluaciones:', error);
	}
}

export async function createEvaluation(data: {
	internshipId?: number;
	supervisorGrade?: number;
	supervisorComments?: string;
	reportGrade?: number;
	reportComments?: string;
	finalGrade?: number;
	completedAt?: Date;
}) {
	try {
		const ev = new InternshipEvaluation();
		ev.supervisorGrade = Number(data.supervisorGrade ?? 0);
		ev.supervisorComments = data.supervisorComments ?? '';
		ev.reportGrade = Number(data.reportGrade ?? 0);
		ev.reportComments = data.reportComments ?? '';
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
		supervisorComments: string;
		reportGrade: number;
		reportComments: string;
	}>,
) {
	if (
		typeof changes.supervisorGrade !== 'undefined' ||
		typeof changes.supervisorComments !== 'undefined'
	) {
		const updated = await applySupervisorNote(
			id,
			Number(changes.supervisorGrade ?? 0),
			String(changes.supervisorComments ?? ''),
		);
		if (!updated) return null;
	}

	if (
		typeof changes.reportGrade !== 'undefined' ||
		typeof changes.reportComments !== 'undefined'
	) {
		const updated = await applyReportNote(
			id,
			Number(changes.reportGrade ?? 0),
			String(changes.reportComments ?? ''),
		);
		return updated;
	}

	return await getEvaluation(id);
}
