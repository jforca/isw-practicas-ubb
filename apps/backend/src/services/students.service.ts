import { AppDataSource } from '@config/db.config';
import { User } from '@entities';

export type TStudentUser = User;

const userRepo = AppDataSource.getRepository(User);

export async function findMany() {
	const rows = await userRepo.find({
		where: { user_role: 'student' },
	});

	return rows;
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
	}
}
