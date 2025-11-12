import { Request, Response } from 'express';
import {
	findOneService,
	findManyService,
	deleteService,
	updateSupervisorService,
	updateReportService,
	clearSupervisorFields,
	clearReportFields,
} from '@services/internship-evaluation.service';

export async function findOneController(
	req: Request,
	res: Response,
) {
	const { id } = req.params;

	const ev = await findOneService(Number(id));

	if (!ev) {
		res.status(404).json({
			data: null,
			error: 'Evaluación no encontrada',
		});
		return;
	}

	res.status(200).json({
		data: ev,
		error: null,
	});
}

export async function findManyController(
	_req: Request,
	res: Response,
) {
	const list = await findManyService();
	res.status(200).json({ data: list || [], error: null });
}

export async function updateSupervisorController(
	req: Request,
	res: Response,
) {
	const { id } = req.params;
	const { supervisorGrade, supervisorComments } = req.body;

	const updated = await updateSupervisorService(
		Number(id),
		Number(supervisorGrade),
		String(supervisorComments || ''),
	);

	if (!updated) {
		res.status(404).json({
			data: null,
			error: 'Evaluación no encontrada',
		});
		return;
	}

	res.status(200).json({ data: updated, error: null });
}

export async function updateReportController(
	req: Request,
	res: Response,
) {
	const { id } = req.params;
	const { reportGrade, reportComments } = req.body;

	const updated = await updateReportService(
		Number(id),
		Number(reportGrade),
		String(reportComments || ''),
	);

	if (!updated) {
		res.status(404).json({
			data: null,
			error: 'Evaluación no encontrada',
		});
		return;
	}

	res.status(200).json({ data: updated, error: null });
}

export async function deleteController(
	req: Request,
	res: Response,
) {
	const { id } = req.params;

	const ok = await deleteService(Number(id));

	if (!ok) {
		res.status(404).json({
			data: null,
			error: 'Evaluación no encontrada',
		});
		return;
	}

	res
		.status(200)
		.json({ data: { id: Number(id) }, error: null });
}

export async function clearSupervisorController(
	req: Request,
	res: Response,
) {
	const { id } = req.params;

	const updated = await clearSupervisorFields(Number(id));

	if (!updated) {
		res.status(404).json({
			data: null,
			error: 'Evaluación no encontrada',
		});
		return;
	}

	res.status(200).json({ data: updated, error: null });
}

export async function clearReportController(
	req: Request,
	res: Response,
) {
	const { id } = req.params;

	const updated = await clearReportFields(Number(id));

	if (!updated) {
		res.status(404).json({
			data: null,
			error: 'Evaluación no encontrada',
		});
		return;
	}

	res.status(200).json({ data: updated, error: null });
}
