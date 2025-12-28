import { AppDataSource } from './src/config/db.config';
import { User } from './src/entities/user.entity';

async function testDB() {
	try {
		await AppDataSource.initialize();
		console.log('DB Initialized');
		const count =
			await AppDataSource.getRepository(User).count();
		console.log('User count:', count);
	} catch (error) {
		console.error('Error:', error);
	} finally {
		await AppDataSource.destroy();
	}
}

testDB();
