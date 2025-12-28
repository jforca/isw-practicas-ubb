import { AppDataSource } from '../../config/db.config';
import { OffersType } from '@entities';

export async function seedOffersTypes() {
	const repo = AppDataSource.getRepository(OffersType);
	const count = await repo.count();
	if (count > 0) {
		console.log('OffersType ya existen — saltando seed.');
		return;
	}

	const types: Partial<OffersType>[] = [
		{ name: 'Práctica I', is_active: true },
		{ name: 'Práctica II', is_active: true },
	];

	await repo.save(types as OffersType[]);
	console.log('Seed: offers types creados.');
}
