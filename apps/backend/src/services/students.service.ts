import { AppDataSource } from '@config/db.config';
import { User } from '@entities';
import { Student } from '@entities/students.entity';
import { randomUUID } from 'node:crypto';
import {
	Application,
	ApplicationStatus,
} from '@entities/application.entity';
import {
	Internship,
	InternshipStatus,
} from '@entities/internship.entity';
import { StudentInternship } from '@packages/schema/student.schema';

import type { TStudentInternship } from '@packages/schema/student.schema';

export type TStudentUser = User;

export type TStudentWhithInternshipInfo = TStudentUser & {
	internshipType: string;
	internshipStatus: string;
	currentInternship: string;
};

const userRepo = AppDataSource.getRepository(User);
const studentRepo = AppDataSource.getRepository(Student);
const applicationRepo =
	AppDataSource.getRepository(Application);
const internshipRepo =
	AppDataSource.getRepository(Internship);

function mapInternshipStatus(status: InternshipStatus) {
	switch (status) {
		case InternshipStatus.InProgress:
			return 'En Curso';
		case InternshipStatus.PendingEvaluation:
			return 'Evaluación Pendiente';
		case InternshipStatus.Finished:
			return 'Finalizada';
		default:
			return 'Desconocido';
	}
}

import { Brackets } from 'typeorm';

function mapStatusToEnum(
	status: string,
): InternshipStatus | undefined {
	switch (status) {
		case 'En Curso':
			return InternshipStatus.InProgress;
		case 'Evaluación Pendiente':
			return InternshipStatus.PendingEvaluation;
		case 'Finalizada':
			return InternshipStatus.Finished;
		default:
			return undefined;
	}
}

export async function findMany(
	page: number,
	limit: number,
	search?: string,
	internshipTypes?: string[],
	statuses?: string[],
): Promise<[TStudentWhithInternshipInfo[], number]> {
	const queryBuilder = userRepo
		.createQueryBuilder('user')
		.leftJoinAndSelect(
			'Student',
			'student',
			'student.id = user.id',
		)
		.where('user.user_role = :role', { role: 'student' });

	if (search && search.trim() !== '') {
		queryBuilder.andWhere(
			'(user.name ILIKE :search OR user.rut ILIKE :search OR user.email ILIKE :search)',
			{ search: `%${search.trim()}%` },
		);
	}

	if (internshipTypes && internshipTypes.length > 0) {
		queryBuilder.andWhere(
			new Brackets((qb) => {
				qb.where(
					'student.currentInternship IN (:...types)',
					{
						types: internshipTypes,
					},
				);
				if (internshipTypes.includes('Práctica 1')) {
					qb.orWhere('student.id IS NULL');
				}
			}),
		);
	}

	if (statuses && statuses.length > 0) {
		queryBuilder.leftJoin(
			'Application',
			'app',
			'app.student_id = user.id',
		);

		queryBuilder.leftJoin(
			'Internship',
			'internship',
			'internship.application_id = app.id',
		);

		const enumStatuses: InternshipStatus[] = [];
		const derivedStatuses: string[] = [];

		statuses.forEach((s) => {
			const mapped = mapStatusToEnum(s);
			if (mapped) {
				enumStatuses.push(mapped);
			} else {
				derivedStatuses.push(s);
			}
		});

		queryBuilder.andWhere(
			new Brackets((qb) => {
				let hasCondition = false;

				if (enumStatuses.length > 0) {
					qb.where(
						'internship.status IN (:...enumStatuses)',
						{
							enumStatuses,
						},
					);
					hasCondition = true;
				}

				if (derivedStatuses.includes('Aprobada')) {
					const condition =
						'app.status = :approved AND internship.id IS NULL';
					if (hasCondition) {
						qb.orWhere(condition, {
							approved: ApplicationStatus.Approved,
						});
					} else {
						qb.where(condition, {
							approved: ApplicationStatus.Approved,
						});
						hasCondition = true;
					}
				}

				if (derivedStatuses.includes('No aprobada')) {
					const condition =
						'(app.status != :approved OR app.id IS NULL)';
					if (hasCondition) {
						qb.orWhere(condition, {
							approved: ApplicationStatus.Approved,
						});
					} else {
						qb.where(condition, {
							approved: ApplicationStatus.Approved,
						});
						hasCondition = true;
					}
				}

				if (!hasCondition) {
					qb.where('1 = 0');
				}
			}),
		);
	}

	const [rows, total] = await queryBuilder
		.orderBy('user.name', 'ASC')
		.skip((page - 1) * limit)
		.take(limit)
		.getManyAndCount();

	const studentsWithInternshipInfo = await Promise.all(
		rows.map(async (user) => {
			const application = await applicationRepo.findOne({
				where: {
					student: { id: user.id },
				},
				relations: [
					'offer',
					'offer.offerOfferTypes',
					'offer.offerOfferTypes.offerType',
				],
				order: { created_at: 'DESC' },
			});

			let internshipType = 'No inscrito';
			let internshipStatus = 'No aprobada';

			if (application) {
				if (
					application.status === ApplicationStatus.Approved
				) {
					internshipType =
						application.offer?.offerOfferTypes?.[0]
							?.offerType?.name || 'No inscrito';

					const internship = await internshipRepo.findOne({
						where: {
							application: { id: application.id },
						},
					});

					if (internship) {
						internshipStatus = mapInternshipStatus(
							internship.status,
						);
					} else {
						internshipStatus = 'Aprobada';
					}
				} else {
					internshipType =
						application.offer?.offerOfferTypes?.[0]
							?.offerType?.name || 'No inscrito';
					internshipStatus = 'No aprobada';
				}
			}

			const studentDetails = await studentRepo.findOneBy({
				id: user.id,
			});

			return {
				...user,
				internshipType,
				internshipStatus,
				currentInternship:
					studentDetails?.currentInternship ||
					StudentInternship.practica1,
			};
		}),
	);

	return [
		studentsWithInternshipInfo as TStudentWhithInternshipInfo[],
		total,
	];
}

export async function findOne(id: string) {
	try {
		const row = await userRepo.findOneBy({
			id,
			user_role: 'student',
		});

		return row;
	} catch (error) {
		console.error(
			'Error al buscar el estudiante por ID:',
			error,
		);
	}

	return null;
}

export async function createStudent(
	studentData: Partial<
		TStudentUser & { currentInternship?: string }
	>,
) {
	try {
		const newUser = userRepo.create({
			...studentData,
			id: randomUUID(),
			user_role: 'student',
		});

		const savedUser = await userRepo.save(newUser);

		const newStudent = studentRepo.create({
			id: savedUser.id,
			currentInternship:
				(studentData.currentInternship as unknown as TStudentInternship) ||
				StudentInternship.practica1,
		});

		await studentRepo.save(newStudent);

		return { ...savedUser, ...newStudent };
	} catch (error) {
		console.error('Error al crear el estudiante:', error);
		return null;
	}
}

export async function updateStudent(
	id: string,
	studentData: Partial<
		TStudentUser & { currentInternship?: string }
	>,
) {
	try {
		const userToUpdate = await userRepo.findOneBy({
			id,
			user_role: 'student',
		});

		if (!userToUpdate) {
			console.error(
				'Estudiante no encontrado para actualizar',
			);
			return null;
		}

		userRepo.merge(userToUpdate, studentData);
		const savedUser = await userRepo.save(userToUpdate);

		if (studentData.currentInternship) {
			let studentEntity = await studentRepo.findOneBy({
				id,
			});

			if (!studentEntity) {
				studentEntity = studentRepo.create({ id });
			}

			studentEntity.currentInternship =
				studentData.currentInternship as unknown as TStudentInternship;
			await studentRepo.save(studentEntity);
		}

		return savedUser;
	} catch (error) {
		console.error(
			'Error al actualizar el estudiante:',
			error,
		);
		return null;
	}
}

export async function deleteStudent(id: string) {
	try {
		const deleteStudent = await userRepo.delete({
			id,
			user_role: 'student',
		});

		return (deleteStudent.affected ?? 0) > 0;
	} catch (error) {
		console.error(
			'Error al eliminar el estudiante:',
			error,
		);
		return false;
	}
}

export async function getStudentDetails(id: string) {
	try {
		const user = await userRepo.findOneBy({
			id,
			user_role: 'student',
		});
		if (!user) return null;

		const studentProfile = await studentRepo.findOneBy({
			id,
		});

		const applications = await applicationRepo.find({
			where: { student: { id } },
			relations: [
				'offer',
				'offer.offerOfferTypes',
				'offer.offerOfferTypes.offerType',
			],
			order: { created_at: 'DESC' },
		});

		const applicationsWithDetails = await Promise.all(
			applications.map(async (app) => {
				const internship = await internshipRepo.findOne({
					where: { application: { id: app.id } },
					relations: [
						'coordinator',
						'supervisor',
						'final_report',
					],
				});

				let evaluations = null;
				let logbookEntries = null;

				if (internship) {
					const evaluationRepo =
						AppDataSource.getRepository(
							'InternshipEvaluation',
						);
					evaluations = await evaluationRepo.findOne({
						where: { internship: { id: internship.id } },
					});

					const logbookRepo = AppDataSource.getRepository(
						'LogbookEntries',
					);
					logbookEntries = await logbookRepo.find({
						where: { internship: { id: internship.id } },
						order: { created_at: 'DESC' },
					});
				}

				return {
					...app,
					internship: internship
						? {
								...internship,
								evaluations,
								logbookEntries,
							}
						: null,
				};
			}),
		);

		return {
			user,
			student: studentProfile,
			applications: applicationsWithDetails,
		};
	} catch (error) {
		console.error(
			'Error al obtener detalles del estudiante:',
			error,
		);
		return null;
	}
}
