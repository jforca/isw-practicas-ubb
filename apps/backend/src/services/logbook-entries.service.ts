import { AppDataSource } from '@config/db.config';
import { LogbookEntries } from '@entities';
import { Like, FindOptionsWhere } from 'typeorm';

export interface ICreateLogbookDto {
	title: string;
	content: string;
	internshipId: number;
}

export interface IUpdateLogbookDto {
	title?: string;
	content?: string;
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
		console.error('Error al buscar la bitacora:', error);
	}
}

async function findMany(
	offset: number,
	limit: number,
	internshipId?: number,
	title?: string,
) {
	try {
		const logbookEntriesRepo =
			AppDataSource.getRepository(LogbookEntries);

		const where: FindOptionsWhere<LogbookEntries> = {};
		if (internshipId) {
			where.internship = { id: internshipId };
		}
		if (title) {
			where.title = Like(`%${title}%`);
		}

		const [entries, total] =
			await logbookEntriesRepo.findAndCount({
				where,
				skip: offset,
				take: limit,
				order: { created_at: 'DESC' },
				relations: ['internship'],
			});

		return { entries, total };
	} catch (error) {
		console.error('Error al buscar las bitacoras:', error);
		return null;
	}
}

async function createOne(data: ICreateLogbookDto) {
	try {
		const logbookEntriesRepo =
			AppDataSource.getRepository(LogbookEntries);

		const newEntry = logbookEntriesRepo.create({
			title: data.title,
			body: data.content,
			internship: { id: data.internshipId },
		});

		return await logbookEntriesRepo.save(newEntry);
	} catch (error) {
		console.error('Error creando la bitacora:', error);
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
		const updatePayload = {
			...(data.title && { title: data.title }),

			...(data.content && { body: data.content }),

			...(data.internshipId && {
				internship: { id: data.internshipId },
			}),

			updated_at: new Date(),
		};

		logbookEntriesRepo.merge(entry, updatePayload);

		const updatedEntry =
			await logbookEntriesRepo.save(entry);
		return updatedEntry;
	} catch (error) {
		console.error(
			'Error al actualizar la bitacora:',
			error,
		);
		return null;
	}
}

async function deleteOne(id: number) {
	try {
		const logbookEntriesRepo =
			AppDataSource.getRepository(LogbookEntries);

		const result = await logbookEntriesRepo.delete(id);

		return result.affected !== 0;
	} catch (error) {
		console.error('Error al eliminar la bitacora:', error);
		return false;
	}
}

export const LogbookEntriesServices = {
	findOne,
	findMany,
	createOne,
	updateOne,
	deleteOne,
};
