import { AppDataSource } from './src/config/db.config';
import { User } from './src/entities/user.entity';

async function run() {
	try {
		await AppDataSource.initialize();
		console.log('DB Connected');

		const user = await AppDataSource.getRepository(
			User,
		).findOneBy({ email: 'supervisor@prueba.cl' });
		if (user) {
			console.log('User found:', user.email);
			console.log('Role:', user.user_role);
		} else {
			console.log('User not found');
		}
	} catch (error) {
		console.error('Error:', error);
	} finally {
		await AppDataSource.destroy();
	}
}

run();
