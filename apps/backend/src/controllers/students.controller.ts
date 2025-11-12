import { Request, Response } from 'express';
import { findMany } from '@services/students.service';
import {
	handleSuccess,
	handleErrorServer,
} from '@handlers/response.handlers';
import type { TStudentUser } from '@services/students.service';

export async function listStudents(
	_req: Request,
	res: Response,
) {
	try {
		const data: TStudentUser[] = await findMany();
		return handleSuccess(
			res,
			200,
			'Estudiantes obtenidos',
			data,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error al obtener estudiantes',
			err,
		);
	}
}
