import { AppDataSource } from '../config/db.config';
import { seedUsers } from './seeders/users.seed';
import { seedOffersTypes } from './seeders/offers-types.seed';
import { seedCoordinators } from './seeders/coordinators.seed';
import { seedInternshipCenters } from './seeders/internship-centers.seed';
import { seedOffers } from './seeders/offers.seed';
import { seedEvaluationItems } from './seeders/evaluation-items.seed';
import { seedInternshipEvaluations } from './seeders/internship-evaluations.seed';

async function run() {
	try {
		await AppDataSource.initialize();
		console.log('Conexión DB iniciada para seeds.');

		await seedUsers();
		await seedCoordinators();
		await seedInternshipCenters();
		await seedOffersTypes();
		await seedOffers();
		await seedEvaluationItems();
		await seedInternshipEvaluations();

		console.log('Seeds ejecutados correctamente.');
	} catch (error) {
		console.error('Error ejecutando seeds:', error);
		process.exit(1);
	} finally {
		await AppDataSource.destroy();
		console.log('Conexión DB cerrada.');
	}
}

run();
