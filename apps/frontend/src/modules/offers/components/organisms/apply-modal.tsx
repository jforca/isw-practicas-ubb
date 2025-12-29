import {
	AlertTriangle,
	CheckCircle,
	FileText,
	Loader2,
	Send,
	Trash2,
	Upload,
	X,
	XCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface IApplyModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (
		cvFile: File,
		motivationLetter?: File,
	) => void;
	isLoading: boolean;
	isSuccess: boolean;
	error: {
		type: string;
		message: string;
		details: string;
	} | null;
	offerTitle: string;
}

export function ApplyModal({
	isOpen,
	onClose,
	onConfirm,
	isLoading,
	isSuccess,
	error,
	offerTitle,
}: IApplyModalProps) {
	const modalRef = useRef<HTMLDialogElement>(null);
	const cvInputRef = useRef<HTMLInputElement>(null);
	const motivationInputRef = useRef<HTMLInputElement>(null);

	const [cvFile, setCvFile] = useState<File | null>(null);
	const [motivationFile, setMotivationFile] =
		useState<File | null>(null);
	const [fileError, setFileError] = useState<string | null>(
		null,
	);

	useEffect(() => {
		if (isOpen) {
			modalRef.current?.showModal();
		} else {
			modalRef.current?.close();
		}
	}, [isOpen]);

	// Reset files when modal opens
	useEffect(() => {
		if (isOpen) {
			setCvFile(null);
			setMotivationFile(null);
			setFileError(null);
		}
	}, [isOpen]);

	const handleClose = () => {
		modalRef.current?.close();
		setCvFile(null);
		setMotivationFile(null);
		setFileError(null);
		onClose();
	};

	const handleCvChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.type !== 'application/pdf') {
				setFileError('Solo se permiten archivos PDF');
				e.target.value = '';
				return;
			}
			if (file.size > 10 * 1024 * 1024) {
				setFileError(
					'El archivo no puede superar los 10MB',
				);
				e.target.value = '';
				return;
			}
			setCvFile(file);
			setFileError(null);
		}
	};

	const handleMotivationChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.type !== 'application/pdf') {
				setFileError('Solo se permiten archivos PDF');
				e.target.value = '';
				return;
			}
			if (file.size > 10 * 1024 * 1024) {
				setFileError(
					'El archivo no puede superar los 10MB',
				);
				e.target.value = '';
				return;
			}
			setMotivationFile(file);
			setFileError(null);
		}
	};

	const handleRemoveCv = () => {
		setCvFile(null);
		if (cvInputRef.current) {
			cvInputRef.current.value = '';
		}
	};

	const handleRemoveMotivation = () => {
		setMotivationFile(null);
		if (motivationInputRef.current) {
			motivationInputRef.current.value = '';
		}
	};

	const handleSubmit = () => {
		if (!cvFile) {
			setFileError('Debes adjuntar tu CV para postular');
			return;
		}
		onConfirm(cvFile, motivationFile ?? undefined);
	};

	const getErrorIcon = () => {
		switch (error?.type) {
			case 'ACTIVE_INTERNSHIP_EXISTS':
			case 'ACADEMIC_REQUIREMENTS_NOT_MET':
				return (
					<AlertTriangle
						size={48}
						className="text-warning mx-auto mb-4"
					/>
				);
			default:
				return (
					<XCircle
						size={48}
						className="text-error mx-auto mb-4"
					/>
				);
		}
	};

	const renderContent = () => {
		// Estado de carga
		if (isLoading) {
			return (
				<div className="text-center py-6">
					<Loader2
						size={48}
						className="animate-spin text-primary mx-auto mb-4"
					/>
					<h3 className="text-lg font-semibold">
						Procesando postulación...
					</h3>
					<p className="text-base-content/70 mt-2">
						Por favor espera mientras registramos tu
						postulación y subimos tus documentos
					</p>
				</div>
			);
		}

		// Estado de éxito
		if (isSuccess) {
			return (
				<div className="text-center py-6">
					<CheckCircle
						size={48}
						className="text-success mx-auto mb-4"
					/>
					<h3 className="text-lg font-semibold text-success">
						¡Postulación exitosa!
					</h3>
					<p className="text-base-content/70 mt-2">
						Tu postulación a "{offerTitle}" ha sido
						registrada con estado "Recibida"
					</p>
					<p className="text-sm text-base-content/50 mt-4">
						Puedes hacer seguimiento desde tu panel personal
					</p>
					<div className="modal-action justify-center">
						<button
							type="button"
							className="btn btn-primary"
							onClick={handleClose}
						>
							Entendido
						</button>
					</div>
				</div>
			);
		}

		// Estado de error
		if (error) {
			return (
				<div className="text-center py-6">
					{getErrorIcon()}
					<h3 className="text-lg font-semibold text-error">
						{error.message}
					</h3>
					<p className="text-base-content/70 mt-2">
						{error.details}
					</p>
					<div className="modal-action justify-center">
						<button
							type="button"
							className="btn btn-ghost"
							onClick={handleClose}
						>
							Cerrar
						</button>
					</div>
				</div>
			);
		}

		// Estado inicial - Formulario de postulación
		return (
			<div className="py-4">
				<div className="flex items-center gap-3 mb-4">
					<Send size={24} className="text-primary" />
					<h3 className="text-lg font-semibold">
						Postular a oferta
					</h3>
				</div>
				<p className="text-base-content/70 mb-4">
					Estás por postular a la oferta "{offerTitle}"
				</p>

				{/* Error de archivos */}
				{fileError && (
					<div className="alert alert-error mb-4">
						<XCircle size={18} />
						<span className="text-sm">{fileError}</span>
					</div>
				)}

				{/* CV - Obligatorio */}
				<div className="form-control mb-4">
					<label className="label">
						<span className="label-text font-medium">
							Curriculum Vitae (CV){' '}
							<span className="text-error">*</span>
						</span>
					</label>
					{cvFile ? (
						<div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg border border-success/30">
							<FileText
								size={20}
								className="text-success shrink-0"
							/>
							<span className="text-sm text-success flex-1 truncate">
								{cvFile.name}
							</span>
							<button
								type="button"
								className="btn btn-ghost btn-xs btn-circle"
								onClick={handleRemoveCv}
							>
								<Trash2 size={14} className="text-error" />
							</button>
						</div>
					) : (
						<label
							htmlFor="cv-input"
							className="border-2 border-dashed border-base-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors block"
						>
							<Upload
								size={24}
								className="mx-auto text-base-content/50 mb-2"
							/>
							<p className="text-sm text-base-content/70">
								Haz clic para seleccionar tu CV
							</p>
							<p className="text-xs text-base-content/50 mt-1">
								Solo archivos PDF (máx. 10MB)
							</p>
						</label>
					)}
					<input
						id="cv-input"
						ref={cvInputRef}
						type="file"
						accept="application/pdf"
						className="hidden"
						onChange={handleCvChange}
					/>
				</div>

				{/* Carta de motivación - Opcional */}
				<div className="form-control mb-4">
					<label className="label">
						<span className="label-text font-medium">
							Carta de motivación{' '}
							<span className="text-base-content/50">
								(opcional)
							</span>
						</span>
					</label>
					{motivationFile ? (
						<div className="flex items-center gap-2 p-3 bg-info/10 rounded-lg border border-info/30">
							<FileText
								size={20}
								className="text-info shrink-0"
							/>
							<span className="text-sm text-info flex-1 truncate">
								{motivationFile.name}
							</span>
							<button
								type="button"
								className="btn btn-ghost btn-xs btn-circle"
								onClick={handleRemoveMotivation}
							>
								<Trash2 size={14} className="text-error" />
							</button>
						</div>
					) : (
						<label
							htmlFor="motivation-input"
							className="border-2 border-dashed border-base-300 rounded-lg p-4 text-center cursor-pointer hover:border-info transition-colors block"
						>
							<Upload
								size={24}
								className="mx-auto text-base-content/50 mb-2"
							/>
							<p className="text-sm text-base-content/70">
								Haz clic para seleccionar tu carta
							</p>
							<p className="text-xs text-base-content/50 mt-1">
								Solo archivos PDF (máx. 10MB)
							</p>
						</label>
					)}
					<input
						id="motivation-input"
						ref={motivationInputRef}
						type="file"
						accept="application/pdf"
						className="hidden"
						onChange={handleMotivationChange}
					/>
				</div>

				<div className="alert alert-info mt-4">
					<AlertTriangle size={20} />
					<span className="text-sm">
						Recuerda que no puedes postular si tienes una
						práctica activa y debes cumplir los requisitos
						académicos.
					</span>
				</div>

				<div className="modal-action">
					<button
						type="button"
						className="btn btn-ghost"
						onClick={handleClose}
					>
						Cancelar
					</button>
					<button
						type="button"
						className="btn btn-primary gap-2"
						onClick={handleSubmit}
						disabled={!cvFile}
					>
						<Send size={16} />
						Enviar postulación
					</button>
				</div>
			</div>
		);
	};

	const modalElement = (
		<dialog ref={modalRef} className="modal">
			<div className="modal-box max-w-lg">
				{!isLoading && !isSuccess && (
					<button
						type="button"
						className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
						onClick={handleClose}
						aria-label="Cerrar modal"
					>
						<X size={20} className="stroke-error" />
					</button>
				)}
				{renderContent()}
			</div>
			<form method="dialog" className="modal-backdrop">
				<button
					type="button"
					onClick={handleClose}
					aria-label="Cerrar modal"
				>
					close
				</button>
			</form>
		</dialog>
	);

	return createPortal(modalElement, document.body);
}
