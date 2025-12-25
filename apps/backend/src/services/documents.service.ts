import { AppDataSource } from '@config/db.config';
import { Document } from '@entities/documents.entity';
import fs from 'node:fs';
import path from 'node:path';

const documentRepository =
	AppDataSource.getRepository(Document);

type TCreateDocumentData = {
	fileName: string;
	filePath: string;
	mimeType: string;
	uploadedBy?: number;
};

async function createOne(data: TCreateDocumentData) {
	const newDocument = documentRepository.create({
		file_name: data.fileName,
		file_path: data.filePath,
		mime_type: data.mimeType,
		uploaded_at: new Date(),
	});

	const savedDocument =
		await documentRepository.save(newDocument);
	return savedDocument;
}

async function findOne(id: number) {
	const document = await documentRepository.findOneBy({
		id,
	});
	return document;
}

async function deleteOne(id: number) {
	const document = await documentRepository.findOneBy({
		id,
	});

	if (!document) {
		return null;
	}

	// Eliminar el archivo físico si existe
	const fullPath = path.resolve(document.file_path);
	if (fs.existsSync(fullPath)) {
		fs.unlinkSync(fullPath);
	}

	await documentRepository.remove(document);
	return true;
}

export const DocumentServices = {
	createOne,
	findOne,
	deleteOne,
};
