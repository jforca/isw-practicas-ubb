import { Request, Response } from 'express';
import { LogbookEntriesServices } from '@services/logbook-entries.service';
import {
	handleSuccess,
	handleErrorServer,
	handleErrorClient,
} from '@handlers/response.handler';

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
				'No se encontro la bitacora solicitada',
				null,
			);
		}

		return handleSuccess(
			res,
			200,
			'Bitacora obtenida con exito',
			data,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error al buscar la bitacora',
			err,
		);
	}
}

async function findMany(_req: Request, res: Response) {
	try {
		const data = await LogbookEntriesServices.findMany();

		if (!data) {
			return handleErrorServer(
				res,
				500,
				'No se pudieron recuperar las bitacoras',
				null,
			);
		}

		return handleSuccess(
			res,
			200,
			'bitacoras obtenidas con exito',
			data,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error interno al obtener las bitacoras',
			err,
		);
	}
}

async function createOne(req: Request, res: Response) {
	try {
		const { title, body, internshipId } = req.body;

		if (!title || !body || !internshipId) {
			return handleErrorClient(
				res,
				400,
				'Faltan datos requeridos: title, body o internshipId',
				null,
			);
		}

		const data = await LogbookEntriesServices.createOne({
			title,
			body,
			internshipId,
		});

		if (!data) {
			return handleErrorServer(
				res,
				500,
				'No se pudo crear la bitacora',
				null,
			);
		}

		return handleSuccess(
			res,
			201,
			'Bitacora creada bien',
			data,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error interno al crear la bitacora',
			err,
		);
	}
}

async function updateOne(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const updateData = req.body;

		const data = await LogbookEntriesServices.updateOne(
			Number(id),
			updateData,
		);

		if (!data) {
			return handleErrorServer(
				res,
				404,
				'No se encontró la bitacora',
				null,
			);
		}

		return handleSuccess(
			res,
			200,
			'Bitacora actualizada bien',
			data,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error al actualizar la bitacora',
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
				'No se encontró la bitacora a eliminar',
				null,
			);
		}

		return handleSuccess(
			res,
			200,
			'Bitacora eliminada con exito',
			{ id },
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error al eliminar la bitacora',
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
