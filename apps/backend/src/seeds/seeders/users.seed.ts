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
		// Usuario sistema (uploader de documentos)
		{
			id: randomUUID(),
			rut: '99.999.999-9',
			phone: '+56999999999',
			name: 'Sistema',
			email: 'system@example.com',
			emailVerified: true,
			image: undefined,
			user_role: 'coordinator',
		},
		// Estudiantes adicionales
		{
			id: randomUUID(),
			rut: '33.333.333-3',
			phone: '+56933333333',
			name: 'Estudiante Uno',
			email: 'student1@example.com',
			emailVerified: false,
			image: undefined,
			user_role: 'student',
		},
		{
			id: randomUUID(),
			rut: '44.444.444-4',
			phone: '+56944444444',
			name: 'Estudiante Dos',
			email: 'student2@example.com',
			emailVerified: false,
			image: undefined,
			user_role: 'student',
		},
		{
			id: randomUUID(),
			rut: '77.777.777-7',
			phone: '+56977777777',
			name: 'Estudiante Tres',
			email: 'student3@example.com',
			emailVerified: false,
			image: undefined,
			user_role: 'student',
		},
		{
			id: randomUUID(),
			rut: '88.888.888-8',
			phone: '+56988888888',
			name: 'Estudiante Cuatro',
			email: 'student4@example.com',
			emailVerified: false,
			image: undefined,
			user_role: 'student',
		},
		// Supervisores
		{
			id: randomUUID(),
			rut: '55.555.555-5',
			phone: '+56955555555',
			name: 'Supervisor Uno',
			email: 'supervisor1@example.com',
			emailVerified: false,
			image: undefined,
			user_role: 'supervisor',
		},
		{
			id: randomUUID(),
			rut: '66.666.666-6',
			phone: '+56966666666',
			name: 'Supervisor Dos',
			email: 'supervisor2@example.com',
			emailVerified: false,
			image: undefined,
			user_role: 'supervisor',
		},
	];

	await repo.save(users as User[]);
	console.log('Seed: usuarios iniciales creados.');
}
