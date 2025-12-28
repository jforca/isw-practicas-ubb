import { AppDataSource } from '@config/db.config';
import {
	Offer,
	OfferStatus,
} from '@entities/offers.entity';
import { OffersType } from '@entities/offers-types.entity';
import { OfferOfferType } from '@entities/offer-offer-type.entity';
import { InternshipCenter } from '@entities/internship-centers.entity';
import { In } from 'typeorm';

const offerRepo = AppDataSource.getRepository(Offer);
const offerTypeRepo =
	AppDataSource.getRepository(OffersType);
const offerOfferTypeRepo =
	AppDataSource.getRepository(OfferOfferType);

type TCreateOfferData = {
	title: string;
	description: string;
	deadline: Date;
	status?: OfferStatus;
	offerTypeIds: number[];
	internshipCenterId: number;
};

type TUpdateOfferData = {
	title?: string;
	description?: string;
	deadline?: Date;
	status?: OfferStatus;
	offerTypeIds?: number[];
	internshipCenterId?: number;
};

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
		.leftJoinAndSelect(
			'offer.offerOfferTypes',
			'offerOfferTypes',
		)
		.leftJoinAndSelect(
			'offerOfferTypes.offerType',
			'offerType',
		)
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

	// Filtro por tipo de práctica (busca en la tabla intermedia)
	if (filters?.offerTypeId) {
		queryBuilder.andWhere(
			'offerOfferTypes.offer_type_id = :offerTypeId',
			{
				offerTypeId: filters.offerTypeId,
			},
		);
	}

	const [data, total] =
		await queryBuilder.getManyAndCount();

	// Transformar los datos para incluir offerTypes como array
	const transformedData = data.map((offer) => ({
		...offer,
		offerTypes:
			offer.offerOfferTypes?.map((oot) => oot.offerType) ||
			[],
	}));

	return {
		data: transformedData,
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
			'offerOfferTypes',
			'offerOfferTypes.offerType',
			'internshipCenter',
			'coordinator',
		],
	});

	if (!offer) return null;

	// Transformar para incluir offerTypes como array
	return {
		...offer,
		offerTypes:
			offer.offerOfferTypes?.map((oot) => oot.offerType) ||
			[],
	};
}

export async function createOne(data: TCreateOfferData) {
	// Verificar que los tipos de oferta existan
	const offerTypes = await offerTypeRepo.find({
		where: { id: In(data.offerTypeIds), is_active: true },
	});

	if (offerTypes.length !== data.offerTypeIds.length) {
		throw new Error(
			'Uno o más tipos de oferta no son válidos',
		);
	}

	const newOffer = offerRepo.create({
		title: data.title,
		description: data.description,
		deadline: data.deadline,
		status: data.status ?? OfferStatus.Published,
		internshipCenter: {
			id: data.internshipCenterId,
		} as InternshipCenter,
	});

	const savedOffer = await offerRepo.save(newOffer);

	// Crear las relaciones en la tabla intermedia
	const offerOfferTypes = data.offerTypeIds.map(
		(typeId) => {
			return offerOfferTypeRepo.create({
				offer: savedOffer,
				offerType: { id: typeId } as OffersType,
			});
		},
	);

	await offerOfferTypeRepo.save(offerOfferTypes);

	// Recargar con relaciones
	return findOne(savedOffer.id);
}

export async function updateOne(
	id: number,
	data: TUpdateOfferData,
) {
	const offer = await offerRepo.findOne({
		where: { id },
		relations: ['offerOfferTypes', 'internshipCenter'],
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
	if (data.internshipCenterId !== undefined) {
		offer.internshipCenter = {
			id: data.internshipCenterId,
		} as InternshipCenter;
	}

	await offerRepo.save(offer);

	// Actualizar tipos de oferta si se proporcionaron
	if (data.offerTypeIds !== undefined) {
		// Verificar que los tipos de oferta existan
		const offerTypes = await offerTypeRepo.find({
			where: { id: In(data.offerTypeIds), is_active: true },
		});

		if (offerTypes.length !== data.offerTypeIds.length) {
			throw new Error(
				'Uno o más tipos de oferta no son válidos',
			);
		}

		// Eliminar relaciones existentes
		await offerOfferTypeRepo.delete({ offer: { id } });

		// Crear nuevas relaciones
		const offerOfferTypes = data.offerTypeIds.map(
			(typeId) => {
				return offerOfferTypeRepo.create({
					offer: { id } as Offer,
					offerType: { id: typeId } as OffersType,
				});
			},
		);

		await offerOfferTypeRepo.save(offerOfferTypes);
	}

	return findOne(id);
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
