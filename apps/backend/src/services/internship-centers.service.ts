import { AppDataSource } from '@config/db.config';
import { InternshipCenter } from '@entities/internship-centers.entity';

const internshipsCenter = AppDataSource.getRepository(
	InternshipCenter,
);

async function findOne(id: number) {
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

async function findMany() {}

export const InternshipCenterServices = {
	findOne,
	findMany,
};
