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

interface ISupervisorEvaluationFormProps {
	evaluationId?: number;
	onSuccess?: () => void;
	onSubmit?: (data: {
		evaluations: {
			id: string;
			value: TEvalLetter | null;
		}[];
		observations: string;
	}) => void;
}

const COMPETENCIES: {
	code: string;
	description: string;
	attitudes: { id: string; text: string }[];
}[] = [
	{
		code: 'CG1',
		description:
			'Manifiesta una actitud permanente de búsqueda y actualización de sus aprendizajes, incorporando los cambios sociales, científicos y tecnológicos en el ejercicio y desarrollo de su profesión.',
		attitudes: [
			{
				id: 'CG1-1',
				text: 'Es capaz de buscar información de manera autónoma.',
			},
			{
				id: 'CG1-2',
				text: 'Incorpora tendencias sociales, tecnológicas, científicas en su trabajo',
			},
		],
	},
	{
		code: 'CG2',
		description:
			'Asume un rol activo como ciudadano y profesional, comprometiéndose de manera responsable con su medio social, natural y cultural.',
		attitudes: [
			{
				id: 'CG2-1',
				text: 'Llega en el horario indicado a los compromisos adquiridos',
			},
			{
				id: 'CG2-2',
				text: 'Realiza efectivamente las actividades o tareas que le son encomendadas.',
			},
			{
				id: 'CG2-3',
				text: 'Acepta o asume en forma positiva las diversas instrucciones, hechos y órdenes impartidas por su supervisor.',
			},
		],
	},
	{
		code: 'CG3',
		description:
			'Establece relaciones dialogantes para el intercambio de aportes constructivos con otras disciplinas y actúa éticamente en su profesión, trabajando de manera asociativa en la consecución de objetivos.',
		attitudes: [
			{
				id: 'CG3-1',
				text: 'Se relaciona adecuadamente con el personal del Centro de Práctica',
			},
			{
				id: 'CG3-2',
				text: 'Trabaja colaborativamente en equipos multidisciplinarios',
			},
			{
				id: 'CG3-3',
				text: 'Durante el trabajo con los demás mantiene un comportamiento ético.',
			},
		],
	},
	{
		code: 'CG5',
		description:
			'Comunica ideas y sentimientos en forma oral y escrita para interactuar efectivamente en el entorno social y profesional en su lengua materna y en un nivel inicial en un segundo idioma.',
		attitudes: [
			{
				id: 'CG5-1',
				text: 'Comunica ideas y sentimientos en forma oral y escrita en su lengua materna.',
			},
			{
				id: 'CG5-2',
				text: 'Comunica ideas y sentimientos en forma oral y escrita en un segundo idioma.',
			},
		],
	},
	{
		code: 'CE1',
		description:
			'Gestiona sistemas computacionales para responder de forma óptima a los requerimientos de los usuarios evaluando su desempeño en base a los recursos disponibles.',
		attitudes: [
			{
				id: 'CE1-1',
				text: 'Realiza soporte de servidores y/o herramientas de software avanzado.',
			},
			{
				id: 'CE1-2',
				text: 'Instala y/o configura software para servidores.',
			},
			{
				id: 'CE1-3',
				text: 'Colabora en el diseño e implementación de redes de computadores.',
			},
			{
				id: 'CE1-4',
				text: 'Realiza evaluación de hardware y/o software.',
			},
			{
				id: 'CE1-5',
				text: 'Colabora en la evaluación del funcionamiento de redes de computadores.',
			},
		],
	},
	{
		code: 'CE2',
		description:
			'Desarrolla software efectivo y eficiente, para diversos dominios, siguiendo un enfoque de ingeniería.',
		attitudes: [
			{
				id: 'CE2-1',
				text: 'Diseña procesos de documentación: software, procesos de la información, procesos de negocios tanto a nivel de usuario como de desarrollador.',
			},
			{
				id: 'CE2-2',
				text: 'Propone y/o aplica métodos de detección y documentación de errores ocurridos durante el desarrollo, puesta en marcha o uso de aplicaciones.',
			},
			{
				id: 'CE2-3',
				text: 'Diseña y/o implementa módulos de software acotados que utilicen tecnologías avanzadas.',
			},
			{
				id: 'CE2-4',
				text: 'Colabora en el diseño de procesos de negocios.',
			},
		],
	},
	{
		code: 'CE3',
		description:
			'Construye bases de datos que permitan satisfacer las necesidades de información de las organizaciones o individuos, mediante el uso de diversas técnicas de modelado.',
		attitudes: [
			{
				id: 'CE3-1',
				text: 'Participa del diseño y el levantamiento de requisitos para implementar bases de datos.',
			},
			{
				id: 'CE3-2',
				text: 'Demuestra conocimientos técnicos de algún sistema administrador de bases de datos.',
			},
			{
				id: 'CE3-3',
				text: 'Domina técnicas que aportan en el modelado de datos y procesos de negocios.',
			},
		],
	},
	{
		code: 'CE4',
		description:
			'Gestiona los recursos informáticos, de manera de apoyar y dar soporte a los procesos y estrategias de negocio de las organizaciones que permitan el mejoramiento continuo de las mismas.',
		attitudes: [
			{
				id: 'CE4-1',
				text: 'Colabora en el diseño de un plan informático.',
			},
			{
				id: 'CE4-2',
				text: 'Colabora en el diseño e implementación de procesos de auditoría informática.',
			},
		],
	},
	{
		code: 'CE5',
		description:
			'Aplica conocimientos de las ciencias básicas y de la ingeniería para resolver problemas usando pensamiento lógico racional y capacidades analíticas y de abstracción.',
		attitudes: [
			{
				id: 'CE5-1',
				text: 'Demuestra capacidad de autogestión para investigar tecnologías emergentes.',
			},
			{
				id: 'CE5-2',
				text: 'Aplica sus conocimientos teóricos para resolver problemas complejos en ámbitos del Ingeniero Civil Informático.',
			},
			{
				id: 'CE5-3',
				text: 'Demuestra capacidad analítica y de abstracción al enfrentar problemas.',
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

export function SupervisorEvaluationForm({
	evaluationId,
	onSuccess,
	onSubmit: _onSubmit,
}: ISupervisorEvaluationFormProps) {
	const { handleUpdateOne, isLoading, error, isSuccess } =
		UseUpdateOneInternshipEvaluation();
	const { handleFindOne } =
		UseFindOneInternshipEvaluation();
	const { handleFindResponses } =
		UseFindEvaluationResponses();

	const [rubricMap, setRubricMap] = useState<
		Map<string, number>
	>(new Map());

	const id = useId();
	const [observations, setObservations] = useState('');
	const [selections, setSelections] = useState<
		Record<string, TEvalLetter | null>
	>(() =>
		Object.fromEntries(
			COMPETENCIES.flatMap((c) =>
				c.attitudes.map((a) => [a.id, null]),
			),
		),
	);
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
					'/api/internship-evaluations/rubric/SUPERVISOR',
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
				console.error('No se pudo cargar la pauta', err);
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
			if (ev?.supervisorComments) {
				setObservations(ev.supervisorComments);
			}

			const responses =
				await handleFindResponses(evaluationId);
			if (Array.isArray(responses) && responses.length) {
				const labelToId = new Map(
					COMPETENCIES.flatMap((c) =>
						c.attitudes.map((a) => [
							normalizeText(a.text),
							a.id,
						]),
					),
				);

				setSelections((prev) => {
					const next = { ...prev };
					for (const res of responses) {
						if (res.item.evaluationType !== 'SUPERVISOR')
							continue;
						const normalized = normalizeText(
							res.item.label,
						);
						const key = labelToId.get(normalized);
						if (!key) {
							continue;
						}
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

	const handlePick = (
		attitudeId: string,
		value: TEvalLetter,
	) => {
		setSelections((prev) => ({
			...prev,
			[attitudeId]: value,
		}));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		setLocalSuccess(false);

		const answered = Object.values(selections).some(
			(v) => v !== null,
		);
		if (!answered) {
			window.alert(
				'Ingresa al menos una respuesta antes de guardar (supervisor).',
			);
			return;
		}

		if (!evaluationId) return;
		if (rubricMap.size === 0) {
			window.alert(
				'No se pudo cargar la pauta de supervisor. Intenta recargar.',
			);
			return;
		}

		const answers = COMPETENCIES.flatMap((comp) =>
			comp.attitudes.map((att) => {
				const itemId = rubricMap.get(
					normalizeText(att.text),
				);
				return {
					itemId,
					value: selections[att.id] ?? 'F',
				};
			}),
		).filter((a) => typeof a.itemId === 'number');

		try {
			const submitRes = await fetch(
				`/api/internship-evaluations/submit/${evaluationId}/SUPERVISOR`,
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
						'No se pudieron guardar las respuestas',
				);
			}
			const submitJson = await submitRes.json();
			const newGrade = submitJson?.data?.supervisorGrade;
			if (typeof newGrade === 'number') {
				setExistingSupervisorGrade(Number(newGrade));
			}
		} catch (err) {
			const msg =
				err instanceof Error
					? err.message
					: 'Error al guardar las respuestas';
			window.alert(msg);
			return;
		}

		// Solo persistimos observaciones; la nota se recalcula en el submit
		const updateResult = await handleUpdateOne(
			evaluationId,
			{
				supervisorComments: observations,
			},
		);
		if (updateResult === null) {
			window.alert(
				'No se pudieron guardar las observaciones',
			);
			return;
		}
		setLocalSuccess(true);
		setTimeout(() => setLocalSuccess(false), 3500);
		onSuccess?.();
	};

	const getCompetencyBadgeColor = (code: string) => {
		if (code.startsWith('CG')) return 'badge-info';
		if (code.startsWith('CE')) return 'badge-success';
		return 'badge-neutral';
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full space-y-6"
		>
			<div className="bg-base-100 rounded-box p-6 shadow">
				<h3 className="text-2xl font-semibold mb-4">
					Aspectos a evaluar{' '}
					<span className="text-base-content/60">
						(Competencias)
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
						la letra que corresponda a lo observado:
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
					{COMPETENCIES.map((comp) => (
						<div
							key={comp.code}
							className="bg-base-200/50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
						>
							<div className="flex items-start gap-4 mb-4">
								<span
									className={`badge ${getCompetencyBadgeColor(comp.code)} badge-lg font-semibold`}
								>
									{comp.code}
								</span>
								<p className="text-sm text-base-content/80 flex-1">
									{comp.description}
								</p>
							</div>

							<div className="divider my-3"></div>

							<div className="space-y-4">
								{comp.attitudes.map((att) => (
									<div
										key={att.id}
										className="bg-base-100 rounded-lg p-4 flex items-center gap-4 hover:bg-base-100/80 transition-colors"
									>
										<div className="flex-1">
											<p className="text-sm">{att.text}</p>
										</div>
										<div className="shrink-0">
											<AfRadioGroup
												name={`eval-${att.id}`}
												value={selections[att.id]}
												onChange={(val) =>
													handlePick(att.id, val)
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
					<LabelAtom htmlFor={`observations-${id}`}>
						<span className="text-lg font-semibold">
							V.- Observaciones del supervisor
						</span>
					</LabelAtom>
					<div className="mt-3">
						<TextareaAtom
							id={`observations-${id}`}
							value={observations}
							onChange={(e) =>
								setObservations(e.target.value)
							}
							placeholder="Ingrese observaciones generales sobre el desempeño del practicante..."
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
