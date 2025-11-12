import { AppDataSource } from '@config/db.config';
import { InternshipCenter } from '@entities/internship-centers.entity';

const internshipsCenter = AppDataSource.getRepository(
	InternshipCenter,
);

export async function findOneService(id: number) {
	try {
		const interships = await internshipsCenter.findOneBy({
			id,
		});

		return interships;
	} catch (error) {
		console.error(
			'Error finding internship center:',
			error,
		);
	}
}

export async function findManyService() {}
