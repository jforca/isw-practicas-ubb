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
		// CG1
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CG1-1: Es capaz de buscar información de manera autónoma.',
			section: 'CG1',
			order: 1,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CG1-2: Incorpora tendencias sociales, tecnológicas, científicas en su trabajo.',
			section: 'CG1',
			order: 2,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		// CG2
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CG2-1: Llega en el horario indicado a los compromisos adquiridos.',
			section: 'CG2',
			order: 3,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CG2-2: Realiza efectivamente las actividades o tareas que le son encomendadas.',
			section: 'CG2',
			order: 4,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CG2-3: Acepta o asume en forma positiva las diversas instrucciones, hechos y órdenes impartidas por su supervisor.',
			section: 'CG2',
			order: 5,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		// CG3
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CG3-1: Se relaciona adecuadamente con el personal del Centro de Práctica.',
			section: 'CG3',
			order: 6,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CG3-2: Trabaja colaborativamente en equipos multidisciplinarios.',
			section: 'CG3',
			order: 7,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CG3-3: Durante el trabajo con los demás mantiene un comportamiento ético.',
			section: 'CG3',
			order: 8,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		// CG5
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CG5-1: Comunica ideas y sentimientos en forma oral y escrita en su lengua materna.',
			section: 'CG5',
			order: 9,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CG5-2: Comunica ideas y sentimientos en forma oral y escrita en un segundo idioma.',
			section: 'CG5',
			order: 10,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		// CE1
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CE1-1: Realiza soporte de servidores y/o herramientas de software avanzado.',
			section: 'CE1',
			order: 11,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CE1-2: Instala y/o configura software para servidores.',
			section: 'CE1',
			order: 12,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CE1-3: Colabora en el diseño e implementación de redes de computadores.',
			section: 'CE1',
			order: 13,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CE1-4: Realiza evaluación de hardware y/o software.',
			section: 'CE1',
			order: 14,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CE1-5: Colabora en la evaluación del funcionamiento de redes de computadores.',
			section: 'CE1',
			order: 15,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		// CE2
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CE2-1: Diseña procesos de documentación: software, procesos de la información, procesos de negocios tanto a nivel de usuario como de desarrollador.',
			section: 'CE2',
			order: 16,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CE2-2: Propone y/o aplica métodos de detección y documentación de errores ocurridos durante el desarrollo, puesta en marcha o uso de aplicaciones.',
			section: 'CE2',
			order: 17,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CE2-3: Diseña y/o implementa módulos de software acotados que utilicen tecnologías avanzadas.',
			section: 'CE2',
			order: 18,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CE2-4: Colabora en el diseño de procesos de negocios.',
			section: 'CE2',
			order: 19,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		// CE3
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CE3-1: Participa del diseño y el levantamiento de requisitos para implementar bases de datos.',
			section: 'CE3',
			order: 20,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CE3-2: Demuestra conocimientos técnicos de algún sistema administrador de bases de datos.',
			section: 'CE3',
			order: 21,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CE3-3: Domina técnicas que aportan en el modelado de datos y procesos de negocios.',
			section: 'CE3',
			order: 22,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		// CE4
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CE4-1: Colabora en el diseño de un plan informático.',
			section: 'CE4',
			order: 23,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CE4-2: Colabora en el diseño e implementación de procesos de auditoría informática.',
			section: 'CE4',
			order: 24,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		// CE5
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CE5-1: Demuestra capacidad de autogestión para investigar tecnologías emergentes.',
			section: 'CE5',
			order: 25,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CE5-2: Aplica sus conocimientos teóricos para resolver problemas complejos en ámbitos del Ingeniero Civil Informático.',
			section: 'CE5',
			order: 26,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'SUPERVISOR',
			label:
				'CE5-3: Demuestra capacidad analítica y de abstracción al enfrentar problemas.',
			section: 'CE5',
			order: 27,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
	];

	const reportItems: Partial<EvaluationItem>[] = [
		{
			evaluationType: 'REPORT',
			label:
				'CG1-1: Se evidencian los conocimientos y habilidades adquiridas por el estudiante, por la participación en el proyecto.',
			section: 'CG1',
			order: 1,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'REPORT',
			label:
				'CG1-2: Se evidencia la realización de una adecuada revisión bibliográfica, la que se ajusta al formato exigido.',
			section: 'CG1',
			order: 2,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'REPORT',
			label:
				'CG1-3: Se evidencia la aplicación de conocimientos por parte del estudiante, en el proyecto en el cual participó durante su práctica.',
			section: 'CG1',
			order: 3,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'REPORT',
			label:
				'CG1-4: Se evidencia el conocimiento de alternativas tecnológicas para resolver un problema planteado.',
			section: 'CG1',
			order: 4,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'REPORT',
			label:
				'CG1-5: Propone soluciones que consideran aspectos de impacto social.',
			section: 'CG1',
			order: 5,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'REPORT',
			label:
				'CG3-1: Se presentan evidencias de trabajo colaborativo con personas de otras disciplinas o profesiones y trabaja con ellos de manera asociativa y ética para la consecución de objetivos comunes.',
			section: 'CG3',
			order: 6,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'REPORT',
			label:
				'CG5-1: Las conclusiones reflejan la importancia de los resultados obtenidos, la postura personal frente al tema contiene opiniones personales en relación a lo aprendido.',
			section: 'CG5',
			order: 7,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'REPORT',
			label:
				'CG5-2: En el informe se destacan los aspectos importantes y se describen claramente las actividades desarrolladas por el estudiante, en el proyecto en el cual participó durante su práctica.',
			section: 'CG5',
			order: 8,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'REPORT',
			label:
				'CG5-3: El informe se ajusta al formato y estructura exigido para la Práctica profesional II.',
			section: 'CG5',
			order: 9,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'REPORT',
			label:
				'CG5-4: Las ideas del informe están claramente redactadas con buena ortografía, permitiendo comprender las actividades desarrolladas y los problemas resueltos.',
			section: 'CG5',
			order: 10,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'REPORT',
			label:
				'CG5-5: El informe contiene la bitácora que considera el detalle de las actividades desarrolladas diariamente.',
			section: 'CG5',
			order: 11,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
		{
			evaluationType: 'REPORT',
			label:
				'CG5-6: El informe refleja la utilización de nivel básico del idioma inglés, durante la práctica.',
			section: 'CG5',
			order: 12,
			isActive: true,
			weight: 1,
			maxScore: 7,
			optionsSchema: null,
		},
	];

	await itemRepo.save([
		...supervisorItems,
		...reportItems,
	] as EvaluationItem[]);
	console.log('Seed: evaluation items creados.');
}
