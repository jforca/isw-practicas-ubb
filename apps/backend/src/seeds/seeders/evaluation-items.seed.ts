import { AppDataSource } from '../../config/db.config';
import { EvaluationItem } from '@entities';

export async function seedEvaluationItems() {
	const itemRepo =
		AppDataSource.getRepository(EvaluationItem);
	const count = await itemRepo.count();
	if (count > 0) {
		console.log(
			'EvaluationItems ya existen — saltando seed.',
		);
		return;
	}

	const supervisorItems: Partial<EvaluationItem>[] = [
		{
			evaluationType: 'SUPERVISOR',
			label: 'Puntualidad',
			section: 'Comportamiento',
			order: 1,
			isActive: true,
			weight: 1,
			maxScore: 1,
			optionsSchema: JSON.stringify({
				options: [
					{ key: 'SI', score: 1 },
					{ key: 'NO', score: 0 },
				],
			}),
		},
		{
			evaluationType: 'SUPERVISOR',
			label: 'Cumplimiento de tareas',
			section: 'Desempeño',
			order: 2,
			isActive: true,
			weight: 2,
			maxScore: 5,
			optionsSchema: null,
		},
	];

	const reportItems: Partial<EvaluationItem>[] = [
		{
			evaluationType: 'REPORT',
			label: 'Claridad del informe',
			section: 'Informe',
			order: 1,
			isActive: true,
			weight: 1,
			maxScore: 5,
			optionsSchema: null,
		},
		{
			evaluationType: 'REPORT',
			label: 'Evidencias adjuntas',
			section: 'Informe',
			order: 2,
			isActive: true,
			weight: 1,
			maxScore: 1,
			optionsSchema: JSON.stringify({
				options: [
					{ key: 'SI', score: 1 },
					{ key: 'NO', score: 0 },
				],
			}),
		},
	];

	await itemRepo.save([
		...supervisorItems,
		...reportItems,
	] as EvaluationItem[]);
	console.log('Seed: evaluation items creados.');
}
