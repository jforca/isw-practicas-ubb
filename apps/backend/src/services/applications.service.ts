import { AppDataSource } from '@config/db.config';
import {
	AcademicRequirement,
	AcademicRequirementStatus,
} from '@entities/academic-requirements.entity';
import {
	Application,
	ApplicationStatus,
} from '@entities/application.entity';
import {
	Internship,
	InternshipStatus,
} from '@entities/internship.entity';
import { Offer } from '@entities/offers.entity';
import { User } from '@entities/user.entity';

const applicationRepo =
	AppDataSource.getRepository(Application);
const internshipRepo =
	AppDataSource.getRepository(Internship);
const academicRequirementRepo = AppDataSource.getRepository(
	AcademicRequirement,
);
const offerRepo = AppDataSource.getRepository(Offer);

type TCreateApplicationData = {
	studentId: string;
	offerId: number;
};

type TUpdateApplicationStatus = {
	status: ApplicationStatus;
};

type TApplicationFilters = {
	search?: string;
	status?: string;
	offerTypeId?: number;
};

async function checkActiveInternship(
	studentId: string,
): Promise<boolean> {
	const activeInternship = await internshipRepo.findOne({
		where: {
			status: InternshipStatus.InProgress,
			application: {
				student: { id: studentId },
			},
		},
		relations: ['application', 'application.student'],
	});

	return activeInternship !== null;
}

async function validateAcademicRequirements(
	studentId: string,
	offerTypeId: number,
): Promise<boolean> {
	const approved = await academicRequirementRepo.findOne({
		where: {
			student: { id: studentId },
			offerType: { id: offerTypeId },
			status: AcademicRequirementStatus.Approved,
		},
	});

	return approved !== null;
}

export async function createOne(
	data: TCreateApplicationData,
) {
	const offer = await offerRepo.findOne({
		where: { id: data.offerId },
		relations: [
			'offerOfferTypes',
			'offerOfferTypes.offerType',
		],
	});

	if (!offer) {
		throw new Error('OFFER_NOT_FOUND');
	}

	if (offer.status !== 'published') {
		throw new Error('OFFER_NOT_AVAILABLE');
	}

	const hasActiveInternship = await checkActiveInternship(
		data.studentId,
	);
	if (hasActiveInternship) {
		throw new Error('ACTIVE_INTERNSHIP_EXISTS');
	}

	const offerOfferTypes =
		(await offer.offerOfferTypes) ?? [];
	if (offerOfferTypes.length > 0) {
		const offerType = await offerOfferTypes[0].offerType;
		const offerTypeId = offerType?.id;
		if (offerTypeId) {
			const meetsRequirements =
				await validateAcademicRequirements(
					data.studentId,
					offerTypeId,
				);
			if (!meetsRequirements) {
				throw new Error('ACADEMIC_REQUIREMENTS_NOT_MET');
			}
		}
	}

	const existingApplication = await applicationRepo.findOne(
		{
			where: {
				student: { id: data.studentId },
				offer: { id: data.offerId },
			},
		},
	);

	if (existingApplication) {
		throw new Error('DUPLICATE_APPLICATION');
	}

	const newApplication = applicationRepo.create({
		student: { id: data.studentId } as User,
		offer: { id: data.offerId } as Offer,
		status: ApplicationStatus.Pending,
	});

	const savedApplication =
		await applicationRepo.save(newApplication);

	return findOne(savedApplication.id);
}

export async function findByStudent(
	studentId: string,
	offset: number = 0,
	limit: number = 10,
) {
	const queryBuilder = applicationRepo
		.createQueryBuilder('application')
		.leftJoinAndSelect('application.offer', 'offer')
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
		.where('application.student_id = :studentId', {
			studentId,
		})
		.skip(offset)
		.take(limit)
		.orderBy('application.created_at', 'DESC');

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
	const application = await applicationRepo.findOne({
		where: { id },
		relations: [
			'student',
			'offer',
			'offer.offerOfferTypes',
			'offer.offerOfferTypes.offerType',
			'offer.internshipCenter',
		],
	});

	if (!application) return null;

	return application;
}

export async function findMany(
	offset: number,
	limit: number,
	filters?: TApplicationFilters,
) {
	const queryBuilder = applicationRepo
		.createQueryBuilder('application')
		.leftJoinAndSelect('application.student', 'student')
		.leftJoinAndSelect('application.offer', 'offer')
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
		.orderBy('application.created_at', 'DESC');

	// Filtro de búsqueda por nombre de estudiante o título de oferta
	if (filters?.search) {
		queryBuilder.andWhere(
			'(student.name ILIKE :search OR offer.title ILIKE :search)',
			{ search: `%${filters.search}%` },
		);
	}

	// Filtro por estado
	if (filters?.status && filters.status !== 'all') {
		queryBuilder.andWhere('application.status = :status', {
			status: filters.status,
		});
	}

	// Filtro por tipo de práctica
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

export async function updateStatus(
	id: number,
	data: TUpdateApplicationStatus,
) {
	const application = await applicationRepo.findOne({
		where: { id },
	});

	if (!application) {
		return null;
	}

	application.status = data.status;
	await applicationRepo.save(application);

	return findOne(id);
}

export const applicationsService = {
	createOne,
	findByStudent,
	findOne,
	findMany,
	updateStatus,
};
