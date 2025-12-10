import { Request, Response } from 'express';
import { offersService } from '@services/offers.service';
import {
	handleSuccess,
	handleErrorServer,
} from '@handlers/response.handler';

async function findOne(req: Request, res: Response) {
	const { id } = req.params;

	const response = await offersService.findOne(Number(id));

	if (!response) {
		handleErrorServer(
			res,
			404,
			'Oferta no encontrada',
			'No encontrado',
		);
		return;
	}

	handleSuccess(res, 200, 'Oferta encontrada', response);
}

async function findMany(_req: Request, res: Response) {
	const response = await offersService.findMany();

	handleSuccess(res, 200, 'Ofertas obtenidas', response);
}

export const offersController = {
	findOne,
	findMany,
};
