import { Request, Response } from 'express';
import {
	findMany,
	findOne,
	createStudent,
	updateStudent,
	deleteStudent,
} from '@services/students.service';
import {
	handleSuccess,
	handleErrorServer,
	handleErrorClient,
} from '@handlers/response.handler';
import type { TStudentUser } from '@services/students.service';

export async function listStudents(
	req: Request,
	res: Response,
) {
	try {
		const page = req.query.page
			? parseInt(req.query.page as string, 10)
			: 1;
		const limit = req.query.limit
			? parseInt(req.query.limit as string, 10)
			: 10;

		const [students, total] = await findMany(page, limit);

		const totalPages = Math.ceil(total / limit);

		return res.status(200).json({
			payload: students,
			pagination: {
				total,
				page,
				limit,
				totalPages,
			},
		});
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error al obtener estudiantes',
			err,
		);
	}
}

export async function getStudent(
	req: Request,
	res: Response,
) {
	try {
		const { id } = req.params;
		const data: TStudentUser | null = await findOne(id);
		if (data == null) {
			return handleErrorClient(
				res,
				404,
				'Estudiante no encontrado',
				data,
			);
		}
		return handleSuccess(
			res,
			200,
			'Estudiante obtenido con exito',
			data,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error al obtener estudiante',
			err,
		);
	}
}

export async function createNewStudent(
	req: Request,
	res: Response,
) {
	try {
		const data: TStudentUser | null = await createStudent(
			req.body,
		);

		if (data == null) {
			return handleErrorClient(
				res,
				400,
				'Error al crear estudiante',
				data,
			);
		}
		return handleSuccess(
			res,
			201,
			'Estudiante creado con exito',
			data,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error al crear estudiante',
			err,
		);
	}
}

export async function updateStudentData(
	req: Request,
	res: Response,
) {
	try {
		const { id } = req.params;
		const data: TStudentUser | null = await updateStudent(
			id,
			req.body,
		);
		if (data == null) {
			return handleErrorClient(
				res,
				404,
				'Estudiante no encontrado',
				data,
			);
		}
		return handleSuccess(
			res,
			200,
			'Estudiante actualizado con exito',
			data,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error al actualizar estudiante',
			err,
		);
	}
}

export async function deleteStudentData(
	req: Request,
	res: Response,
) {
	try {
		const { id } = req.params;
		const result = await deleteStudent(id);
		if (!result) {
			return handleErrorClient(
				res,
				404,
				'Estudiante no encontrado',
				null,
			);
		}
		return handleSuccess(
			res,
			200,
			'Estudiante eliminado con exito',
			{ id },
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error al eliminar estudiante',
			err,
		);
	}
}
