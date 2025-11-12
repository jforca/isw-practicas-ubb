import { Request, Response } from 'express';
import { InternshipCenterServices } from '@services/internship-centers.service';
import {
	handleSuccess,
	handleErrorServer,
} from '@handlers/response.handler';

import { InternshipCentersSchema } from '@packages/schema/internship-centers.schema';

async function findOne(req: Request, res: Response) {
	const { data, error } = InternshipCentersSchema.pick({
		id: true,
	}).safeParse(req.params.id);

	if (error) {
		handleErrorServer(
			res,
			404,
			'Id no valido',
			'Id debe ser un número entero positivo',
		);
		return;
	}

	const { id } = data;

	const response =
		await InternshipCenterServices.findOne(id);

	if (!response) {
		handleErrorServer(
			res,
			404,
			'Centro de prácticas no encontrado',
			'No encontrado',
		);
		return;
	}

	handleSuccess(
		res,
		200,
		'Centro de prácticas encontrado',
		response,
	);
}

async function findMany(_req: Request, res: Response) {
	res.status(200).json({
		msg: 'Lista de centros de práctica',
	});
}

export const InternshipCenterControllers = {
	findOne,
	findMany,
};
