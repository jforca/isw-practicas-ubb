import { AppDataSource } from '../../config/db.config';
import { Coordinator, User } from '@entities';

export async function seedCoordinators() {
	const coordRepo =
		AppDataSource.getRepository(Coordinator);
	const userRepo = AppDataSource.getRepository(User);

	const existing = await coordRepo.count();
	if (existing > 0) {
		console.log(
			'Coordinadores ya existen — saltando seed.',
		);
		return;
	}

	const users = await userRepo.find({
		where: { user_role: 'coordinator' },
	});
	if (!users.length) {
		console.log(
			'No hay usuarios con rol coordinator — crea usuarios primero.',
		);
		return;
	}

	const coords: Partial<Coordinator>[] = users.map((u) => ({
		id: u.id,
	}));
	await coordRepo.save(coords as Coordinator[]);
	console.log(
		'Seed: coordinadores creados a partir de users.',
	);
}
