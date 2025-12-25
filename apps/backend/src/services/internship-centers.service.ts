import { AppDataSource } from '@config/db.config';
import { InternshipCenter } from '@entities/internship-centers.entity';

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

async function findMany(offset: number, limit: number) {
	const [data, total] =
		await internshipCenterRepository.findAndCount({
			skip: offset,
			take: limit,
			order: { createdAt: 'DESC' },
		});

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

	internshipCenter.convention_document_id = documentId;
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
