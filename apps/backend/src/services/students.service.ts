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

export async function findMany(
	page: number,
	limit: number,
	search?: string,
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
				relations: ['offer', 'offer.offerType'],
				order: { created_at: 'DESC' },
			});

			let internshipType = 'No inscrito';
			let internshipStatus = 'No aprobada';

			if (application) {
				if (
					application.status === ApplicationStatus.Approved
				) {
					internshipType =
						application.offer?.offerType.name ||
						'No inscrito';

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
						internshipStatus = 'Aprobada'; // Preguntar a mis compañeros si esta bien ¡No te olvides Diego! XD
					}
				} else {
					internshipType =
						application.offer?.offerType?.name ||
						'No inscrito';
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
				(studentData.currentInternship as TStudentInternship) ||
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
				studentData.currentInternship as TStudentInternship;
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
		// 1. Obtener datos básicos del estudiante (User + Student)
		const user = await userRepo.findOneBy({
			id,
			user_role: 'student',
		});
		if (!user) return null;

		const studentProfile = await studentRepo.findOneBy({
			id,
		});

		// 2. Obtener Postulaciones (Applications)
		const applications = await applicationRepo.find({
			where: { student: { id } },
			relations: ['offer', 'offer.offerType'],
			order: { created_at: 'DESC' },
		});

		// 3. Enriquecer cada postulación con datos de la práctica (si existe)
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
					// Obtener Evaluaciones
					const evaluationRepo =
						AppDataSource.getRepository(
							'InternshipEvaluation',
						);
					evaluations = await evaluationRepo.findOne({
						where: { internship: { id: internship.id } },
					});

					// Obtener Bitácora
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
