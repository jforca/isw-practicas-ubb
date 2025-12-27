import { AppDataSource } from '../../config/db.config';
import { InternshipCenter } from '@entities';

export async function seedInternshipCenters() {
	const repo = AppDataSource.getRepository(
		InternshipCenter,
	);
	const count = await repo.count();
	if (count > 0) {
		console.log(
			'Internship centers ya existen — saltando seed.',
		);
		return;
	}

	const centers: Partial<InternshipCenter>[] = [
		{
			legal_name: 'Centro PRACTICA Uno Ltda',
			company_rut: '76.123.456-7',
			email: 'contacto@practica1.cl',
			phone: '+56940000000',
			address: 'Calle Falsa 123',
			description: 'Centro de prácticas para estudiantes.',
		},
	];

	await repo.save(centers as InternshipCenter[]);
	console.log('Seed: internship centers creados.');
}
