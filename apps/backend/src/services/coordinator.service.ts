import { AppDataSource } from '@config/db.config';
import { User } from '@entities';

export type TCoordinator = User;

const coordinatorRepo = AppDataSource.getRepository(User);

export async function findMany(): Promise<TCoordinator[]> {
	const rows = await coordinatorRepo.find({
		where: { user_role: 'coordinator' },
	});

	return rows;
}
