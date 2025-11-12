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

async function findMany() {
	try {
		const interships = await internshipsCenter.find();

		return interships;
	} catch (error) {
		console.error(
			'Error finding internship centers:',
			error,
		);
	}
}

async function updateOne() {}

async function deleteOne() {}

async function deleteMany() {}

async function createOne() {}

export const InternshipCenterServices = {
	findOne,
	findMany,
	updateOne,
	deleteOne,
	deleteMany,
	createOne,
};
