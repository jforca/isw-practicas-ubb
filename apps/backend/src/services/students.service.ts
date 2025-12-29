import { AppDataSource } from '@config/db.config';
import { User } from '@entities';
import { Student } from '@entities/students.entity';
import {
	Application,
	ApplicationStatus,
} from '@entities/application.entity';
import {
	Internship,
	InternshipStatus,
} from '@entities/internship.entity';
import { StudentInternship } from '@packages/schema/student.schema';
import { auth } from '@lib/auth';

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

				if (derivedStatuses.includes('Aceptada')) {
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
					const offerTypes =
						await application.offer?.offerOfferTypes;
					const firstOfferType = offerTypes?.[0];
					const typeDetails =
						await firstOfferType?.offerType;
					internshipType =
						typeDetails?.name || 'No inscrito';

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
						internshipStatus = 'Aceptada';
					}
				} else {
					const offerTypes =
						await application.offer?.offerOfferTypes;
					const firstOfferType = offerTypes?.[0];
					const typeDetails =
						await firstOfferType?.offerType;
					internshipType =
						typeDetails?.name || 'No inscrito';
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
		TStudentUser & {
			currentInternship?: string;
			password?: string;
		}
	>,
) {
	try {
		if (
			!studentData.email ||
			!studentData.password ||
			!studentData.name
		) {
			throw new Error(
				'Faltan datos obligatorios (email, password, name)',
			);
		}

		// Usar better-auth para crear el usuario y la cuenta con contraseña hasheada
		const user = await auth.api.signUpEmail({
			body: {
				email: studentData.email,
				password: studentData.password,
				name: studentData.name,
			},
			asResponse: false, // Importante para obtener el objeto usuario directamente
		});

		if (!user) {
			throw new Error(
				'Error al crear el usuario en el sistema de autenticación',
			);
		}

		// Actualizar campos adicionales del usuario que no vienen en signUpEmail por defecto si es necesario
		// Por ejemplo, el RUT y el rol. signUpEmail crea el usuario, pero quizás necesitamos actualizarlo.
		// Ojo: signUpEmail puede que no acepte campos custom en el body directamente dependiendo de la config.
		// Lo más seguro es actualizar el usuario recién creado con el RUT y el Rol correcto.

		const userId = user.user.id;

		await userRepo.update(userId, {
			rut: studentData.rut,
			phone: studentData.phone,
			user_role: 'student',
		});

		// Recuperar el usuario actualizado
		const savedUser = await userRepo.findOneBy({
			id: userId,
		});

		if (!savedUser) {
			throw new Error(
				'Error al recuperar el usuario creado',
			);
		}

		const newStudent = studentRepo.create({
			id: savedUser.id,
			currentInternship:
				(studentData.currentInternship as unknown as TStudentInternship) ||
				StudentInternship.practica1,
		});

		await studentRepo.save(newStudent);

		return { ...savedUser, ...newStudent };
	} catch (error: unknown) {
		// Manejo de errores de better-auth o DB
		if (error instanceof Error) {
			// Better auth puede lanzar APIError
			if (
				error.message.includes('already exists') ||
				error.message.includes('registered')
			) {
				throw new Error('El correo ya está registrado');
			}
		}

		const dbError = error as {
			code?: string;
			detail?: string;
			message?: string;
		};
		if (dbError.code === '23505') {
			if (dbError.detail?.includes('rut')) {
				throw new Error('El RUT ya está registrado');
			}
			if (dbError.detail?.includes('email')) {
				throw new Error('El correo ya está registrado');
			}
		}
		console.error('Error al crear el estudiante:', error);
		throw new Error(
			error instanceof Error
				? error.message
				: 'Error al crear el estudiante',
		);
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
	} catch (error: unknown) {
		const dbError = error as {
			code?: string;
			detail?: string;
			message?: string;
		};
		if (dbError.code === '23505') {
			if (dbError.detail?.includes('rut')) {
				throw new Error('El RUT ya está registrado');
			}
			if (dbError.detail?.includes('email')) {
				throw new Error('El correo ya está registrado');
			}
		}
		console.error(
			'Error al actualizar el estudiante:',
			error,
		);
		throw new Error('Error al actualizar el estudiante');
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
			student: studentProfile || {
				currentInternship: StudentInternship.practica1,
			},
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

export async function getDashboardStats() {
	try {
		const totalStudents = await userRepo.count({
			where: { user_role: 'student' },
		});

		const activeInternships = await internshipRepo.count({
			where: { status: InternshipStatus.InProgress },
		});

		const unapprovedInternships =
			await applicationRepo.count({
				where: [
					{ status: ApplicationStatus.Pending },
					{ status: ApplicationStatus.Rejected },
				],
			});

		const pendingEvaluation = await internshipRepo.count({
			where: {
				status: InternshipStatus.PendingEvaluation,
			},
		});

		return {
			totalStudents,
			activeInternships,
			unapprovedInternships,
			pendingEvaluation,
		};
	} catch (error) {
		console.error('Error getting dashboard stats:', error);
		return {
			totalStudents: 0,
			activeInternships: 0,
			unapprovedInternships: 0,
			pendingEvaluation: 0,
		};
	}
}
