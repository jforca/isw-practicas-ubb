import { AppDataSource } from '../../config/db.config';
import {
	Supervisor,
	User,
	InternshipCenter,
} from '@entities';

export async function seedSupervisors() {
	const repo = AppDataSource.getRepository(Supervisor);
	const userRepo = AppDataSource.getRepository(User);
	const centerRepo = AppDataSource.getRepository(
		InternshipCenter,
	);

	const count = await repo.count();
	if (count > 0) {
		console.log('Supervisores ya existen — saltando seed.');
		return;
	}

	const users = await userRepo.find({
		where: { user_role: 'supervisor' },
	});
	const centers = await centerRepo.find();

	if (!users.length || !centers.length) {
		console.log(
			'Faltan usuarios supervisor o centros para crear supervisores.',
		);
		return;
	}

	const rows: Partial<Supervisor>[] = users.map((u, i) => ({
		userId: u.id,
		position: 'Supervisor de Prácticas',
		internshipCenter: centers[i % centers.length],
	}));

	await repo.save(rows as Supervisor[]);
	console.log(
		'Seed: supervisors creados a partir de users.',
	);
}
