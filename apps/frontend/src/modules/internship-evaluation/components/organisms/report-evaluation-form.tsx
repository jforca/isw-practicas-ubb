import { useId, useState, type FormEvent } from 'react';
import {
	LabelAtom,
	TextareaAtom,
	AfRadioGroup,
} from '../atoms';

type TEvalLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

interface IReportEvaluationFormProps {
	onSubmit?: (data: {
		evaluations: {
			id: string;
			value: TEvalLetter | null;
		}[];
		reportComments: string;
	}) => void;
}

const COMPETENCIES: {
	code: string;
	description: string;
	aspects: { id: string; text: string }[];
}[] = [
	{
		code: 'CG1',
		description:
			'Manifiesta una actitud permanente de búsqueda y actualización de sus aprendizajes, incorporando los cambios sociales, científicos y tecnológicos en el ejercicio y desarrollo de su profesión.',
		aspects: [
			{
				id: 'CG1-1',
				text: 'Se evidencian los conocimientos y habilidades adquiridas por el estudiante, por la participación en el proyecto.',
			},
			{
				id: 'CG1-2',
				text: 'Se evidencia la realización de una adecuada revisión bibliográfica, la que se ajusta al formato exigido.',
			},
			{
				id: 'CG1-3',
				text: 'Se evidencia la aplicación de conocimientos por parte del estudiante, en el proyecto en el cual participó durante su práctica',
			},
			{
				id: 'CG1-4',
				text: 'Se evidencia el conocimiento de alternativas tecnológicas para resolver un problema planteado',
			},
			{
				id: 'CG1-5',
				text: 'Propone soluciones que consideran aspectos de impacto social',
			},
		],
	},
	{
		code: 'CG3',
		description:
			'Establecer relaciones dialogantes para el intercambio de aportes constructivos con otras disciplinas y actúa éticamente en su profesión, trabajando de manera asociativa en la consecución de objetivos.',
		aspects: [
			{
				id: 'CG3-1',
				text: 'Se presentan evidencias de trabajo colaborativo con personas de otras disciplinas o profesiones y trabaja con ellos de manera asociativa y ética para la consecución de objetivos comunes',
			},
		],
	},
	{
		code: 'CG5',
		description:
			'Comunicar ideas y sentimientos en forma oral y escrita para interactuar efectivamente en el entorno social y profesional en su lengua materna y en un nivel inicial en un segundo idioma.',
		aspects: [
			{
				id: 'CG5-1',
				text: 'Las conclusiones reflejan la importancia de los resultados obtenidos, la postura personal frente al tema contiene opiniones personales en relación a lo aprendido.',
			},
			{
				id: 'CG5-2',
				text: 'En el informe se destacan los aspectos importantes y se describen claramente las actividades desarrolladas por el estudiante, en el proyecto en el cual participó durante su práctica.',
			},
			{
				id: 'CG5-3',
				text: 'El informe se ajusta al formato y estructura exigido para la Práctica profesional II.',
			},
			{
				id: 'CG5-4',
				text: 'Las ideas del informe están claramente redactadas con buena ortografía, permitiendo comprender las actividades desarrolladas y los problemas resueltos.',
			},
			{
				id: 'CG5-5',
				text: 'El informe contiene la bitácora que considera el detalle de las actividades desarrolladas diariamente.',
			},
			{
				id: 'CG5-6',
				text: 'El informe refleja la utilización de nivel básico del idioma inglés, durante la práctica.',
			},
		],
	},
];

const getCompetencyBadgeColor = (code: string): string => {
	if (code.startsWith('CG')) return 'badge-info';
	return 'badge-neutral';
};

export function ReportEvaluationForm({
	onSubmit,
}: IReportEvaluationFormProps) {
	const formId = useId();
	const commentsId = useId();

	const [selections, setSelections] = useState<
		Record<string, TEvalLetter | null>
	>(() =>
		Object.fromEntries(
			COMPETENCIES.flatMap((competency) =>
				competency.aspects.map((aspect) => [
					aspect.id,
					null,
				]),
			),
		),
	);
	const [reportComments, setReportComments] = useState('');

	const handleSelectionChange = (
		id: string,
		value: TEvalLetter | null,
	) => {
		setSelections((prev) => ({ ...prev, [id]: value }));
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const evaluations = Object.entries(selections).map(
			([id, value]) => ({
				id,
				value,
			}),
		);

		onSubmit?.({
			evaluations,
			reportComments,
		});
	};

	return (
		<form
			id={formId}
			onSubmit={handleSubmit}
			className="w-full space-y-6"
		>
			<div className="bg-base-100 rounded-box p-6 shadow">
				<h3 className="text-2xl font-semibold mb-4">
					Aspectos a evaluar{' '}
					<span className="text-base-content/60">
						(Informe)
					</span>
				</h3>
				<div className="bg-info/10 border-l-4 border-info p-4 rounded-r-lg mb-6">
					<p className="text-sm text-base-content/80">
						<span className="font-semibold">
							Instrucciones:
						</span>{' '}
						En el espacio de evaluación marque con una "X"
						la letra que corresponda a lo observado.
					</p>
					<div className="flex flex-wrap gap-3 mt-2 text-xs">
						<span className="badge badge-lg badge-outline">
							<span className="font-bold mr-1">A</span>{' '}
							Sobresaliente
						</span>
						<span className="badge badge-lg badge-outline">
							<span className="font-bold mr-1">B</span>{' '}
							Bueno
						</span>
						<span className="badge badge-lg badge-outline">
							<span className="font-bold mr-1">C</span>{' '}
							Moderado
						</span>
						<span className="badge badge-lg badge-outline">
							<span className="font-bold mr-1">D</span>{' '}
							Suficiente
						</span>
						<span className="badge badge-lg badge-outline">
							<span className="font-bold mr-1">E</span>{' '}
							Insuficiente
						</span>
						<span className="badge badge-lg badge-outline">
							<span className="font-bold mr-1">F</span> No
							aplica
						</span>
					</div>
				</div>

				<div className="space-y-4">
					{COMPETENCIES.map((competency) => (
						<div
							key={competency.code}
							className="bg-base-200/50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
						>
							<div className="flex items-start gap-4 mb-4">
								<span
									className={`badge ${getCompetencyBadgeColor(competency.code)} badge-lg font-semibold`}
								>
									{competency.code}
								</span>
								<p className="text-sm text-base-content/80 flex-1">
									{competency.description}
								</p>
							</div>

							<div className="divider my-3"></div>

							<div className="space-y-4">
								{competency.aspects.map((aspect) => (
									<div
										key={aspect.id}
										className="bg-base-100 rounded-lg p-4 flex items-center gap-4 hover:bg-base-100/80 transition-colors"
									>
										<div className="flex-1">
											<p className="text-sm">
												{aspect.text}
											</p>
										</div>
										<div className="shrink-0">
											<AfRadioGroup
												name={`report-${aspect.id}`}
												value={selections[aspect.id]}
												onChange={(value) =>
													handleSelectionChange(
														aspect.id,
														value,
													)
												}
												size="sm"
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="bg-base-100 rounded-box p-6 shadow">
				<div className="form-control w-full">
					<LabelAtom htmlFor={commentsId}>
						<span className="text-lg font-semibold">
							V.- Observaciones del informe
						</span>
					</LabelAtom>
					<div className="mt-3">
						<TextareaAtom
							id={commentsId}
							value={reportComments}
							onChange={(e) =>
								setReportComments(e.target.value)
							}
							placeholder="Ingrese sus observaciones sobre el informe..."
						/>
					</div>
				</div>
			</div>

			<div className="flex justify-end bg-base-100 rounded-box p-4 shadow">
				<button
					type="submit"
					className="btn btn-primary btn-lg"
				>
					Guardar evaluación
				</button>
			</div>
		</form>
	);
}
