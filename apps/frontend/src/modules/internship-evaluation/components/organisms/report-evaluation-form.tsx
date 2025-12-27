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
	if (code === 'CG1') return 'badge-warning';
	if (code === 'CG3') return 'badge-info';
	if (code === 'CG5') return 'badge-success';
	return 'badge-neutral';
};

export function ReportEvaluationForm({
	onSubmit,
}: IReportEvaluationFormProps) {
	const formId = useId();
	const commentsId = useId();

	const [selections, setSelections] = useState<
		Record<string, TEvalLetter | null>
	>({});
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
			className="space-y-6"
		>
			{/* Competencias */}
			<div className="space-y-6">
				{COMPETENCIES.map((competency) => (
					<div
						key={competency.code}
						className="card bg-base-200/50 shadow-md hover:shadow-lg transition-shadow duration-200"
					>
						<div className="card-body">
							{/* Header */}
							<div className="flex items-start gap-3">
								<span
									className={`badge ${getCompetencyBadgeColor(competency.code)} badge-lg font-semibold shrink-0`}
								>
									{competency.code}
								</span>
								<p className="text-sm opacity-80">
									{competency.description}
								</p>
							</div>

							{/* Aspectos */}
							<div className="mt-4 space-y-3">
								{competency.aspects.map((aspect) => (
									<div
										key={aspect.id}
										className="bg-base-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
									>
										<div className="flex flex-col gap-3">
											{/* Texto del aspecto */}
											<p className="text-sm font-medium">
												{aspect.text}
											</p>

											{/* Radio buttons */}
											<AfRadioGroup
												name={aspect.id}
												value={
													selections[aspect.id] || null
												}
												onChange={(value) =>
													handleSelectionChange(
														aspect.id,
														value,
													)
												}
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Observaciones */}
			<div className="card bg-base-200/50 shadow-md">
				<div className="card-body">
					<LabelAtom htmlFor={commentsId}>
						Observaciones del Reporte
					</LabelAtom>
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

			{/* Submit Button */}
			<div className="flex justify-end">
				<button
					type="submit"
					className="btn btn-primary btn-wide"
				>
					Enviar Evaluación
				</button>
			</div>
		</form>
	);
}
