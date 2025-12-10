import { AppDataSource } from '@config/db.config';
import { LogbookEntries } from '@entities';

export type TLogbookEntry = LogbookEntries;

const logbookEntriesRepo =
	AppDataSource.getRepository(LogbookEntries);

async function findOne(
	id: number,
): Promise<TLogbookEntry | null> {
	try {
		const entry = await logbookEntriesRepo.findOne({
			where: { id },
			relations: ['internship'],
		});

		return entry;
	} catch (error) {
		console.error(
			'Error al buscar el registro del libro de bitácora por ID:',
			error,
		);
		return null;
	}
}

async function findAll(): Promise<TLogbookEntry[]> {
	try {
		const rows = await logbookEntriesRepo.find({
			relations: ['internship'],
		});

		return rows as TLogbookEntry[];
	} catch (error) {
		console.error(
			'Error al obtener todos los registros del libro de bitácora:',
			error,
		);
		return [];
	}
}

export const logbookEntriesService = {
	findOne,
	findAll,
};
