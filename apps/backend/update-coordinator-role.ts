import { AppDataSource } from './src/config/db.config';
import { User } from './src/entities/user.entity';

async function run() {
	try {
		await AppDataSource.initialize();
		console.log('DB Connected');

		const repo = AppDataSource.getRepository(User);
		const coordinator = await repo.findOneBy({
			email: 'coordinador@prueba.cl',
		});

		if (coordinator) {
			console.log(
				'Found coordinator:',
				coordinator.email,
				'Current Role:',
				coordinator.user_role,
			);
			coordinator.user_role = 'coordinator';
			await repo.save(coordinator);
			console.log('Updated role to coordinator');
		} else {
			console.log('Coordinator not found');
		}
	} catch (error) {
		console.error('Error in update script:', error);
	} finally {
		await AppDataSource.destroy();
	}
}

run();
