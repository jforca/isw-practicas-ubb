import { Request, Response } from 'express';
import { InternshipCenterServices } from '@services/internship-centers.service';
import {
	handleSuccess,
	handleErrorServer,
} from '@handlers/response.handler';

async function findOne(req: Request, res: Response) {
	const { id } = req.params;

	//filtrar informacion

	const response = await InternshipCenterServices.findOne(
		Number(id),
	);

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
