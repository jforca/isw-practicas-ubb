import { Request, Response } from 'express';
import { findOneService } from '@services/internship-centers.service';

export async function findOneController(
	req: Request,
	res: Response,
) {
	const { id } = req.params;

	//filtrar informacion

	const a = await findOneService(Number(id));

	if (!a) {
		res.status(404).json({
			data: null,
			error: 'Centro de prácticas no encontrado',
		});
		return;
	}

	res.status(200).json({
		data: a,
		error: null,
	});
}

export async function findManyController(
	_req: Request,
	res: Response,
) {
	res.status(200).json({
		msg: 'Lista de centros de práctica',
	});
}
