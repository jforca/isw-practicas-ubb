import { AppDataSource } from './src/config/db.config';
import { createStudent } from './src/services/students.service';

async function run() {
	try {
		await AppDataSource.initialize();
		console.log('DB Connected');

		const testStudent = {
			name: 'Test Debug Student',
			email: `debug_${Date.now()}@test.com`,
			rut: `99.999.999-${Math.floor(Math.random() * 9)}`,
			phone: '+56912345678',
			currentInternship: 'Práctica 1',
			password: 'password123',
		};

		console.log(
			'Attempting to create student:',
			testStudent,
		);
		const result = await createStudent(testStudent);
		console.log('Student created successfully:', result);
	} catch (error) {
		console.error('Error in debug script:', error);
	} finally {
		await AppDataSource.destroy();
	}
}

run();
