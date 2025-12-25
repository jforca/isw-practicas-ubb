import { AppDataSource } from '@config/db.config';
import { LogbookEntries } from '@entities';

export interface ICreateLogbookDto {
	title: string;
	body: string;
	internshipId: number;
}

export interface IUpdateLogbookDto {
	title?: string;
	body?: string;
	internshipId?: number;
}

async function findOne(id: number) {
	try {
		const logbookEntriesRepo =
			AppDataSource.getRepository(LogbookEntries);

		const entry = await logbookEntriesRepo.findOne({
			where: { id },
			relations: ['internship'],
		});

		return entry;
	} catch (error) {
		console.error('Error buscar bitacora:', error);
	}
}

async function findMany() {
	try {
		const logbookEntriesRepo =
			AppDataSource.getRepository(LogbookEntries);

		const entries = await logbookEntriesRepo.find({
			relations: ['internship'],
		});

		return entries;
	} catch (error) {
		console.error('Error al buscar bitacoras:', error);
	}
}

async function createOne(data: ICreateLogbookDto) {
	try {
		const logbookEntriesRepo =
			AppDataSource.getRepository(LogbookEntries);

		const newEntry = logbookEntriesRepo.create({
			title: data.title,
			body: data.body,
			internship: { id: data.internshipId },
		});

		const savedEntry =
			await logbookEntriesRepo.save(newEntry);

		return savedEntry;
	} catch (error) {
		console.error(
			'Error creando entrada de bitacora:',
			error,
		);
		return null;
	}
}

async function updateOne(
	id: number,
	data: IUpdateLogbookDto,
) {
	try {
		const logbookEntriesRepo =
			AppDataSource.getRepository(LogbookEntries);

		const entry = await logbookEntriesRepo.findOneBy({
			id,
		});
		if (!entry) return null;

		const updateData = {
			...data,
			...(data.internshipId && {
				internship: { id: data.internshipId },
			}),
		};

		logbookEntriesRepo.merge(entry, updateData);

		const updatedEntry =
			await logbookEntriesRepo.save(entry);
		return updatedEntry;
	} catch (error) {
		console.error(
			'Error al actualizar la bitácora:',
			error,
		);
		return null;
	}
}

export const LogbookEntriesServices = {
	findOne,
	findMany,
	createOne,
	updateOne,
};
