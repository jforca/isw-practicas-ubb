import { AppDataSource } from '@config/db.config';
import { InternshipEvaluation } from '@entities/internship-evaluation.entity';
import type { DeepPartial } from 'typeorm';

const internshipEvaluationRepo =
	AppDataSource.getRepository(InternshipEvaluation);

export async function getEvaluationById(id: number) {
	try {
		const evalEntity =
			await internshipEvaluationRepo.findOne({
				where: { id },
				relations: ['internship', 'internship.supervisor'],
			});
		return evalEntity;
	} catch (error) {
		console.error('Error getting evaluation by id:', error);
		throw error;
	}
}

export async function assignOrUpdateSupervisorNote(
	evaluationId: number,
	supervisorGrade: number,
	supervisorComments: string,
) {
	try {
		const ev = await internshipEvaluationRepo.findOneBy({
			id: evaluationId,
		});
		if (!ev) return null;
		ev.supervisorGrade = supervisorGrade;
		ev.supervisorComments = supervisorComments;
		ev.completedAt = ev.completedAt || new Date();
		const saved = await internshipEvaluationRepo.save(ev);
		return saved;
	} catch (error) {
		console.error(
			'Error assigning supervisor note:',
			error,
		);
		throw error;
	}
}

export async function assignOrUpdateReportNote(
	evaluationId: number,
	reportGrade: number,
	reportComments: string,
) {
	try {
		const ev = await internshipEvaluationRepo.findOneBy({
			id: evaluationId,
		});
		if (!ev) return null;
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
		console.error('Error assigning report note:', error);
		throw error;
	}
}

export async function clearSupervisorFields(
	evaluationId: number,
) {
	try {
		const ev = await internshipEvaluationRepo.findOneBy({
			id: evaluationId,
		});
		if (!ev) return null;
		ev.supervisorGrade = 0;
		ev.supervisorComments = '';
		if (
			typeof ev.reportGrade === 'number' &&
			!Number.isNaN(ev.reportGrade)
		) {
			ev.finalGrade =
				Math.round(Number(ev.reportGrade) * 100) / 100;
		} else {
			ev.finalGrade = 0;
		}
		const saved = await internshipEvaluationRepo.save(ev);
		return saved;
	} catch (error) {
		console.error(
			'Error clearing supervisor fields:',
			error,
		);
		throw error;
	}
}

export async function clearReportFields(
	evaluationId: number,
) {
	try {
		const ev = await internshipEvaluationRepo.findOneBy({
			id: evaluationId,
		});
		if (!ev) return null;
		ev.reportGrade = 0;
		ev.reportComments = '';
		if (
			typeof ev.supervisorGrade === 'number' &&
			!Number.isNaN(ev.supervisorGrade)
		) {
			ev.finalGrade =
				Math.round(Number(ev.supervisorGrade) * 100) / 100;
		} else {
			ev.finalGrade = 0;
		}
		const saved = await internshipEvaluationRepo.save(ev);
		return saved;
	} catch (error) {
		console.error('Error clearing report fields:', error);
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
		console.error('Error deleting evaluation:', error);
		throw error;
	}
}

// Compatibility wrappers using the "findOneService" / "findManyService" style
export async function findOneService(id: number) {
	try {
		const ev = await internshipEvaluationRepo.findOne({
			where: { id },
			relations: ['internship', 'internship.supervisor'],
		});
		return ev;
	} catch (error) {
		console.error('Error in findOneService:', error);
	}
}

export async function findManyService() {
	try {
		return await internshipEvaluationRepo.find({
			relations: ['internship'],
		});
	} catch (error) {
		console.error('Error in findManyService:', error);
	}
}

export async function deleteService(id: number) {
	try {
		const ok = await deleteEvaluation(id);
		return ok;
	} catch (error) {
		console.error('Error in deleteService:', error);
	}
}

export async function updateSupervisorService(
	id: number,
	supervisorGrade: number,
	supervisorComments: string,
) {
	try {
		const updated = await assignOrUpdateSupervisorNote(
			id,
			supervisorGrade,
			supervisorComments,
		);
		return updated;
	} catch (error) {
		console.error(
			'Error in updateSupervisorService:',
			error,
		);
	}
}

export async function updateReportService(
	id: number,
	reportGrade: number,
	reportComments: string,
) {
	try {
		const updated = await assignOrUpdateReportNote(
			id,
			reportGrade,
			reportComments,
		);
		return updated;
	} catch (error) {
		console.error('Error in updateReportService:', error);
	}
}

/**
 * Create a few sample InternshipEvaluation rows for local testing.
 * Note: This creates evaluations without linking to an `Internship`.
 */
export async function createSampleEvaluations() {
	try {
		const samples = [
			{
				supervisorGrade: 5.0,
				supervisorComments:
					'Buen rendimiento técnico y buenas prácticas.',
				reportGrade: 6.0,
				reportComments: 'Informe claro y completo.',
				finalGrade: 5.5,
				completedAt: new Date(),
			},
			{
				supervisorGrade: 4.0,
				supervisorComments:
					'Necesita mejorar documentación.',
				reportGrade: 4.5,
				reportComments: 'Faltaron algunos anexos.',
				finalGrade: 4.25,
				completedAt: new Date(),
			},
		];

		const created = await internshipEvaluationRepo.save(
			samples as DeepPartial<InternshipEvaluation>[],
		);

		return created;
	} catch (error) {
		console.error(
			'Error creating sample evaluations:',
			error,
		);
		throw error;
	}
}
