import React, { useState, useEffect } from 'react';
import { Button } from '../atoms/button';

interface ICreateReportModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (title: string, file: File) => Promise<void>;
	isLoading: boolean;
}

interface IFormErrors {
	title?: string;
	file?: string;
}

export const CreateReportModal: React.FC<
	ICreateReportModalProps
> = ({ isOpen, onClose, onSubmit, isLoading }) => {
	const [file, setFile] = useState<File | null>(null);
	const [errors, setErrors] = useState<IFormErrors>({});

	useEffect(() => {
		if (isOpen) {
			setFile(null);
			setErrors({});
		}
	}, [isOpen]);

	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		if (e.target.files && e.target.files.length > 0) {
			const selectedFile = e.target.files[0];
			setFile(selectedFile);
			if (errors.file)
				setErrors({ ...errors, file: undefined });
		}
	};

	const validateForm = (): boolean => {
		const newErrors: IFormErrors = {};
		let isValid = true;

		if (!file) {
			newErrors.file = 'Debes seleccionar un archivo PDF.';
			isValid = false;
		} else {
			if (file.type !== 'application/pdf') {
				newErrors.file = 'El archivo debe ser un PDF.';
				isValid = false;
			}
			if (file.size > 30 * 1024 * 1024) {
				newErrors.file =
					'El archivo no debe superar los 30MB.';
				isValid = false;
			}
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	) => {
		e.preventDefault();

		if (!validateForm() || !file) {
			return;
		}

		await onSubmit(file.name, file);
	};

	if (!isOpen) return null;

	return (
		<div className="modal modal-open">
			<div className="modal-box relative">
				<button
					onClick={onClose}
					className="btn btn-sm btn-circle absolute right-2 top-2"
					type="button"
				>
					✕
				</button>

				<h3 className="text-lg font-bold mb-4">
					Subir Nuevo Informe
				</h3>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="form-control">
						<div className="label">
							<span className="label-text font-semibold">
								Archivo PDF
							</span>
						</div>
						<input
							type="file"
							accept="application/pdf"
							className={`file-input file-input-bordered w-full ${errors.file ? 'file-input-error' : ''}`}
							onChange={handleFileChange}
							disabled={isLoading}
						/>
						{errors.file && (
							<span className="text-error text-xs mt-1 block">
								{errors.file}
							</span>
						)}
					</div>

					<div className="modal-action">
						<Button
							variant="secondary"
							onClick={onClose}
							type="button"
							disabled={isLoading}
						>
							Cancelar
						</Button>
						<Button
							variant="primary"
							type="submit"
							disabled={isLoading}
						>
							{isLoading ? 'Subiendo...' : 'Subir Informe'}
						</Button>
					</div>
				</form>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button onClick={onClose} type="button">
					close
				</button>
			</form>
		</div>
	);
};
