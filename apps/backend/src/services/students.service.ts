import { AppDataSource } from '@config/db.config';
import { User } from '@entities';

export type TStudentUser = Omit<User, 'image'>;

const userRepo = AppDataSource.getRepository(User);

// Lista simple: solo usuarios con rol 'student' que existen en la tabla students
export async function findAll(): Promise<TStudentUser[]> {
	const rows = await userRepo.find({
		where: { user_role: 'student' },
	});

	return rows as TStudentUser[];
}

export const studentsService = { findAll };
