import { Request, Response } from 'express';
import { ReportsService } from '@services/reports.service';
import {
	handleSuccess,
	handleErrorServer,
	handleErrorClient,
} from '@handlers/response.handler';
import fs from 'fs';
import path from 'path';

async function uploadReport(req: Request, res: Response) {
	try {
		if (!req.file) {
			return handleErrorClient(
				res,
				400,
				'No se ha subido ningún archivo',
				null,
			);
		}

		const { internshipId, title } = req.body;

		if (!internshipId) {
			fs.unlinkSync(req.file.path);
			return handleErrorClient(
				res,
				400,
				'Faltan datos requeridos (internshipId)',
				null,
			);
		}

		const data = await ReportsService.createOne({
			title,
			filePath: req.file.filename,
			fileName: req.file.originalname,
			mimeType: req.file.mimetype,
			internshipId: Number(internshipId),
		});

		if (!data) {
			fs.unlinkSync(req.file.path);
			return handleErrorServer(
				res,
				500,
				'No se pudo guardar el informe',
				null,
			);
		}

		return handleSuccess(
			res,
			201,
			'Informe subido correctamente',
			data,
		);
	} catch (err) {
		if (req.file) {
			fs.unlinkSync(req.file.path);
		}
		return handleErrorServer(
			res,
			500,
			'Error interno al subir el informe',
			err,
		);
	}
}

async function getReports(req: Request, res: Response) {
	try {
		const { internshipId } = req.query;
		if (!internshipId) {
			return handleErrorClient(
				res,
				400,
				'internshipId es requerido',
				null,
			);
		}

		const reports = await ReportsService.findMany(
			Number(internshipId),
		);

		if (!reports) {
			return handleErrorServer(
				res,
				500,
				'Error al obtener informes',
				null,
			);
		}

		return handleSuccess(
			res,
			200,
			'Informes obtenidos',
			reports,
		);
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error interno',
			err,
		);
	}
}

async function deleteReport(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const report = await ReportsService.findOne(Number(id));
		if (!report) {
			return handleErrorClient(
				res,
				404,
				'Informe no encontrado',
				null,
			);
		}

		const isDeleted = await ReportsService.deleteOne(
			Number(id),
		);

		if (isDeleted) {
			const filePath = path.join(
				process.cwd(),
				'uploads',
				'reports',
				report.file_path,
			);
			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath);
			}
			return handleSuccess(res, 200, 'Informe eliminado', {
				id,
			});
		} else {
			return handleErrorServer(
				res,
				500,
				'No se pudo eliminar el informe',
				null,
			);
		}
	} catch (err) {
		return handleErrorServer(
			res,
			500,
			'Error interno',
			err,
		);
	}
}

export const ReportsController = {
	uploadReport,
	getReports,
	deleteReport,
};
