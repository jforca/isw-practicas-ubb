import { Request, Response } from 'express';
import { DocumentServices } from '@services/documents.service';
import { InternshipCenterServices } from '@services/internship-centers.service';
import {
	handleSuccess,
	handleErrorServer,
	handleErrorClient,
} from '@handlers/response.handler';
import path from 'node:path';
import fs from 'node:fs';

async function uploadConvention(
	req: Request,
	res: Response,
) {
	const internshipCenterId = Number(req.params.id);

	if (
		Number.isNaN(internshipCenterId) ||
		internshipCenterId <= 0
	) {
		handleErrorClient(
			res,
			400,
			'Id no válido',
			'Id debe ser un número entero positivo',
		);
		return;
	}

	if (!req.file) {
		handleErrorClient(
			res,
			400,
			'Archivo requerido',
			'Debe proporcionar un archivo PDF',
		);
		return;
	}

	try {
		// Verificar que el centro de prácticas existe
		const internshipCenter =
			await InternshipCenterServices.findOne(
				internshipCenterId,
			);

		if (!internshipCenter) {
			// Eliminar el archivo subido si el centro no existe
			fs.unlinkSync(req.file.path);
			handleErrorClient(
				res,
				404,
				'Centro de prácticas no encontrado',
				'No se encontró el centro de prácticas',
			);
			return;
		}

		// Si ya tiene un convenio, eliminar el documento anterior
		if (internshipCenter.convention_document_id) {
			await DocumentServices.deleteOne(
				internshipCenter.convention_document_id,
			);
		}

		// Crear el registro del documento con ruta relativa
		const relativePath = path.join(
			'archives',
			'convention',
			path.basename(req.file.path),
		);
		const document = await DocumentServices.createOne({
			fileName: req.file.originalname,
			filePath: relativePath,
			mimeType: req.file.mimetype,
		});

		// Actualizar el centro de prácticas con el nuevo documento
		const updatedCenter =
			await InternshipCenterServices.updateConventionDocument(
				internshipCenterId,
				document.id,
			);

		handleSuccess(
			res,
			201,
			'Convenio subido exitosamente',
			{
				document: {
					id: document.id,
					fileName: document.file_name,
					mimeType: document.mime_type,
					uploadedAt: document.uploaded_at,
				},
				internshipCenter: updatedCenter,
			},
		);
	} catch (error) {
		// Eliminar el archivo si ocurre un error
		if (req.file && fs.existsSync(req.file.path)) {
			fs.unlinkSync(req.file.path);
		}
		handleErrorServer(
			res,
			500,
			'Error al subir el convenio',
			error,
		);
	}
}

async function downloadConvention(
	req: Request,
	res: Response,
) {
	const internshipCenterId = Number(req.params.id);

	if (
		Number.isNaN(internshipCenterId) ||
		internshipCenterId <= 0
	) {
		handleErrorClient(
			res,
			400,
			'Id no válido',
			'Id debe ser un número entero positivo',
		);
		return;
	}

	try {
		const internshipCenter =
			await InternshipCenterServices.findOne(
				internshipCenterId,
			);

		if (!internshipCenter) {
			handleErrorClient(
				res,
				404,
				'Centro de prácticas no encontrado',
				'No se encontró el centro de prácticas',
			);
			return;
		}

		if (!internshipCenter.convention_document_id) {
			handleErrorClient(
				res,
				404,
				'Convenio no encontrado',
				'Este centro de prácticas no tiene un convenio asociado',
			);
			return;
		}

		const document = await DocumentServices.findOne(
			internshipCenter.convention_document_id,
		);

		if (!document) {
			handleErrorClient(
				res,
				404,
				'Documento no encontrado',
				'No se encontró el archivo del convenio',
			);
			return;
		}

		// Construir ruta absoluta desde ruta relativa
		const filePath = path.join(
			__dirname,
			'..',
			document.file_path,
		);

		if (!fs.existsSync(filePath)) {
			handleErrorClient(
				res,
				404,
				'Archivo no encontrado',
				'El archivo físico no existe en el servidor',
			);
			return;
		}

		res.setHeader('Content-Type', document.mime_type);
		res.setHeader(
			'Content-Disposition',
			`attachment; filename="${document.file_name}"`,
		);

		const fileStream = fs.createReadStream(filePath);
		fileStream.pipe(res);
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al descargar el convenio',
			error,
		);
	}
}

async function viewConvention(req: Request, res: Response) {
	const internshipCenterId = Number(req.params.id);

	if (
		Number.isNaN(internshipCenterId) ||
		internshipCenterId <= 0
	) {
		handleErrorClient(
			res,
			400,
			'Id no válido',
			'Id debe ser un número entero positivo',
		);
		return;
	}

	try {
		const internshipCenter =
			await InternshipCenterServices.findOne(
				internshipCenterId,
			);

		if (!internshipCenter) {
			handleErrorClient(
				res,
				404,
				'Centro de prácticas no encontrado',
				'No se encontró el centro de prácticas',
			);
			return;
		}

		if (!internshipCenter.convention_document_id) {
			handleErrorClient(
				res,
				404,
				'Convenio no encontrado',
				'Este centro de prácticas no tiene un convenio asociado',
			);
			return;
		}

		const document = await DocumentServices.findOne(
			internshipCenter.convention_document_id,
		);

		if (!document) {
			handleErrorClient(
				res,
				404,
				'Documento no encontrado',
				'No se encontró el archivo del convenio',
			);
			return;
		}

		// Construir ruta absoluta desde ruta relativa
		const filePath = path.join(
			__dirname,
			'..',
			document.file_path,
		);

		if (!fs.existsSync(filePath)) {
			handleErrorClient(
				res,
				404,
				'Archivo no encontrado',
				'El archivo físico no existe en el servidor',
			);
			return;
		}

		res.setHeader('Content-Type', document.mime_type);
		res.setHeader(
			'Content-Disposition',
			`inline; filename="${document.file_name}"`,
		);

		const fileStream = fs.createReadStream(filePath);
		fileStream.pipe(res);
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al visualizar el convenio',
			error,
		);
	}
}

async function deleteConvention(
	req: Request,
	res: Response,
) {
	const internshipCenterId = Number(req.params.id);

	if (
		Number.isNaN(internshipCenterId) ||
		internshipCenterId <= 0
	) {
		handleErrorClient(
			res,
			400,
			'Id no válido',
			'Id debe ser un número entero positivo',
		);
		return;
	}

	try {
		const internshipCenter =
			await InternshipCenterServices.findOne(
				internshipCenterId,
			);

		if (!internshipCenter) {
			handleErrorClient(
				res,
				404,
				'Centro de prácticas no encontrado',
				'No se encontró el centro de prácticas',
			);
			return;
		}

		if (!internshipCenter.convention_document_id) {
			handleErrorClient(
				res,
				404,
				'Convenio no encontrado',
				'Este centro de prácticas no tiene un convenio asociado',
			);
			return;
		}

		// Eliminar el documento
		await DocumentServices.deleteOne(
			internshipCenter.convention_document_id,
		);

		// Actualizar el centro de prácticas
		await InternshipCenterServices.updateConventionDocument(
			internshipCenterId,
			null,
		);

		handleSuccess(
			res,
			200,
			'Convenio eliminado exitosamente',
			{ id: internshipCenterId },
		);
	} catch (error) {
		handleErrorServer(
			res,
			500,
			'Error al eliminar el convenio',
			error,
		);
	}
}

export const DocumentControllers = {
	uploadConvention,
	downloadConvention,
	viewConvention,
	deleteConvention,
};
