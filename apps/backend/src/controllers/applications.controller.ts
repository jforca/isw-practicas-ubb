import { ApplicationStatus } from '@entities/application.entity';
import {
	handleErrorClient,
	handleErrorServer,
	handleSuccess,
} from '@handlers/response.handler';
import {
	CreateApplicationSchema,
	UpdateApplicationStatusSchema,
} from '@packages/schema/applications.schema';
import { applicationsService } from '@services/applications.service';
import { Request, Response } from 'express';

async function createOne(req: Request, res: Response) {
	try {
		const parseResult = CreateApplicationSchema.safeParse(
			req.body,
		);

		if (!parseResult.success) {
			const errorMessages = parseResult.error.issues
				.map((issue) => issue.message)
				.join(', ');
			handleErrorClient(
				res,
				400,
				'Datos de entrada inválidos',
				errorMessages,
			);
			return;
		}

		const { offerId } = parseResult.data;
		const studentId = req.body.studentId;

		const response = await applicationsService.createOne({
			studentId,
			offerId,
		});

		handleSuccess(
			res,
			201,
			'Postulación creada exitosamente',
			response,
		);
	} catch (error) {
		if (error instanceof Error) {
			switch (error.message) {
				case 'OFFER_NOT_FOUND':
					handleErrorClient(
						res,
						404,
						'Oferta no encontrada',
						'La oferta no existe',
					);
					return;
				case 'OFFER_NOT_AVAILABLE':
					handleErrorClient(
						res,
						400,
						'Oferta no disponible',
						'La oferta no está publicada',
					);
					return;
				case 'ACTIVE_INTERNSHIP_EXISTS':
					handleErrorClient(
						res,
						400,
						'Ya tienes una práctica activa',
						'No puedes postular con una práctica en curso',
					);
					return;
				case 'ACADEMIC_REQUIREMENTS_NOT_MET':
					handleErrorClient(
						res,
						400,
						'Requisitos no cumplidos',
						'No cumples los requisitos académicos',
					);
					return;
				case 'DUPLICATE_APPLICATION':
					handleErrorClient(
						res,
						409,
						'Postulación duplicada',
						'Ya postulaste a esta oferta',
					);
					return;
			}
		}

		handleErrorServer(
			res,
			500,
			'Error al crear la postulación',
			error instanceof Error
				? error.message
				: 'Error desconocido',
		);
	}
}

async function findByStudent(req: Request, res: Response) {
	try {
		const studentId = req.params.studentId;
		const offset = Number(req.query.offset) || 0;
		const limit = Number(req.query.limit) || 10;

		const response =
			await applicationsService.findByStudent(
				studentId,
				offset,
				limit,
			);

		handleSuccess(
			res,
			200,
			'Postulaciones obtenidas',
			response,
		);
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al obtener las postulaciones',
			error instanceof Error
				? error.message
				: 'Error desconocido',
		);
	}
}

async function findOne(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const response = await applicationsService.findOne(
			Number(id),
		);

		if (!response) {
			handleErrorClient(
				res,
				404,
				'Postulación no encontrada',
				'No encontrada',
			);
			return;
		}

		handleSuccess(
			res,
			200,
			'Postulación encontrada',
			response,
		);
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al obtener la postulación',
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

		const response = await applicationsService.findMany(
			offset,
			limit,
			{
				search,
				status,
				offerTypeId,
			},
		);

		handleSuccess(
			res,
			200,
			'Postulaciones obtenidas',
			response,
		);
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al obtener las postulaciones',
			error instanceof Error
				? error.message
				: 'Error desconocido',
		);
	}
}

async function updateStatus(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const parseResult =
			UpdateApplicationStatusSchema.safeParse(req.body);

		if (!parseResult.success) {
			const errorMessages = parseResult.error.issues
				.map((issue) => issue.message)
				.join(', ');
			handleErrorClient(
				res,
				400,
				'Datos de entrada inválidos',
				errorMessages,
			);
			return;
		}

		const { status } = parseResult.data;

		const response = await applicationsService.updateStatus(
			Number(id),
			{ status: status as ApplicationStatus },
		);

		if (!response) {
			handleErrorClient(
				res,
				404,
				'Postulación no encontrada',
				'No encontrada',
			);
			return;
		}

		handleSuccess(
			res,
			200,
			'Estado actualizado exitosamente',
			response,
		);
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al actualizar el estado',
			error instanceof Error
				? error.message
				: 'Error desconocido',
		);
	}
}

export const applicationsController = {
	createOne,
	findByStudent,
	findOne,
	findMany,
	updateStatus,
};
