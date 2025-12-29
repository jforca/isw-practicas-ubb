import { AppDataSource } from '@config/db.config';
import {
	User,
	Supervisor,
	InternshipCenter,
} from '@entities';
import { auth } from '@lib/auth';

async function run() {
	try {
		await AppDataSource.initialize();
		console.log('DB Connected');

		const email = 'supervisor@prueba.cl';
		const password = 'password123';
		const name = 'Supervisor Pruebas';
		const rut = '55.555.555-5';

		// 1. Crear Usuario con Better Auth
		console.log('Creating user...');
		let user = await auth.api.signUpEmail({
			body: { email, password, name },
			asResponse: false,
		});

		if (!user) {
			console.log(
				'User might already exist, trying to find...',
			);
			const existingUser =
				await AppDataSource.getRepository(User).findOneBy({
					email,
				});
			if (!existingUser) {
				throw new Error('Could not create or find user');
			}
			// biome-ignore lint/suspicious/noExplicitAny: Session type is complex to import here
			user = { user: existingUser, session: null as any };
		}

		const userId = user.user.id;
		console.log('User ID:', userId);

		// 2. Actualizar Rol y RUT
		await AppDataSource.getRepository(User).update(userId, {
			user_role: 'supervisor',
			rut: rut,
			phone: '+56955555555',
		});
		console.log('User role updated to supervisor');

		// 3. Buscar un Centro de Práctica
		const center = await AppDataSource.getRepository(
			InternshipCenter,
		).findOne({ where: {} });
		if (!center) {
			throw new Error(
				'No internship centers found. Please seed centers first.',
			);
		}
		console.log('Assigning to center:', center.name);

		// 4. Crear Entidad Supervisor
		const supervisorRepo =
			AppDataSource.getRepository(Supervisor);
		const existingSupervisor =
			await supervisorRepo.findOneBy({ userId });

		if (!existingSupervisor) {
			const newSupervisor = supervisorRepo.create({
				userId: userId,
				position: 'Supervisor General',
				internshipCenter: center,
			});
			await supervisorRepo.save(newSupervisor);
			console.log('Supervisor entity created successfully');
		} else {
			console.log('Supervisor entity already exists');
		}

		console.log('Done! Login with:', email, password);
	} catch (error) {
		console.error('Error:', error);
	} finally {
		await AppDataSource.destroy();
	}
}

run();
