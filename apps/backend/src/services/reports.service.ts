import { AppDataSource } from '@config/db.config';
import {
	Document,
	ApplicationDocuments,
	Internship,
} from '@entities';

interface ICreateReportDto {
	title?: string;
	filePath: string;
	fileName: string;
	mimeType: string;
	internshipId: number;
}

async function createOne(data: ICreateReportDto) {
	const queryRunner = AppDataSource.createQueryRunner();
	console.log('--- ENTERING createOne vDEBUG ---');
	await queryRunner.connect();
	await queryRunner.startTransaction();

	try {
		const internshipRepo =
			queryRunner.manager.getRepository(Internship);
		const internship = await internshipRepo.findOne({
			where: { id: data.internshipId },
			relations: ['application'],
		});

		if (!internship || !internship.application) {
			throw new Error(
				'Internship or Application not found',
			);
		}

		const documentRepo =
			queryRunner.manager.getRepository(Document);
		const newDocument = documentRepo.create({
			file_name: data.fileName,

			file_path: data.filePath,
			mime_type: data.mimeType,
			uploaded_at: new Date(),
		});
		const savedDocument =
			await documentRepo.save(newDocument);

		const appDocRepo = queryRunner.manager.getRepository(
			ApplicationDocuments,
		);
		const newAppDoc = appDocRepo.create({
			application: { id: internship.application.id },
			document: savedDocument,
		});
		await appDocRepo.save(newAppDoc);

		await queryRunner.commitTransaction();
		return {
			...savedDocument,
			id: savedDocument.id,
			title: data.title,
		};
	} catch (error) {
		await queryRunner.rollbackTransaction();
		console.error('Error creando el informe:', error);
		throw error;
	} finally {
		await queryRunner.release();
	}
}

async function findMany(internshipId: number) {
	try {
		const internshipRepo =
			AppDataSource.getRepository(Internship);
		const internship = await internshipRepo.findOne({
			where: { id: internshipId },
			relations: ['application'],
		});

		if (!internship || !internship.application) {
			return [];
		}

		const appDocRepo = AppDataSource.getRepository(
			ApplicationDocuments,
		);
		const appDocs = await appDocRepo.find({
			where: {
				application: { id: internship.application.id },
			},
			relations: ['document'],
			order: { id: 'DESC' },
		});

		return appDocs.map((ad) => ({
			id: ad.document.id,
			title: ad.document.file_name,
			file_path: ad.document.file_path,
			uploaded_at: ad.document.uploaded_at,
			internship: { id: internshipId },
		}));
	} catch (error) {
		console.error('Error buscando informes:', error);
		return null;
	}
}

async function deleteOne(documentId: number) {
	const queryRunner = AppDataSource.createQueryRunner();
	await queryRunner.connect();
	await queryRunner.startTransaction();

	try {
		const appDocRepo = queryRunner.manager.getRepository(
			ApplicationDocuments,
		);
		const appDoc = await appDocRepo.findOne({
			where: { document: { id: documentId } },
			relations: ['document'],
		});

		if (appDoc) {
			await appDocRepo.remove(appDoc);
		}

		const documentRepo =
			queryRunner.manager.getRepository(Document);
		await documentRepo.delete(documentId);

		await queryRunner.commitTransaction();
		return true;
	} catch (error) {
		await queryRunner.rollbackTransaction();
		console.error('Error eliminando informe:', error);
		return false;
	} finally {
		await queryRunner.release();
	}
}

async function findOne(id: number) {
	try {
		const documentRepo =
			AppDataSource.getRepository(Document);
		return await documentRepo.findOneBy({ id });
	} catch (error) {
		console.error('Error buscando informe:', error);
		return null;
	}
}

export const ReportsService = {
	createOne,
	findMany,
	deleteOne,
	findOne,
};
