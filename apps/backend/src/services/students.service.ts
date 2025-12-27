import { AppDataSource } from '@config/db.config';
import { User } from '@entities';
import { randomUUID } from 'node:crypto';
import {
	Application,
	ApplicationStatus,
} from '@entities/application.entity';
import {
	Internship,
	InternshipStatus,
} from '@entities/internship.entity';

export type TStudentUser = User;

export type TStudentWhithInternshipInfo = TStudentUser & {
	internshipType: string;
	internshipStatus: string;
};

const userRepo = AppDataSource.getRepository(User);
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
		rows.map(async (student) => {
			const application = await applicationRepo.findOne({
				where: {
					student: { id: student.id },
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

			return {
				...student,
				internshipType,
				internshipStatus,
			};
		}),
	);

	return [studentsWithInternshipInfo, total];
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
	studentData: Partial<TStudentUser>,
) {
	try {
		const newStudent = userRepo.create({
			...studentData,
			id: randomUUID(),
			user_role: 'student',
		});

		const savedStudent = await userRepo.save(newStudent);
		return savedStudent;
	} catch (error) {
		console.error('Error al crear el estudiante:', error);
		return null;
	}
}

export async function updateStudent(
	id: string,
	studentData: Partial<TStudentUser>,
) {
	try {
		const studentToUpdate = await userRepo.findOneBy({
			id,
			user_role: 'student',
		});

		if (!studentToUpdate) {
			console.error(
				'Estudiante no encontrado para actualizar',
			);
			return null;
		}

		userRepo.merge(studentToUpdate, studentData);
		const updatedStudent =
			await userRepo.save(studentToUpdate);
		return updatedStudent;
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
