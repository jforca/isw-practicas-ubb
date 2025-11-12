import { Request, Response } from 'express';
import { findMany } from '@services/coordinator.service';
import {
	handleSuccess,
	handleErrorServer,
} from '@handlers/response.handlers';
import type { TCoordinator } from '@services/coordinator.service';

export async function listCoordinators(
	_req: Request,
	res: Response,
) {
	try {
		const data: TCoordinator[] = await findMany();
		return handleSuccess(
			res,
			200,
			'Coordinadores obtenidos',
			data,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error al obtener coordinadores',
			err,
		);
	}
}
