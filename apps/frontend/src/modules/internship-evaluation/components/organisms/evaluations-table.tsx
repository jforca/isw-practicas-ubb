import {
	useEffect,
	useMemo,
	useId,
	useRef,
	useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { InputAtom, LabelAtom } from '../atoms';
import { UseFindManyInternshipEvaluation } from '../../hooks/find-many-internship-evaluation.hook';
import { FileText, Loader2 } from 'lucide-react';

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
		goToPage,
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
		<div className="space-y-4">
			<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div className="w-full md:max-w-sm">
					<LabelAtom htmlFor={searchId}>Buscar</LabelAtom>
					<InputAtom
						id={searchId}
						value={filters.search}
						onChange={(e) =>
							updateFilters({ search: e.target.value })
						}
						placeholder="Buscar por id o término..."
					/>
				</div>
				<div className="flex items-center gap-3 text-sm text-base-content/70">
					<span>Mostrando</span>
					<select
						className="select select-bordered select-sm"
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

			<div className="overflow-x-auto rounded-box border border-base-200 bg-base-100 shadow">
				<table className="table table-zebra w-full">
					<thead>
						<tr>
							<th className="text-xs uppercase text-primary font-semibold">
								Estudiante
							</th>
							<th className="text-xs uppercase text-secondary font-semibold">
								Supervisor
							</th>
							<th className="text-xs uppercase text-secondary font-semibold">
								Encargado
							</th>
							<th className="text-xs uppercase text-accent font-semibold">
								Nota supervisor
							</th>
							<th className="text-xs uppercase text-accent font-semibold">
								Nota encargado
							</th>
							<th className="text-xs uppercase text-accent font-semibold">
								Nota final
							</th>
							<th className="text-xs uppercase text-center text-info font-semibold">
								Evaluaciones
							</th>
							<th className="text-xs uppercase text-center text-success font-semibold">
								Firma
							</th>
						</tr>
					</thead>
					<tbody>
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
								<tr key={item.id}>
									<td className="font-semibold">
										{formatText(
											item.internship?.application?.student
												?.name,
										)}
									</td>
									<td>
										{formatText(
											item.internship?.supervisor?.user
												?.name,
										)}
									</td>
									<td>
										{formatText(
											item.internship?.coordinator?.user
												?.name,
										)}
									</td>
									<td>
										{formatGrade(item.supervisorGrade)}
									</td>
									<td>{formatGrade(item.reportGrade)}</td>
									<td className="font-bold">
										{formatGrade(item.finalGrade)}
									</td>
									<td>
										<div className="flex flex-wrap gap-2 justify-center">
											<Link
												to={`/app/internship/supervisor?evaluationId=${item.id}`}
												className="btn btn-outline btn-sm"
											>
												Supervisor
											</Link>
											<Link
												to={`/app/internship/report?evaluationId=${item.id}`}
												className="btn btn-primary btn-sm"
											>
												Encargado
											</Link>
										</div>
									</td>
									<td className="text-center">
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
															className="btn btn-circle btn-ghost btn-sm"
															title="Ver firma"
														>
															📄
														</a>
														<button
															type="button"
															className="btn btn-circle btn-ghost btn-sm"
															title="Reemplazar firma"
															onClick={() =>
																openSignatureModal(item.id)
															}
														>
															♻️
														</button>
													</div>
												);
											}
											return (
												<button
													type="button"
													className="btn btn-circle btn-ghost btn-sm"
													title="Adjuntar firma"
													onClick={() =>
														openSignatureModal(item.id)
													}
												>
													⬆️
												</button>
											);
										})()}
									</td>
								</tr>
							))}

						{!isLoading && !error && !hasData && (
							<tr>
								<td
									colSpan={8}
									className="text-center py-6 text-base-content/60"
								>
									No hay evaluaciones registradas.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-sm text-base-content/70">
				<div>
					Página {currentPage} de {totalPages || 1}
				</div>
				<div className="join">
					<button
						type="button"
						className="btn btn-sm join-item"
						onClick={prevPage}
						disabled={pagination.offset === 0}
					>
						Anterior
					</button>
					<button
						type="button"
						className="btn btn-sm join-item"
						onClick={() => goToPage(currentPage)}
					>
						{currentPage}
					</button>
					<button
						type="button"
						className="btn btn-sm join-item"
						onClick={nextPage}
						disabled={!pagination.hasMore}
					>
						Siguiente
					</button>
				</div>
			</div>

			{/* Modal de firma */}
			{createPortal(
				<dialog ref={signatureModalRef} className="modal">
					<div className="modal-box">
						<button
							type="button"
							className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
							onClick={() =>
								signatureModalRef.current?.close()
							}
						>
							✕
						</button>
						<h3 className="font-bold text-lg mb-4">
							Gestionar Firma
						</h3>
						<div className="flex flex-col gap-4">
							{signatureError && (
								<div className="alert alert-error">
									<span>{signatureError}</span>
								</div>
							)}
							<div className="flex flex-col gap-2">
								<h4 className="flex items-center gap-2">
									<FileText size={18} />
									Firma (PDF)
								</h4>
								<input
									type="file"
									accept="application/pdf"
									onChange={handleFileChange}
									className="file-input file-input-bordered w-full"
									disabled={isSignatureUploading}
								/>
								<span className="text-sm text-base-content/60">
									Máximo 10MB
								</span>
								{signatureFile && (
									<div className="flex items-center gap-2 p-2 bg-success/10 rounded-lg">
										<FileText
											size={16}
											className="text-success"
										/>
										<span className="text-sm text-success">
											{signatureFile.name}
										</span>
									</div>
								)}
							</div>
						</div>
						<div className="modal-action">
							<button
								type="button"
								className="btn btn-error btn-soft"
								onClick={() =>
									signatureModalRef.current?.close()
								}
								disabled={isSignatureUploading}
							>
								Cancelar
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={handleSaveSignature}
								disabled={
									!signatureFile || isSignatureUploading
								}
							>
								{isSignatureUploading ? (
									<>
										<Loader2
											size={18}
											className="animate-spin"
										/>
										Subiendo...
									</>
								) : (
									<>
										<FileText size={18} />
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
