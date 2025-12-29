import {
	useEffect,
	useId,
	useState,
	type FormEvent,
} from 'react';
import {
	LabelAtom,
	TextareaAtom,
	AfRadioGroup,
} from '../atoms';
import { type TEvalLetter } from '../../lib/grade-converter';
import { UseUpdateOneInternshipEvaluation } from '../../hooks/update-one-internship-evaluation.hook';
import { UseFindOneInternshipEvaluation } from '../../hooks/find-one-internship-evaluation.hook';
import { UseFindEvaluationResponses } from '../../hooks/find-evaluation-responses.hook';

interface IReportEvaluationFormProps {
	evaluationId?: number;
	onSuccess?: () => void;
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

const normalizeText = (value: string) =>
	value
		.toLowerCase()
		.replace(/^[a-z]{2}\d+-\d+:\s*/i, '')
		.replace(/[^a-z0-9áéíóúüñ\s]/gi, ' ')
		.replace(/\s+/g, ' ')
		.trim();

const getCompetencyBadgeColor = (code: string): string => {
	if (code.startsWith('CG')) return 'badge-info';
	return 'badge-neutral';
};

export function ReportEvaluationForm({
	evaluationId,
	onSuccess,
	onSubmit: _onSubmit,
}: IReportEvaluationFormProps) {
	const { handleUpdateOne, isLoading, error, isSuccess } =
		UseUpdateOneInternshipEvaluation();
	const { handleFindOne } =
		UseFindOneInternshipEvaluation();
	const { handleFindResponses } =
		UseFindEvaluationResponses();

	const [rubricMap, setRubricMap] = useState<
		Map<string, number>
	>(new Map());

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
	const [
		existingSupervisorGrade,
		setExistingSupervisorGrade,
	] = useState<number | null>(null);
	const [existingReportGrade, setExistingReportGrade] =
		useState<number | null>(null);
	const [localSuccess, setLocalSuccess] = useState(false);

	// biome-ignore lint(correctness/useExhaustiveDependencies): Las dependencias se controlan manualmente
	useEffect(() => {
		const load = async () => {
			if (!evaluationId) return;
			try {
				const rubricRes = await fetch(
					'/api/internship-evaluations/rubric/REPORT',
				);
				if (rubricRes.ok) {
					const rubricJson = await rubricRes.json();
					const list: Array<{
						id: number;
						label: string;
					}> = Array.isArray(rubricJson?.data)
						? rubricJson.data
						: [];
					const map = new Map<string, number>();
					for (const item of list) {
						if (!item?.label || !item?.id) continue;
						const normalized = normalizeText(item.label);
						if (!normalized) continue;
						map.set(normalized, Number(item.id));
					}
					if (map.size > 0) setRubricMap(map);
				}
			} catch (err) {
				console.error(
					'No se pudo cargar la pauta de informe',
					err,
				);
			}
			const ev = await handleFindOne(evaluationId);
			if (ev?.supervisorGrade != null) {
				const num = Number(ev.supervisorGrade);
				if (!Number.isNaN(num))
					setExistingSupervisorGrade(num);
			}
			if (ev?.reportGrade != null) {
				const num = Number(ev.reportGrade);
				if (!Number.isNaN(num)) setExistingReportGrade(num);
			}
			if (ev?.reportComments) {
				setReportComments(ev.reportComments);
			}

			const responses =
				await handleFindResponses(evaluationId);
			if (Array.isArray(responses) && responses.length) {
				const labelToId = new Map(
					COMPETENCIES.flatMap((c) =>
						c.aspects.map((a) => [
							normalizeText(a.text),
							a.id,
						]),
					),
				);
				setSelections((prev) => {
					const next = { ...prev };
					for (const res of responses) {
						if (res.item.evaluationType !== 'REPORT')
							continue;
						const key = labelToId.get(
							normalizeText(res.item.label),
						);
						if (!key) continue;
						const val = res.selectedValue?.toUpperCase();
						if (
							val === 'A' ||
							val === 'B' ||
							val === 'C' ||
							val === 'D' ||
							val === 'E' ||
							val === 'F'
						) {
							next[key] = val as TEvalLetter;
						}
					}
					return next;
				});
			}
		};
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [evaluationId]);

	const handleSelectionChange = (
		id: string,
		value: TEvalLetter | null,
	) => {
		setSelections((prev) => ({ ...prev, [id]: value }));
	};

	const handleSubmit = async (
		e: FormEvent<HTMLFormElement>,
	) => {
		e.preventDefault();
		setLocalSuccess(false);

		const answered = Object.values(selections).some(
			(v) => v !== null,
		);
		if (!answered) {
			window.alert(
				'Ingresa al menos una respuesta antes de guardar el informe.',
			);
			return;
		}

		if (!evaluationId) return;
		if (rubricMap.size === 0) {
			window.alert(
				'No se pudo cargar la pauta de informe. Intenta recargar.',
			);
			return;
		}

		const answers = COMPETENCIES.flatMap((comp) =>
			comp.aspects.map((asp) => {
				const itemId = rubricMap.get(
					normalizeText(asp.text),
				);
				const val = selections[asp.id];
				return typeof itemId === 'number' && val
					? {
							itemId,
							value: val,
						}
					: null;
			}),
		).filter(
			(a): a is { itemId: number; value: TEvalLetter } =>
				a !== null,
		);

		try {
			const submitRes = await fetch(
				`/api/internship-evaluations/submit/${evaluationId}/REPORT`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ answers }),
				},
			);
			if (!submitRes.ok) {
				const errJson = await submitRes.json();
				throw new Error(
					errJson?.error ||
						'No se pudieron guardar las respuestas del informe',
				);
			}
			const submitJson = await submitRes.json();
			const newGrade = submitJson?.data?.reportGrade;
			if (typeof newGrade === 'number') {
				setExistingReportGrade(Number(newGrade));
			}
		} catch (err) {
			const msg =
				err instanceof Error
					? err.message
					: 'Error al guardar las respuestas del informe';
			window.alert(msg);
			return;
		}

		// Guardar comentarios (la nota se actualiza en submit)
		const updateResult = await handleUpdateOne(
			evaluationId,
			{
				reportComments,
			},
		);
		if (updateResult === null) {
			window.alert(
				'No se pudieron guardar los comentarios del informe',
			);
			return;
		}
		setLocalSuccess(true);
		setTimeout(() => setLocalSuccess(false), 3500);
		onSuccess?.();
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
				{(existingSupervisorGrade != null ||
					existingReportGrade != null) && (
					<div className="alert alert-info mb-4 text-sm space-y-1">
						{existingSupervisorGrade != null && (
							<div>
								Nota previa del supervisor:{' '}
								{existingSupervisorGrade.toFixed(2)} / 7
							</div>
						)}
						{existingReportGrade != null && (
							<div>
								Nota previa del encargado:{' '}
								{existingReportGrade.toFixed(2)} / 7
							</div>
						)}
					</div>
				)}
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
					disabled={isLoading}
				>
					{isLoading
						? 'Guardando...'
						: 'Guardar evaluación'}
				</button>
			</div>

			{error && (
				<div className="alert alert-error">
					<span>{error}</span>
				</div>
			)}

			{(isSuccess || localSuccess) && (
				<div className="alert alert-success">
					<span>Evaluación guardada correctamente</span>
				</div>
			)}
		</form>
	);
}
