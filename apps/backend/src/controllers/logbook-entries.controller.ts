import { Request, Response } from 'express';
import { LogbookEntriesServices } from '@services/logbook-entries.service';
import {
	handleSuccess,
	handleErrorServer,
	handleErrorClient,
} from '@handlers/response.handler';

async function findMany(_req: Request, res: Response) {
	try {
		const data = await LogbookEntriesServices.findMany();

		if (!data) {
			return handleErrorServer(
				res,
				500,
				'No se pudieron recuperar los registros',
				null,
			);
		}

		return handleSuccess(
			res,
			200,
			'Registros del libro de bitácora obtenidos con éxito',
			data,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error interno al obtener los registros',
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
				'No se pudo crear el registro de bitácora',
				null,
			);
		}

		return handleSuccess(
			res,
			201,
			'Bitácora creada con éxito',
			data,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error interno al crear la bitácora',
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
				'No se encontró el registro de bitácora para actualizar',
				null,
			);
		}

		return handleSuccess(
			res,
			200,
			'Registro de bitácora actualizado con éxito',
			data,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error al actualizar el registro del libro de bitácora',
			err,
		);
	}
}

export const LogbookEntriesControllers = {
	findMany,
	createOne,
	updateOne,
};
