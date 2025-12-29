import { AppDataSource } from '../../config/db.config';
import { User, type TUserRole } from '@entities';
import { auth } from '@lib/auth';

export async function seedUsers() {
	const repo = AppDataSource.getRepository(User);

	// Lista de usuarios a crear
	const usersToSeed = [
		{
			name: 'Encargado de prácticas',
			email: 'encargado@prueba.cl',
			password: 'password123',
			rut: '10.000.000-1',
			phone: '+56900000001',
			user_role: 'coordinator',
		},
		{
			name: 'Coordinador Inicial',
			email: 'coordinator@example.com',
			password: 'password123',
			rut: '11.111.111-1',
			phone: '+56911111111',
			user_role: 'coordinator',
		},
		{
			name: 'Estudiante Inicial',
			email: 'student@example.com',
			password: 'password123',
			rut: '22.222.222-2',
			phone: '+56922222222',
			user_role: 'student',
		},
		{
			name: 'Sistema',
			email: 'system@example.com',
			password: 'password123',
			rut: '99.999.999-9',
			phone: '+56999999999',
			user_role: 'coordinator',
		},
		{
			name: 'Estudiante Uno',
			email: 'student1@example.com',
			password: 'password123',
			rut: '33.333.333-3',
			phone: '+56933333333',
			user_role: 'student',
		},
		{
			name: 'Estudiante Dos',
			email: 'student2@example.com',
			password: 'password123',
			rut: '44.444.444-4',
			phone: '+56944444444',
			user_role: 'student',
		},
		{
			name: 'Estudiante Tres',
			email: 'student3@example.com',
			password: 'password123',
			rut: '77.777.777-7',
			phone: '+56977777777',
			user_role: 'student',
		},
		{
			name: 'Estudiante Cuatro',
			email: 'student4@example.com',
			password: 'password123',
			rut: '88.888.888-8',
			phone: '+56988888888',
			user_role: 'student',
		},
		{
			name: 'Supervisor Uno',
			email: 'supervisor1@example.com',
			password: 'password123',
			rut: '55.555.555-5',
			phone: '+56955555555',
			user_role: 'supervisor',
		},
		{
			name: 'Supervisor Dos',
			email: 'supervisor2@example.com',
			password: 'password123',
			rut: '66.666.666-6',
			phone: '+56966666666',
			user_role: 'supervisor',
		},
	];

	console.log(
		'Iniciando seed de usuarios con Better Auth...',
	);

	for (const userData of usersToSeed) {
		// 1. Verificar si el usuario ya existe por email
		const existingUser = await repo.findOneBy({
			email: userData.email,
		});

		if (existingUser) {
			console.log(
				`Usuario ${userData.email} ya existe. Saltando creación.`,
			);
			// Opcional: Actualizar rol/rut si ya existe pero le falta info
			if (!existingUser.user_role || !existingUser.rut) {
				await repo.update(existingUser.id, {
					user_role: userData.user_role as TUserRole,
					rut: userData.rut,
					phone: userData.phone,
				});
				console.log(
					` -> Datos actualizados para ${userData.email}`,
				);
			}
			continue;
		}

		try {
			// 2. Crear usuario usando auth.api.signUpEmail
			// asResponse: false para obtener el objeto usuario directamente
			const authResponse = await auth.api.signUpEmail({
				body: {
					email: userData.email,
					password: userData.password,
					name: userData.name,
				},
				asResponse: false,
			});

			if (!authResponse?.user) {
				console.error(
					`Error al crear usuario ${userData.email}: No se retornó usuario.`,
				);
				continue;
			}

			const userId = authResponse.user.id;

			// 3. Actualizar campos adicionales (RUT, Teléfono, Rol)
			// Better Auth maneja name/email/password, pero los campos custom
			// deben actualizarse en la entidad User si no están en additionalFields mapeados al signup
			await repo.update(userId, {
				rut: userData.rut,
				phone: userData.phone,
				user_role: userData.user_role as TUserRole,
				emailVerified: true, // Auto-verificar para seeds
			});

			console.log(
				`Usuario creado: ${userData.name} (${userData.email}) - Rol: ${userData.user_role}`,
			);
		} catch (error) {
			console.error(
				`Error creando usuario ${userData.email}:`,
				error,
			);
		}
	}

	console.log('Seed de usuarios finalizado.');
}
