import { AppDataSource } from './src/config/db.config';
import { User } from './src/entities/user.entity';

async function run() {
	try {
		await AppDataSource.initialize();
		console.log('DB Connected');

		const repo = AppDataSource.getRepository(User);
		const supervisor = await repo.findOneBy({
			email: 'supervisor@prueba.cl',
		});

		if (supervisor) {
			console.log(
				'Found supervisor:',
				supervisor.email,
				'Current Role:',
				supervisor.user_role,
			);
			supervisor.user_role = 'supervisor';
			await repo.save(supervisor);
			console.log('Updated role to supervisor');
		} else {
			console.log('Supervisor not found');
		}
	} catch (error) {
		console.error('Error in update script:', error);
	} finally {
		await AppDataSource.destroy();
	}
}

run();
