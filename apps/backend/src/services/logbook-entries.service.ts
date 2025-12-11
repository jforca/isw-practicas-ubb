import { AppDataSource } from '@config/db.config';
import { LogbookEntries } from '@entities';

export interface ICreateLogbookDto {
	title: string;
	body: string;
	internshipId: number;
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
		console.error('Error finding logbook entry:', error);
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
		console.error('Error finding logbook entries:', error);
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
		console.error('Error creating logbook entry:', error);
		return null;
	}
}

export const LogbookEntriesServices = {
	findOne,
	findMany,
	createOne,
};
