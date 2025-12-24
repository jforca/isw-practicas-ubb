import { Request, Response } from 'express';
import { InternshipCenterServices } from '@services/internship-centers.service';
import {
	handleSuccess,
	handleErrorServer,
	handleErrorClient,
} from '@handlers/response.handler';
import { z } from 'zod/v4';
import { InternshipCentersSchema } from '@packages/schema/internship-centers.schema';

async function createOne(req: Request, res: Response) {
	const { data, error } = InternshipCentersSchema.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	}).safeParse(req.body);

	if (error) {
		handleErrorClient(
			res,
			400,
			'Datos inválidos',
			error.issues,
		);
		return;
	}

	try {
		const response =
			await InternshipCenterServices.createOne(
				data as Parameters<
					typeof InternshipCenterServices.createOne
				>[0],
			);

		if (!response) {
			handleErrorServer(
				res,
				500,
				'Error al crear centro de prácticas',
				'No se pudo crear el registro',
			);
			return;
		}

		handleSuccess(
			res,
			201,
			'Centro de prácticas creado exitosamente',
			response,
		);
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al crear centro de prácticas',
			error,
		);
	}
}

async function findOne(req: Request, res: Response) {
	const { data, error } = InternshipCentersSchema.pick({
		id: true,
	}).safeParse({ id: req.params.id });

	if (error) {
		handleErrorClient(
			res,
			400,
			'Id no válido',
			'Id debe ser un número entero positivo',
		);
		return;
	}

	const { id } = data;

	try {
		const response =
			await InternshipCenterServices.findOne(id);

		if (!response) {
			handleErrorClient(
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
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al buscar centro de prácticas',
			error,
		);
	}
}

const PaginationSchema = z.object({
	offset: z.coerce.number().int().nonnegative().default(0),
	limit: z.coerce
		.number()
		.int()
		.positive()
		.max(100)
		.default(10),
});

async function findMany(req: Request, res: Response) {
	const { data, error } = PaginationSchema.safeParse(
		req.query,
	);

	if (error) {
		handleErrorClient(
			res,
			400,
			'Parámetros de paginación inválidos',
			error.issues,
		);
		return;
	}

	const { offset, limit } = data;

	try {
		const response =
			await InternshipCenterServices.findMany(
				offset,
				limit,
			);

		handleSuccess(
			res,
			200,
			'Lista de centros de práctica',
			response,
		);
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al obtener centros de práctica',
			error,
		);
	}
}

async function updateOne(req: Request, res: Response) {
	const { data: idData, error: idError } =
		InternshipCentersSchema.pick({
			id: true,
		}).safeParse({ id: req.params.id });

	if (idError) {
		handleErrorClient(
			res,
			400,
			'Id no válido',
			'Id debe ser un número entero positivo',
		);
		return;
	}

	const { data, error } = InternshipCentersSchema.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	})
		.partial()
		.safeParse(req.body);

	if (error) {
		handleErrorClient(
			res,
			400,
			'Datos inválidos',
			error.issues,
		);
		return;
	}

	if (Object.keys(data).length === 0) {
		handleErrorClient(
			res,
			400,
			'No hay datos para actualizar',
			'Debe proporcionar al menos un campo para actualizar',
		);
		return;
	}

	try {
		const response =
			await InternshipCenterServices.updateOne(
				idData.id,
				data as Parameters<
					typeof InternshipCenterServices.updateOne
				>[1],
			);

		if (!response) {
			handleErrorClient(
				res,
				404,
				'Centro de prácticas no encontrado',
				'No se encontró el registro para actualizar',
			);
			return;
		}

		handleSuccess(
			res,
			200,
			'Centro de prácticas actualizado exitosamente',
			response,
		);
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al actualizar centro de prácticas',
			error,
		);
	}
}

async function deleteOne(req: Request, res: Response) {
	const { data, error } = InternshipCentersSchema.pick({
		id: true,
	}).safeParse({ id: req.params.id });

	if (error) {
		handleErrorClient(
			res,
			400,
			'Id no válido',
			'Id debe ser un número entero positivo',
		);
		return;
	}

	const { id } = data;

	try {
		const response =
			await InternshipCenterServices.deleteOne(id);

		if (!response) {
			handleErrorClient(
				res,
				404,
				'Centro de prácticas no encontrado',
				'No se encontró el registro para eliminar',
			);
			return;
		}

		handleSuccess(
			res,
			200,
			'Centro de prácticas eliminado exitosamente',
			{ id },
		);
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al eliminar centro de prácticas',
			error,
		);
	}
}

export const InternshipCenterControllers = {
	findOne,
	findMany,
	updateOne,
	deleteOne,
	createOne,
};
