import { AppDataSource } from './src/config/db.config';
import { User } from './src/entities/user.entity';

async function run() {
	try {
		await AppDataSource.initialize();
		console.log('DB Connected');

		const users =
			await AppDataSource.getRepository(User).find();
		console.log(
			'Users found:',
			users.map((u) => ({
				email: u.email,
				role: u.user_role,
			})),
		);
	} catch (error) {
		console.error('Error in debug script:', error);
	} finally {
		await AppDataSource.destroy();
	}
}

run();
