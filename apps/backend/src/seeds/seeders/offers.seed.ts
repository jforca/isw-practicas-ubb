import { AppDataSource } from '../../config/db.config';
import {
	Offer,
	OffersType,
	Coordinator,
	InternshipCenter,
} from '@entities';

export async function seedOffers() {
	const repo = AppDataSource.getRepository(Offer);
	const typeRepo = AppDataSource.getRepository(OffersType);
	const coordRepo =
		AppDataSource.getRepository(Coordinator);
	const centerRepo = AppDataSource.getRepository(
		InternshipCenter,
	);

	const count = await repo.count();
	if (count > 0) {
		console.log('Offers ya existen — saltando seed.');
		return;
	}

	const type = await typeRepo.findOne({
		where: { name: 'PRACTICA 1' },
	});
	const coordinator = await coordRepo.findOne({
		where: {},
	});
	const center = await centerRepo.findOne({ where: {} });

	if (!type || !coordinator || !center) {
		console.log(
			'Faltan datos referenciados para crear offers (type/coordinator/center).',
		);
		return;
	}

	const deadline = new Date();
	deadline.setMonth(deadline.getMonth() + 1);

	const offers: Partial<Offer>[] = [
		{
			title: 'Oferta PRACTICA 1 - Desarrollo',
			description:
				'Pasantía para estudiantes en área de desarrollo.',
			deadline,
			offerType: type,
			coordinator,
			internshipCenter: center,
		},
		{
			title: 'Oferta PRACTICA 2 - Analista',
			description:
				'Pasantía para estudiantes en área de análisis.',
			deadline: new Date(
				deadline.getTime() + 1000 * 60 * 60 * 24 * 7,
			),
			offerType: type,
			coordinator,
			internshipCenter: center,
		},
	];

	await repo.save(offers as Offer[]);
	console.log('Seed: offers creadas.');
}
