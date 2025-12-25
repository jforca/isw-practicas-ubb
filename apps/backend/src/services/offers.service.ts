import { AppDataSource } from '@config/db.config';
import {
	Offer,
	OfferStatus,
} from '@entities/offers.entity';
import { OffersType } from '@entities/offers-types.entity';
import { InternshipCenter } from '@entities/internship-centers.entity';

const offerRepo = AppDataSource.getRepository(Offer);
const offerTypeRepo =
	AppDataSource.getRepository(OffersType);

type TCreateOfferData = {
	title: string;
	description: string;
	deadline: Date;
	status?: OfferStatus;
	offerTypeId: number;
	internshipCenterId: number;
};

type TUpdateOfferData = Partial<TCreateOfferData>;

export async function findMany(
	offset: number,
	limit: number,
	filters?: {
		search?: string;
		status?: string;
		offerTypeId?: number;
	},
) {
	const queryBuilder = offerRepo
		.createQueryBuilder('offer')
		.leftJoinAndSelect('offer.offerType', 'offerType')
		.leftJoinAndSelect(
			'offer.internshipCenter',
			'internshipCenter',
		)
		.skip(offset)
		.take(limit)
		.orderBy('offer.createdAt', 'DESC');

	// Filtro de búsqueda por título
	if (filters?.search) {
		queryBuilder.andWhere('offer.title ILIKE :search', {
			search: `%${filters.search}%`,
		});
	}

	// Filtro por estado
	if (filters?.status && filters.status !== 'all') {
		queryBuilder.andWhere('offer.status = :status', {
			status: filters.status,
		});
	}

	// Filtro por tipo de práctica
	if (filters?.offerTypeId) {
		queryBuilder.andWhere(
			'offer.offer_type_id = :offerTypeId',
			{
				offerTypeId: filters.offerTypeId,
			},
		);
	}

	const [data, total] =
		await queryBuilder.getManyAndCount();

	return {
		data,
		pagination: {
			total,
			offset,
			limit,
			hasMore: offset + limit < total,
		},
	};
}

export async function findOne(id: number) {
	const offer = await offerRepo.findOne({
		where: { id },
		relations: [
			'offerType',
			'internshipCenter',
			'coordinator',
		],
	});

	return offer;
}

export async function createOne(data: TCreateOfferData) {
	const newOffer = offerRepo.create({
		title: data.title,
		description: data.description,
		deadline: data.deadline,
		status: data.status ?? OfferStatus.Published,
		offerType: { id: data.offerTypeId } as OffersType,
		internshipCenter: {
			id: data.internshipCenterId,
		} as InternshipCenter,
	});

	const savedOffer = await offerRepo.save(newOffer);

	// Recargar con relaciones
	return offerRepo.findOne({
		where: { id: savedOffer.id },
		relations: ['offerType', 'internshipCenter'],
	});
}

export async function updateOne(
	id: number,
	data: TUpdateOfferData,
) {
	const offer = await offerRepo.findOne({
		where: { id },
		relations: ['offerType', 'internshipCenter'],
	});

	if (!offer) {
		return null;
	}

	if (data.title !== undefined) offer.title = data.title;
	if (data.description !== undefined)
		offer.description = data.description;
	if (data.deadline !== undefined)
		offer.deadline = data.deadline;
	if (data.status !== undefined) offer.status = data.status;
	if (data.offerTypeId !== undefined) {
		offer.offerType = {
			id: data.offerTypeId,
		} as OffersType;
	}
	if (data.internshipCenterId !== undefined) {
		offer.internshipCenter = {
			id: data.internshipCenterId,
		} as InternshipCenter;
	}

	const updatedOffer = await offerRepo.save(offer);

	return offerRepo.findOne({
		where: { id: updatedOffer.id },
		relations: ['offerType', 'internshipCenter'],
	});
}

export async function deleteOne(id: number) {
	const offer = await offerRepo.findOneBy({ id });

	if (!offer) {
		return null;
	}

	await offerRepo.remove(offer);
	return true;
}

export async function findAllOfferTypes() {
	return offerTypeRepo.find({
		where: { is_active: true },
		order: { id: 'ASC' },
	});
}

export const offersService = {
	findMany,
	findOne,
	createOne,
	updateOne,
	deleteOne,
	findAllOfferTypes,
};
