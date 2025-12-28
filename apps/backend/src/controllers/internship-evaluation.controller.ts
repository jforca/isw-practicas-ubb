import { Request, Response } from 'express';
import {
	getEvaluation,
	listEvaluations,
	deleteEvaluation,
	createEvaluation,
	updateEvaluation,
	listRubricItems,
	getEvaluationResponses,
	submitEvaluationResponses,
	attachSignatureDocument,
} from '@services/internship-evaluation.service';
import { DocumentServices } from '@services/documents.service';
import path from 'node:path';
import {
	InternshipEvaluation,
	Internship,
	Coordinator,
	Supervisor,
	Application,
} from '@entities';

function isPromiseLike<T>(
	v: T | Promise<T>,
): v is Promise<T> {
	return (
		typeof v === 'object' &&
		v !== null &&
		typeof (v as { then?: unknown }).then === 'function'
	);
}

type TResolvedInternship = Omit<
	Internship,
	'coordinator' | 'supervisor' | 'application'
> & {
	coordinator?: Coordinator | null;
	supervisor?: Supervisor | null;
	application?: Application | null;
};
type TResolvedEvaluation = Omit<
	InternshipEvaluation,
	'internship'
> & { internship?: TResolvedInternship | null };

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
	req: Request,
	res: Response,
) {
	const offset = Number(req.query.offset) || 0;
	const limit = Number(req.query.limit) || 10;
	const search = req.query.search as string | undefined;

	const list = await listEvaluations();

	// Resolver posibles relaciones lazy (TypeORM puede devolver Promises)
	const resolvedList: TResolvedEvaluation[] =
		await Promise.all(
			(list || []).map(
				async (item): Promise<TResolvedEvaluation> => {
					if (!item.internship)
						return {
							...item,
							internship: null,
						} as TResolvedEvaluation;

					const internshipRaw = item.internship as
						| Internship
						| Promise<Internship>;

					const resolvedInternship = isPromiseLike(
						internshipRaw,
					)
						? await internshipRaw
						: internshipRaw;

					// coordinator en la entidad está tipado como Promise<Coordinator>
					const coordinatorObj =
						resolvedInternship.coordinator
							? await resolvedInternship.coordinator
							: null;

					const supervisorObj =
						resolvedInternship.supervisor ?? null;
					const applicationObj =
						resolvedInternship.application ?? null;

					const resolvedInternshipTyped: TResolvedInternship =
						{
							...resolvedInternship,
							coordinator: coordinatorObj,
							supervisor: supervisorObj,
							application: applicationObj,
						};

					return {
						...item,
						internship: resolvedInternshipTyped,
					} as TResolvedEvaluation;
				},
			),
		);

	// Filtrar por búsqueda si se proporciona
	let filtered = resolvedList || [];
	if (search) {
		const searchLower = search.toLowerCase();
		filtered = filtered.filter(
			(item: TResolvedEvaluation) =>
				item.id.toString().includes(searchLower) ||
				(
					item.internship?.supervisor as
						| Supervisor
						| undefined
				)?.user?.name
					?.toLowerCase()
					.includes(searchLower) ||
				(
					item.internship?.coordinator as
						| Coordinator
						| undefined
				)?.user?.name
					?.toLowerCase()
					.includes(searchLower) ||
				item.internship?.application?.student?.name
					?.toLowerCase()
					.includes(searchLower),
		);
	}

	// Aplicar paginación
	const total = filtered.length;
	const paginated = filtered.slice(offset, offset + limit);
	const hasMore = offset + limit < total;

	res.status(200).json({
		data: {
			data: paginated,
			pagination: {
				total,
				offset,
				limit,
				hasMore,
			},
		},
		error: null,
	});
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

export async function rubricController(
	req: Request,
	res: Response,
) {
	const { type } = req.params as {
		type: 'SUPERVISOR' | 'REPORT';
	};
	if (type !== 'SUPERVISOR' && type !== 'REPORT') {
		res.status(400).json({
			data: null,
			error: 'Tipo de pauta inválido',
		});
		return;
	}
	try {
		const items = await listRubricItems(type);
		res.status(200).json({ data: items, error: null });
	} catch (error) {
		console.error('Error al obtener pauta:', error);
		res
			.status(500)
			.json({ data: null, error: 'Error interno' });
	}
}

export async function getResponsesController(
	req: Request,
	res: Response,
) {
	const { id } = req.params;
	try {
		const responses = await getEvaluationResponses(
			Number(id),
		);
		res.status(200).json({ data: responses, error: null });
	} catch (error) {
		console.error('Error al obtener respuestas:', error);
		res
			.status(500)
			.json({ data: null, error: 'Error interno' });
	}
}

export async function submitResponsesController(
	req: Request,
	res: Response,
) {
	const { id, type } = req.params as {
		id: string;
		type: 'SUPERVISOR' | 'REPORT';
	};
	const { answers } = (req.body || {}) as {
		answers: Array<{
			itemId: number;
			value: string | number;
			comment?: string;
		}>;
	};
	if (!Array.isArray(answers)) {
		res.status(400).json({
			data: null,
			error: 'Cuerpo inválido: falta answers[]',
		});
		return;
	}
	if (type !== 'SUPERVISOR' && type !== 'REPORT') {
		res.status(400).json({
			data: null,
			error: 'Tipo de evaluación inválido',
		});
		return;
	}
	try {
		const result = await submitEvaluationResponses(
			Number(id),
			type,
			answers,
		);
		if (!result.ok) {
			const missingItemIds =
				'missingItemIds' in result &&
				Array.isArray(result.missingItemIds)
					? result.missingItemIds
					: [];
			res.status(400).json({
				data: null,
				error: result.error,
				missingItemIds,
			});
			return;
		}
		res
			.status(200)
			.json({ data: result.evaluation, error: null });
	} catch (error) {
		console.error('Error al enviar respuestas:', error);
		res
			.status(500)
			.json({ data: null, error: 'Error interno' });
	}
}

export async function attachSignatureController(
	req: Request,
	res: Response,
) {
	const { id, documentId } = req.params as {
		id: string;
		documentId: string;
	};
	try {
		const updated = await attachSignatureDocument(
			Number(id),
			Number(documentId),
		);
		if (!updated) {
			res.status(404).json({
				data: null,
				error: 'Evaluación o documento no encontrado',
			});
			return;
		}
		res.status(200).json({ data: updated, error: null });
	} catch (error) {
		console.error(
			'Error al adjuntar documento de firma:',
			error,
		);
		res
			.status(500)
			.json({ data: null, error: 'Error interno' });
	}
}

// Upload a signature PDF and attach to an evaluation
export async function uploadSignatureController(
	req: Request,
	res: Response,
) {
	const { id } = req.params;
	const evaluationId = Number(id);
	if (!req.file) {
		res
			.status(400)
			.json({ data: null, error: 'Archivo PDF requerido' });
		return;
	}
	if (Number.isNaN(evaluationId) || evaluationId <= 0) {
		res.status(400).json({
			data: null,
			error: 'Id de evaluación inválido',
		});
		return;
	}
	try {
		const relativePath = path.join(
			'archives',
			'signature',
			path.basename(req.file.path),
		);
		const doc = await DocumentServices.createOne({
			fileName: req.file.originalname,
			filePath: relativePath,
			mimeType: req.file.mimetype,
		});
		const updated = await attachSignatureDocument(
			evaluationId,
			doc.id,
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
		console.error(
			'Error al subir y adjuntar firma:',
			error,
		);
		res
			.status(500)
			.json({ data: null, error: 'Error interno' });
	}
}

export async function viewSignatureController(
	req: Request,
	res: Response,
) {
	const { id } = req.params;
	const evaluationId = Number(id);
	if (Number.isNaN(evaluationId) || evaluationId <= 0) {
		res.status(400).json({
			data: null,
			error: 'Id de evaluación inválido',
		});
		return;
	}
	try {
		const evaluation = await getEvaluation(evaluationId);
		if (!evaluation || !evaluation.signature_document) {
			res
				.status(404)
				.json({ data: null, error: 'Firma no encontrada' });
			return;
		}
		const doc = evaluation.signature_document;
		const filePath = path.join(
			__dirname,
			'..',
			doc.file_path,
		);
		const fs = await import('fs');
		if (!fs.existsSync(filePath)) {
			res.status(404).json({
				data: null,
				error: 'Archivo físico no encontrado',
			});
			return;
		}
		res.setHeader('Content-Type', doc.mime_type);
		res.setHeader(
			'Content-Disposition',
			`inline; filename="${doc.file_name}"`,
		);
		const fileStream = fs.createReadStream(filePath);
		fileStream.pipe(res);
	} catch (error) {
		console.error('Error al visualizar firma:', error);
		res
			.status(500)
			.json({ data: null, error: 'Error interno' });
	}
}
