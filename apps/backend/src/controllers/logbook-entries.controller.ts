import { Request, Response } from 'express';
import { LogbookEntriesServices } from '@services/logbook-entries.service';
import {
	handleSuccess,
	handleErrorServer,
	handleErrorClient,
} from '@handlers/response.handler';
import { CreateLogbookSchema } from '@packages/schema/logbook.schema';

async function findOne(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const data = await LogbookEntriesServices.findOne(
			Number(id),
		);

		if (!data) {
			return handleErrorServer(
				res,
				404,
				'No se encontró la bitácora solicitada',
				null,
			);
		}

		return handleSuccess(
			res,
			200,
			'Bitácora obtenida con éxito',
			data,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error al buscar la bitácora',
			err,
		);
	}
}

async function findMany(req: Request, res: Response) {
	try {
		const offset = Number(req.query.offset) || 0;
		const limit = Number(req.query.limit) || 10;
		const internshipId = req.query.internshipId
			? Number(req.query.internshipId)
			: undefined;

		// Si tu servicio soporta búsqueda por texto, aquí deberías extraer req.query.search

		const result = await LogbookEntriesServices.findMany(
			offset,
			limit,
			internshipId,
		);

		if (!result) {
			return handleErrorServer(
				res,
				500,
				'Error al obtener las bitácoras',
				null,
			);
		}

		const responseData = {
			data: result.entries,
			pagination: {
				total: result.total,
				offset: offset,
				limit: limit,
				hasMore: offset + limit < result.total,
			},
		};

		return handleSuccess(
			res,
			200,
			'Bitácoras obtenidas con éxito',
			responseData,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error interno al obtener las bitácoras',
			err,
		);
	}
}

async function createOne(req: Request, res: Response) {
	try {
		// 1. VALIDACIÓN MANUAL CON ZOD
		const validation = CreateLogbookSchema.safeParse(
			req.body,
		);

		if (!validation.success) {
			// Formateamos los errores para que el frontend los entienda
			const errors = validation.error.issues.map(
				(issue) => ({
					field: issue.path[0],
					message: issue.message,
				}),
			);

			return handleErrorClient(
				res,
				400,
				'Error de validación',
				errors, // Enviamos los detalles del error
			);
		}

		// 2. Si pasa la validación, usamos los datos LIMPIOS (validation.data)
		const { title, content, internshipId } =
			validation.data;

		const data = await LogbookEntriesServices.createOne({
			title,
			content,
			internshipId,
		});

		if (!data)
			return handleErrorServer(
				res,
				500,
				'No se pudo crear',
				null,
			);

		return handleSuccess(res, 201, 'Bitácora creada', data);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error interno',
			err,
		);
	}
}

async function updateOne(req: Request, res: Response) {
	try {
		const { id } = req.params;

		// 1. VALIDACIÓN MANUAL (PARCIAL)
		// Usamos .partial() porque al editar quizás solo envían el título o solo el contenido
		const validation =
			CreateLogbookSchema.partial().safeParse(req.body);

		if (!validation.success) {
			const errors = validation.error.issues.map(
				(issue) => ({
					field: issue.path[0],
					message: issue.message,
				}),
			);
			return handleErrorClient(
				res,
				400,
				'Error de validación',
				errors,
			);
		}

		// 2. Usamos los datos validados
		const { title, content } = validation.data;

		const data = await LogbookEntriesServices.updateOne(
			Number(id),
			{
				title,
				content,
			},
		);

		if (!data)
			return handleErrorServer(
				res,
				404,
				'No se encontró para actualizar',
				null,
			);

		return handleSuccess(
			res,
			200,
			'Bitácora actualizada',
			data,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error al actualizar',
			err,
		);
	}
}

async function deleteOne(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const isDeleted =
			await LogbookEntriesServices.deleteOne(Number(id));

		if (!isDeleted) {
			return handleErrorServer(
				res,
				404,
				'No se encontró la bitácora a eliminar',
				null,
			);
		}

		return handleSuccess(
			res,
			200,
			'Bitácora eliminada con éxito',
			{ id },
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error al eliminar la bitácora',
			err,
		);
	}
}

export const LogbookEntriesControllers = {
	findOne,
	findMany,
	createOne,
	updateOne,
	deleteOne,
};
