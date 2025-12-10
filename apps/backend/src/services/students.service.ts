import { AppDataSource } from '@config/db.config';
import { User } from '@entities';

export type TStudentUser = User;

const userRepo = AppDataSource.getRepository(User);

export async function findMany(): Promise<TStudentUser[]> {
	const rows = await userRepo.find({
		where: { user_role: 'student' },
	});

	return rows;
}
