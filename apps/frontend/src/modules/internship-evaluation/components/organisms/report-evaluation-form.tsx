import {
	useId,
	useMemo,
	useState,
	type FormEvent,
} from 'react';
import { TextareaAtom, LabelAtom } from '../atoms';

interface IReportEvaluationFormProps {
	supervisorGrade?: number;
	supervisorComments?: string;
	onSubmit?: (data: {
		reportGrade: number;
		finalGrade: number;
		reportComments: string;
	}) => void;
}

export function ReportEvaluationForm({
	supervisorGrade = 0,
	supervisorComments = '',
	onSubmit,
}: IReportEvaluationFormProps) {
	const id = useId();
	// keep a string for the input to avoid aggressive rounding while typing
	const initialReport = (
		Math.round((Number(supervisorGrade) || 1) * 100) /
			100 || 1
	).toFixed(2);
	const [reportGradeStr, setReportGradeStr] =
		useState<string>(initialReport);
	const [reportComments, setReportComments] = useState('');

	const reportGrade = useMemo(() => {
		const n = parseFloat(reportGradeStr);
		if (Number.isNaN(n)) return 1;
		return (
			Math.round(Math.max(1, Math.min(7, n)) * 100) / 100
		);
	}, [reportGradeStr]);

	const finalGrade = useMemo(() => {
		const s = Number(supervisorGrade) || 0;
		const r = Number(reportGrade) || 0;
		const avg = (s + r) / (s > 0 ? 2 : 1);
		return Math.round(avg * 100) / 100;
	}, [supervisorGrade, reportGrade]);

	const isValid = useMemo(() => {
		if (reportGradeStr === '') return false;
		const n = parseFloat(reportGradeStr);
		if (Number.isNaN(n)) return false;
		return n >= 1 && n <= 7;
	}, [reportGradeStr]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!isValid) return;
		onSubmit?.({ reportGrade, finalGrade, reportComments });
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full max-w-2xl"
		>
			<fieldset className="fieldset rounded-box p-4 gap-4">
				<h3 className="text-2xl font-semibold">
					Evaluación del informe
				</h3>

				<div>
					<div className="text-sm">Nota del supervisor</div>
					<div className="font-medium">
						{supervisorGrade} / 7
					</div>
					<div className="text-sm text-base-content/60 mt-1">
						Comentario del supervisor:
					</div>
					<div className="p-2 bg-base-200 rounded">
						{supervisorComments || '—'}
					</div>
				</div>

				<div className="form-control">
					<LabelAtom htmlFor={`report-grade-${id}`}>
						Asignar nota al informe (1-7)
					</LabelAtom>
					<input
						id={`report-grade-${id}`}
						type="text"
						inputMode="numeric"
						pattern="[0-9]*"
						value={reportGradeStr}
						onChange={(e) => {
							const raw = e.target.value;
							// allow empty while typing
							if (raw === '') {
								setReportGradeStr('');
								return;
							}
							// allow only digits and dot
							if (!/^[0-9]*\.?[0-9]*$/.test(raw)) return;

							// if user typed first digit (1-7) and didn't type dot yet, auto-insert dot so next two are decimals
							if (/^[1-7]$/.test(raw)) {
								setReportGradeStr(`${raw}.`);
								return;
							}

							// split integer and decimals
							const [intPart, decPart] = raw.split('.');

							// integer part must be 1..7 (or empty if starting with dot)
							if (intPart && !/^[0-9]+$/.test(intPart))
								return;
							if (
								intPart &&
								(intPart.length > 1 ||
									Number(intPart) < 1 ||
									Number(intPart) > 7)
							) {
								// ignore invalid integer part
								return;
							}

							// decimals limited to 2 digits
							if (typeof decPart !== 'undefined') {
								const dec = decPart.slice(0, 2);
								setReportGradeStr(`${intPart}.${dec}`);
								return;
							}

							// otherwise accept the integer (could be '0' which will be normalized on blur)
							setReportGradeStr(intPart);
						}}
						onBlur={(e) => {
							const raw = e.target.value;
							if (raw === '') {
								setReportGradeStr('1.00');
								return;
							}
							const n = parseFloat(raw);
							if (Number.isNaN(n)) {
								setReportGradeStr('1.00');
								return;
							}
							const clamped = Math.max(1, Math.min(7, n));
							const rounded =
								Math.round(clamped * 100) / 100;
							setReportGradeStr(rounded.toFixed(2));
						}}
						className="input input-bordered w-36 mt-2"
					/>
				</div>

				<div className="form-control">
					<LabelAtom htmlFor={`report-comments-${id}`}>
						Comentario del informe
					</LabelAtom>
					<TextareaAtom
						id={`report-comments-${id}`}
						value={reportComments}
						onChange={(e) =>
							setReportComments(e.target.value)
						}
						placeholder="Comentarios sobre el informe y el desempeño del practicante"
					/>
				</div>

				<div className="divider" />

				<div className="p-4 border rounded">
					<div className="text-sm">
						Nota report: {reportGrade.toFixed(2)} / 7
					</div>
					<div className="text-sm">
						Nota final (promedio):{' '}
						<span className="font-medium">
							{finalGrade.toFixed(2)} / 7
						</span>
					</div>
				</div>

				<div className="flex justify-end">
					<button
						className="btn btn-neutral mt-4"
						type="submit"
						disabled={!isValid}
					>
						Guardar informe
					</button>
				</div>
			</fieldset>
		</form>
	);
}
