import { Request, Response } from 'express';
import {
	findMany,
	findOne,
	createStudent,
	updateStudent,
	deleteStudent,
	getStudentDetails,
	getDashboardStats,
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

		const search = req.query.search as string | undefined;
		const internshipTypes = req.query.internshipTypes
			? (req.query.internshipTypes as string)
					.split(',')
					.map((t) => t.trim())
			: undefined;
		const statuses = req.query.statuses
			? (req.query.statuses as string)
					.split(',')
					.map((s) => s.trim())
			: undefined;

		const [students, total] = await findMany(
			page,
			limit,
			search,
			internshipTypes,
			statuses,
		);

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

export async function getStudentDetailsData(
	req: Request,
	res: Response,
) {
	try {
		const { id } = req.params;
		const data = await getStudentDetails(id);

		if (!data) {
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
			'Detalles del estudiante obtenidos con éxito',
			data,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error al obtener detalles del estudiante',
			err,
		);
	}
}

export async function getStats(
	_req: Request,
	res: Response,
) {
	try {
		const stats = await getDashboardStats();
		return handleSuccess(
			res,
			200,
			'Estadísticas obtenidas con éxito',
			stats,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error al obtener estadísticas',
			err,
		);
	}
}
