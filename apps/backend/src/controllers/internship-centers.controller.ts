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
	}).safeParse({ id: req.params.id });

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
	const response =
		await InternshipCenterServices.findMany();

	handleSuccess(
		res,
		200,
		'Lista de centros de práctica',
		response,
	);
}

async function updateOne(_req: Request, _res: Response) {}

async function deleteOne(_req: Request, _res: Response) {}

async function deleteMany(_req: Request, _res: Response) {}

async function createOne(_req: Request, _res: Response) {}

export const InternshipCenterControllers = {
	findOne,
	findMany,
	updateOne,
	deleteOne,
	createOne,
	deleteMany,
};
