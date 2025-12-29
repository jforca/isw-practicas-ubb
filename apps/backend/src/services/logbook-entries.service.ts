import { AppDataSource } from '@config/db.config';
import { LogbookEntries } from '@entities';

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
) {
	try {
		const logbookEntriesRepo =
			AppDataSource.getRepository(LogbookEntries);

		const [entries, total] =
			await logbookEntriesRepo.findAndCount({
				where: internshipId
					? { internship: { id: internshipId } }
					: {},
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
			body: data.content, // Mapeo content -> body
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

		// ✅ SOLUCIÓN AL ERROR DE 'ANY':
		// Construimos el objeto dinámicamente usando spread syntax conditional.
		// TypeScript inferirá automáticamente el tipo correcto.
		const updatePayload = {
			// Si data.title existe, agrega { title: data.title } al objeto
			...(data.title && { title: data.title }),

			// Si data.content existe, agrega { body: data.content } (MAPEO CLAVE)
			...(data.content && { body: data.content }),

			// Si data.internshipId existe, agrega la relación
			...(data.internshipId && {
				internship: { id: data.internshipId },
			}),

			// Siempre actualizamos la fecha
			updated_at: new Date(),
		};

		// Ahora 'updatePayload' tiene un tipo seguro y merge lo aceptará
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
