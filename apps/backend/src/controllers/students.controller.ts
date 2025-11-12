import { Request, Response } from 'express';
import { studentsService } from '@services/students.service';
import {
	handleSuccess,
	handleErrorServer,
} from '@handlers/response.handler';
import type { TStudentUser } from '@services/students.service';

// GET /api/students
export async function listStudents(
	_req: Request,
	res: Response,
) {
	try {
		const data: TStudentUser[] =
			await studentsService.findAll();
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
