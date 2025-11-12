import {
	useId,
	useMemo,
	useState,
	type FormEvent,
} from 'react';
import {
	ScoreButton,
	LabelAtom,
	TextareaAtom,
} from '../atoms';

interface ISupervisorEvaluationFormProps {
	onSubmit?: (data: {
		scores: number[];
		supervisorGrade: number;
		supervisorComments: string;
	}) => void;
}

const ASPECTS = [
	'Calidad de código',
	'Resolución de problemas',
	'Buenas prácticas',
	'Trabajo en equipo',
	'Documentación',
];

export function SupervisorEvaluationForm({
	onSubmit,
}: ISupervisorEvaluationFormProps) {
	const id = useId();
	const [scores, setScores] = useState<number[]>(
		Array(ASPECTS.length).fill(1),
	);
	const [supervisorComments, setSupervisorComments] =
		useState('');

	const total = useMemo(
		() => scores.reduce((a, b) => a + b, 0),
		[scores],
	);
	const supervisorGrade = useMemo(() => {
		const avg = total / scores.length;
		return Math.round(avg * 100) / 100;
	}, [total, scores.length]);

	const handleScoreChange = (
		index: number,
		value: number,
	) => {
		const copy = [...scores];
		copy[index] = value;
		setScores(copy);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onSubmit?.({
			scores,
			supervisorGrade,
			supervisorComments,
		});
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full max-w-2xl"
		>
			<fieldset className="fieldset rounded-box p-4 gap-4">
				<h3 className="text-2xl font-semibold">
					Evaluación del supervisor
				</h3>
				<p className="text-sm text-base-content/60">
					Selecciona el nivel de cumplimiento (1-7) para
					cada aspecto.
				</p>

				{ASPECTS.map((label, idx) => (
					<div key={label} className="flex flex-col gap-2">
						<LabelAtom>{label}</LabelAtom>
						<div className="flex items-center gap-3">
							<div className="flex gap-2">
								{[1, 2, 3, 4, 5, 6, 7].map((v) => (
									<ScoreButton
										key={v}
										value={v}
										selected={scores[idx] === v}
										onClick={() =>
											handleScoreChange(idx, v)
										}
									/>
								))}
							</div>
							<div className="text-sm text-base-content/60">
								Seleccionado: {scores[idx]}
							</div>
						</div>
					</div>
				))}

				<div className="form-control w-full">
					<LabelAtom htmlFor={`supervisor-comments-${id}`}>
						Comentario sobre contribuciones
					</LabelAtom>
					<div className="mt-2">
						<TextareaAtom
							id={`supervisor-comments-${id}`}
							value={supervisorComments}
							onChange={(e) =>
								setSupervisorComments(e.target.value)
							}
							placeholder="Comentarios sobre las contribuciones del practicante"
						/>
					</div>
				</div>

				<div className="divider" />

				<div className="flex items-center justify-between gap-4">
					<div>
						<div className="text-sm">Puntaje total:</div>
						<div className="text-xl font-medium">
							{total} / {scores.length * 7}
						</div>
					</div>
					<div>
						<div className="text-sm">
							Nota supervisor (promedio):
						</div>
						<div className="text-xl font-medium">
							{supervisorGrade} / 7
						</div>
					</div>
				</div>

				<div className="flex justify-end">
					<button
						type="submit"
						className="btn btn-neutral mt-4"
					>
						Guardar evaluación
					</button>
				</div>
			</fieldset>
		</form>
	);
}
