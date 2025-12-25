import { AppDataSource } from '@config/db.config';
import { InternshipCenter } from '@entities/internship-centers.entity';
import { Document } from '@entities/documents.entity';

const internshipCenterRepository =
	AppDataSource.getRepository(InternshipCenter);

type TCreateInternshipCenterData = Omit<
	InternshipCenter,
	'id' | 'createdAt' | 'updatedAt'
>;

type TUpdateInternshipCenterData =
	Partial<TCreateInternshipCenterData>;

async function findOne(id: number) {
	const internshipCenter =
		await internshipCenterRepository.findOneBy({
			id,
		});

	return internshipCenter;
}

async function findMany(
	offset: number,
	limit: number,
	filters?: {
		search?: string;
		hasConvention?: boolean | null;
	},
) {
	const queryBuilder = internshipCenterRepository
		.createQueryBuilder('ic')
		.skip(offset)
		.take(limit)
		.orderBy('ic.createdAt', 'DESC');

	// Filtro de búsqueda por nombre o RUT
	if (filters?.search) {
		queryBuilder.andWhere(
			'(ic.legal_name ILIKE :search OR ic.company_rut ILIKE :search)',
			{ search: `%${filters.search}%` },
		);
	}

	// Filtro por convenio
	if (filters?.hasConvention === true) {
		queryBuilder.andWhere(
			'ic.convention_document IS NOT NULL',
		);
	} else if (filters?.hasConvention === false) {
		queryBuilder.andWhere('ic.convention_document IS NULL');
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

async function createOne(
	data: TCreateInternshipCenterData,
) {
	const newInternshipCenter =
		internshipCenterRepository.create(data);
	const savedInternshipCenter =
		await internshipCenterRepository.save(
			newInternshipCenter,
		);

	return savedInternshipCenter;
}

async function updateOne(
	id: number,
	data: TUpdateInternshipCenterData,
) {
	const internshipCenter =
		await internshipCenterRepository.findOneBy({
			id,
		});

	if (!internshipCenter) {
		return null;
	}

	Object.assign(internshipCenter, data);
	const updatedInternshipCenter =
		await internshipCenterRepository.save(internshipCenter);

	return updatedInternshipCenter;
}

async function deleteOne(id: number) {
	const internshipCenter =
		await internshipCenterRepository.findOneBy({
			id,
		});

	if (!internshipCenter) {
		return null;
	}

	await internshipCenterRepository.remove(internshipCenter);

	return true;
}

async function updateConventionDocument(
	id: number,
	documentId: number | null,
) {
	const internshipCenter =
		await internshipCenterRepository.findOneBy({
			id,
		});

	if (!internshipCenter) {
		return null;
	}

	// Usar la relación directamente para que TypeORM actualice correctamente
	if (documentId === null) {
		internshipCenter.convention_document = null;
	} else {
		// Crear referencia al documento sin cargar toda la entidad
		internshipCenter.convention_document = {
			id: documentId,
		} as Document;
	}

	const updatedInternshipCenter =
		await internshipCenterRepository.save(internshipCenter);

	return updatedInternshipCenter;
}

export const InternshipCenterServices = {
	findOne,
	findMany,
	updateOne,
	deleteOne,
	createOne,
	updateConventionDocument,
};
