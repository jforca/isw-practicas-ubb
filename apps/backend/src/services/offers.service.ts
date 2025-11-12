import { AppDataSource } from '@config/db.config';
import {
	Offer,
	OfferStatus,
} from '@entities/offers.entity';

const offerRepo = AppDataSource.getRepository(Offer);

export async function findMany() {
	const offers = await offerRepo.find({
		where: { status: OfferStatus.Published },
		relations: ['internshipType', 'internshipCenter'],
		order: { deadline: 'ASC' },
	});

	return offers;
}

export async function findOne(id: number) {
	const offer = await offerRepo.findOne({
		where: { id },

		relations: [
			'internshipType',
			'internshipCenter',
			'coordinator',
		],
	});

	return offer;
}

export const offersService = {
	findMany,
	findOne,
};
