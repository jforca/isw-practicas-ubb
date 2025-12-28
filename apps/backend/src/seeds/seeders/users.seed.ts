import { randomUUID } from 'crypto';
import { AppDataSource } from '../../config/db.config';
import { User } from '@entities';

export async function seedUsers() {
	const repo = AppDataSource.getRepository(User);
	const count = await repo.count();
	if (count > 0) {
		console.log(
			'Usuarios ya existen — saltando seed de usuarios.',
		);
		return;
	}

	const users: Partial<User>[] = [
		{
			id: randomUUID(),
			rut: '11.111.111-1',
			phone: '+56911111111',
			name: 'Coordinador Inicial',
			email: 'coordinator@example.com',
			emailVerified: false,
			image: undefined,
			user_role: 'coordinator',
		},
		{
			id: randomUUID(),
			rut: '22.222.222-2',
			phone: '+56922222222',
			name: 'Estudiante Inicial',
			email: 'student@example.com',
			emailVerified: false,
			image: undefined,
			user_role: 'student',
		},
	];

	await repo.save(users as User[]);
	console.log('Seed: usuarios iniciales creados.');
}
