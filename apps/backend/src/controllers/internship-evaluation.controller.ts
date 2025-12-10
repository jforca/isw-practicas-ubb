import { Request, Response } from 'express';
import {
	getEvaluation,
	listEvaluations,
	deleteEvaluation,
	createEvaluation,
	updateEvaluation,
} from '@services/internship-evaluation.service';

export async function findOneController(
	req: Request,
	res: Response,
) {
	const { id } = req.params;

	const ev = await getEvaluation(Number(id));

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
	const list = await listEvaluations();
	res.status(200).json({ data: list || [], error: null });
}

export async function deleteController(
	req: Request,
	res: Response,
) {
	const { id } = req.params;

	const ok = await deleteEvaluation(Number(id));

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

export async function createController(
	req: Request,
	res: Response,
) {
	try {
		const body = req.body || {};
		const created = await createEvaluation(body);
		if (!created) {
			res.status(400).json({
				data: null,
				error:
					'Internship asociada no encontrada o internshipId faltante',
			});
			return;
		}
		res.status(201).json({ data: created, error: null });
	} catch (error) {
		console.error('Error al crear evaluación:', error);
		res.status(500).json({
			data: null,
			error: 'Error al crear evaluación',
		});
	}
}

export async function updateController(
	req: Request,
	res: Response,
) {
	const { id } = req.params;
	const body = req.body || {};

	try {
		const updated = await updateEvaluation(
			Number(id),
			body,
		);
		if (!updated) {
			res.status(404).json({
				data: null,
				error: 'Evaluación no encontrada',
			});
			return;
		}
		res.status(200).json({ data: updated, error: null });
	} catch (error) {
		console.error('Error updating evaluation:', error);
		res
			.status(500)
			.json({ data: null, error: 'Error interno' });
	}
}
