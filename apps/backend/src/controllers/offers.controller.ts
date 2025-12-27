import { Request, Response } from 'express';
import { offersService } from '@services/offers.service';
import {
	handleSuccess,
	handleErrorServer,
	handleErrorClient,
} from '@handlers/response.handler';

async function findOne(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const response = await offersService.findOne(
			Number(id),
		);

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
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al obtener la oferta',
			error instanceof Error
				? error.message
				: 'Error desconocido',
		);
	}
}

async function findMany(req: Request, res: Response) {
	try {
		const offset = Number(req.query.offset) || 0;
		const limit = Number(req.query.limit) || 10;
		const search = req.query.search as string | undefined;
		const status = req.query.status as string | undefined;
		const offerTypeId = req.query.offerTypeId
			? Number(req.query.offerTypeId)
			: undefined;

		const response = await offersService.findMany(
			offset,
			limit,
			{
				search,
				status,
				offerTypeId,
			},
		);

		handleSuccess(res, 200, 'Ofertas obtenidas', response);
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al obtener las ofertas',
			error instanceof Error
				? error.message
				: 'Error desconocido',
		);
	}
}

async function createOne(req: Request, res: Response) {
	try {
		const {
			title,
			description,
			deadline,
			status,
			offerTypeId,
			internshipCenterId,
		} = req.body;

		if (
			!title ||
			!description ||
			!deadline ||
			!offerTypeId ||
			!internshipCenterId
		) {
			handleErrorClient(
				res,
				400,
				'Faltan campos requeridos',
				'Todos los campos son obligatorios',
			);
			return;
		}

		const response = await offersService.createOne({
			title,
			description,
			deadline: new Date(deadline),
			status,
			offerTypeId,
			internshipCenterId,
		});

		handleSuccess(
			res,
			201,
			'Oferta creada exitosamente',
			response,
		);
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al crear la oferta',
			error instanceof Error
				? error.message
				: 'Error desconocido',
		);
	}
}

async function updateOne(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const {
			title,
			description,
			deadline,
			status,
			offerTypeId,
			internshipCenterId,
		} = req.body;

		const response = await offersService.updateOne(
			Number(id),
			{
				title,
				description,
				deadline: deadline ? new Date(deadline) : undefined,
				status,
				offerTypeId,
				internshipCenterId,
			},
		);

		if (!response) {
			handleErrorServer(
				res,
				404,
				'Oferta no encontrada',
				'No encontrado',
			);
			return;
		}

		handleSuccess(
			res,
			200,
			'Oferta actualizada exitosamente',
			response,
		);
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al actualizar la oferta',
			error instanceof Error
				? error.message
				: 'Error desconocido',
		);
	}
}

async function deleteOne(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const response = await offersService.deleteOne(
			Number(id),
		);

		if (!response) {
			handleErrorServer(
				res,
				404,
				'Oferta no encontrada',
				'No encontrado',
			);
			return;
		}

		handleSuccess(
			res,
			200,
			'Oferta eliminada exitosamente',
			null,
		);
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al eliminar la oferta',
			error instanceof Error
				? error.message
				: 'Error desconocido',
		);
	}
}

async function findOfferTypes(
	_req: Request,
	res: Response,
) {
	try {
		const response =
			await offersService.findAllOfferTypes();
		handleSuccess(
			res,
			200,
			'Tipos de oferta obtenidos',
			response,
		);
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al obtener los tipos de oferta',
			error instanceof Error
				? error.message
				: 'Error desconocido',
		);
	}
}

export const offersController = {
	findOne,
	findMany,
	createOne,
	updateOne,
	deleteOne,
	findOfferTypes,
};
