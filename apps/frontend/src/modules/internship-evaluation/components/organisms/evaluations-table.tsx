import {
	useEffect,
	useMemo,
	useId,
	useRef,
	useState,
} from 'react';
import { createPortal } from 'react-dom';
import { InputAtom, LabelAtom } from '../atoms';
import { UseFindManyInternshipEvaluation } from '../../hooks/find-many-internship-evaluation.hook';
import {
	FileText,
	Loader2,
	Eye,
	CheckCircle,
	AlertCircle,
	ClipboardList,
	RotateCcw,
	Upload,
} from 'lucide-react';

const formatGrade = (grade?: number | string | null) => {
	if (grade == null) return '—';
	const num =
		typeof grade === 'string' ? parseFloat(grade) : grade;
	if (Number.isNaN(num)) return '—';
	return num.toFixed(2);
};

const formatText = (value?: string | null) =>
	value?.trim() || '—';

export function EvaluationsTable() {
	const searchId = useId();
	const {
		data,
		pagination,
		filters,
		isLoading,
		error,
		currentPage,
		totalPages,
		handleFindMany,
		updateFilters,
		nextPage,
		prevPage,
		changeLimit,
	} = UseFindManyInternshipEvaluation();

	useEffect(() => {
		handleFindMany(0, pagination.limit);
	}, [handleFindMany, pagination.limit]);

	const hasData = useMemo(() => data.length > 0, [data]);

	// Estado para modal de firma
	const [selectedEvaluationId, setSelectedEvaluationId] =
		useState<number | null>(null);
	const [signatureFile, setSignatureFile] =
		useState<File | null>(null);
	const [signatureError, setSignatureError] = useState<
		string | null
	>(null);
	const [isSignatureUploading, setIsSignatureUploading] =
		useState(false);
	const signatureModalRef = useRef<HTMLDialogElement>(null);
	const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

	const handleUploadSignature = async (
		evaluationId: number,
		file: File,
	) => {
		setIsSignatureUploading(true);
		setSignatureError(null);
		try {
			const fd = new FormData();
			fd.append('file', file);
			const res = await fetch(
				`/api/internship-evaluations/upload-signature/${evaluationId}`,
				{ method: 'POST', body: fd },
			);
			if (!res.ok) {
				setSignatureError('No se pudo adjuntar la firma');
				return;
			}
			// Limpiar estado y cerrar modal
			setSignatureFile(null);
			setSignatureError(null);
			signatureModalRef.current?.close();
			handleFindMany(pagination.offset, pagination.limit);
		} catch {
			setSignatureError('Error al subir la firma');
		} finally {
			setIsSignatureUploading(false);
		}
	};

	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.type !== 'application/pdf') {
			setSignatureError('Solo se permiten archivos PDF');
			setSignatureFile(null);
			return;
		}
		if (file.size > MAX_FILE_SIZE_BYTES) {
			setSignatureError(
				'Archivo demasiado grande (máx 10 MB)',
			);
			setSignatureFile(null);
			return;
		}
		setSignatureError(null);
		setSignatureFile(file);
	};

	const openSignatureModal = (evaluationId: number) => {
		setSelectedEvaluationId(evaluationId);
		setSignatureFile(null);
		setSignatureError(null);
		signatureModalRef.current?.showModal();
	};

	const handleSaveSignature = async () => {
		if (!selectedEvaluationId || !signatureFile) return;
		await handleUploadSignature(
			selectedEvaluationId,
			signatureFile,
		);
	};

	return (
		<div className="space-y-6">
			{/* Header y filtros */}
			<div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
				<div className="flex-1">
					<LabelAtom htmlFor={searchId}>Buscar</LabelAtom>
					<InputAtom
						id={searchId}
						value={filters.search}
						onChange={(e) =>
							updateFilters({ search: e.target.value })
						}
						placeholder="Buscar por estudiante, supervisor..."
					/>
				</div>
				<div className="flex items-center gap-3 text-sm text-base-content/70">
					<span>Mostrar</span>
					<select
						className="select select-bordered select-sm w-20"
						value={pagination.limit}
						onChange={(e) =>
							changeLimit(Number(e.target.value))
						}
					>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={20}>20</option>
					</select>
					<span>por página</span>
				</div>
			</div>

			{/* Tabla estilizada */}
			<div className="rounded-lg border border-base-200 bg-base-100 shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="table w-full">
						<thead className="bg-base-200">
							<tr>
								<th className="text-xs font-semibold uppercase text-base-content/70">
									Estudiante
								</th>
								<th className="text-xs font-semibold uppercase text-base-content/70">
									Supervisor
								</th>
								<th className="text-xs font-semibold uppercase text-base-content/70">
									Coordinador
								</th>
								<th className="text-xs font-semibold uppercase text-base-content/70 text-center">
									Notas
								</th>
								<th className="text-xs font-semibold uppercase text-base-content/70 text-center">
									Evaluaciones
								</th>
								<th className="text-xs font-semibold uppercase text-base-content/70 text-center">
									Firma
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-base-200">
						{isLoading && (
							<tr>
								<td
									colSpan={8}
									className="text-center py-6 text-base-content/60"
								>
									Cargando evaluaciones...
								</td>
							</tr>
						)}

						{error && !isLoading && (
							<tr>
								<td
									colSpan={8}
									className="text-center py-6 text-error"
								>
									{error}
								</td>
							</tr>
						)}

						{!isLoading &&
							!error &&
							hasData &&
							data.map((item) => (
								<tr key={item.id} className="hover:bg-base-50">
									<td className="py-4 font-medium text-base-content">
										{formatText(
											item.internship?.application?.student
												?.name,
										)}
									</td>
									<td className="py-4 text-sm text-base-content/70">
										{formatText(
											item.internship?.supervisor?.user
												?.name,
										)}
									</td>
									<td className="py-4 text-sm text-base-content/70">
										{formatText(
											item.internship?.coordinator?.user
												?.name,
										)}
									</td>
									<td className="py-4 text-center">
										<div className="flex flex-col items-center gap-1">
											<span className="text-xs uppercase text-base-content/60">
												Supervisor
											</span>
											<span className="font-medium text-primary">
												{formatGrade(item.supervisorGrade)}
											</span>
										</div>
									</td>
									<td className="py-4 text-center">
										<button
											type="button"
											onClick={() => {
												// Open evaluation modal
											}}
											className="btn btn-xs btn-info btn-soft gap-1 rounded-full"
											title="Abrir/editar evaluación"
										>
											<ClipboardList className="size-4" />
										</button>
									</td>
									<td className="py-4 text-center">
										{(() => {
											const sigDoc =
												item.signature_document ??
												item.signatureDocument;
											const hasSignature = Boolean(sigDoc);
											if (hasSignature) {
												return (
													<div className="flex items-center justify-center gap-2">
														<a
															href={`/api/internship-evaluations/view-signature/${item.id}`}
															target="_blank"
															rel="noopener noreferrer"
															className="btn btn-xs btn-primary btn-soft rounded-full"
															title="Ver firma"
														>
															<Eye className="size-4" />
														</a>
														<button
															type="button"
															className="btn btn-xs btn-accent btn-soft rounded-full"
															title="Cambiar firma"
															onClick={() =>
																openSignatureModal(item.id)
															}
														>
															<RotateCcw className="size-4" />
														</button>
													</div>
												);
											}
											return (
												<button
													type="button"
													className="btn btn-xs btn-success btn-soft rounded-full"
													title="Subir firma"
													onClick={() =>
														openSignatureModal(item.id)
													}
												>
													<Upload className="size-4" />
												</button>
											);
										})()}
									</td>
								</tr>
							))}

						{!isLoading && !error && !hasData && (
							<tr>
								<td
									colSpan={6}
									className="text-center py-8 text-base-content/60"
								>
									<div className="flex flex-col items-center gap-2">
										<ClipboardList className="size-6 text-base-content/40" />
										<span>
											No hay evaluaciones registradas
										</span>
									</div>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-base-content/70">
				<div>
					Página <span className="font-semibold text-base-content">{currentPage}</span> de{" "}
					<span className="font-semibold text-base-content">{totalPages || 1}</span>
				</div>
				<div className="join">
					<button
						type="button"
						className="btn btn-sm join-item btn-outline"
						onClick={prevPage}
						disabled={pagination.offset === 0}
					>
						← Anterior
					</button>
					<button
						type="button"
						className="btn btn-sm join-item btn-neutral"
					>
						{currentPage}
					</button>
					<button
						type="button"
						className="btn btn-sm join-item btn-outline"
						onClick={nextPage}
						disabled={!pagination.hasMore}
					>
						Siguiente →
					</button>
				</div>
			</div>

			{/* Modal de firma */}
			{createPortal(
				<dialog ref={signatureModalRef} className="modal">
					<div className="modal-box w-full max-w-md rounded-lg shadow-lg">
						<button
							type="button"
							className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
							onClick={() =>
								signatureModalRef.current?.close()
							}
						>
							✕
						</button>
						<h3 className="font-bold text-lg text-base-content mb-6 flex items-center gap-2">
							<FileText className="text-primary" size={24} />
							Gestionar Firma
						</h3>
						<div className="space-y-4">
							{signatureError && (
								<div className="alert alert-error shadow-sm">
									<AlertCircle size={18} />
									<span>{signatureError}</span>
								</div>
							)}
							<div className="form-control gap-3">
								<label className="label">
									<span className="label-text font-semibold flex items-center gap-2">
										<FileText size={16} />
										Archivo PDF
									</span>
								</label>
								<input
									type="file"
									accept="application/pdf"
									onChange={handleFileChange}
									className="file-input file-input-bordered file-input-sm w-full"
									disabled={isSignatureUploading}
								/>
								<span className="text-xs text-base-content/60 mt-1">
									Máximo 10 MB • Solo archivos PDF
								</span>
								{signatureFile && (
									<div className="alert alert-success alert-sm">
										<CheckCircle size={16} />
										<div className="flex flex-col gap-1">
											<span className="font-medium text-sm">
												Archivo listo
											</span>
											<span className="text-xs opacity-75">
												{signatureFile.name}
											</span>
										</div>
									</div>
								)}
							</div>
						</div>
						<div className="modal-action mt-6">
							<button
								type="button"
								className="btn btn-sm"
								onClick={() =>
									signatureModalRef.current?.close()
								}
								disabled={isSignatureUploading}
							>
								Cancelar
							</button>
							<button
								type="button"
								className="btn btn-sm btn-primary"
								onClick={handleSaveSignature}
								disabled={
									!signatureFile || isSignatureUploading
								}
							>
								{isSignatureUploading ? (
									<>
										<Loader2
											size={16}
											className="animate-spin"
										/>
										Subiendo...
									</>
								) : (
									<>
										<Upload size={16} />
										Guardar Firma
									</>
								)}
							</button>
						</div>
					</div>
					<form method="dialog" className="modal-backdrop">
						<button type="submit">close</button>
					</form>
				</dialog>,
				document.body,
			)}
		</div>
	);
}