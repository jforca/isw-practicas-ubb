import React, { useState, useEffect } from 'react';
import { Button } from '../atoms/button';
import { Input } from '../atoms/input';
import { TextArea } from '../atoms/text-area';

export interface ILogbookFormData {
	id?: number;
	title: string;
	content: string;
}

interface ICreateLogbookModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (title: string, body: string) => Promise<void>;
	isLoading: boolean;
	initialData?: ILogbookFormData | null;
}

interface IFormErrors {
	title?: string;
	body?: string;
}

export const CreateLogbookModal: React.FC<
	ICreateLogbookModalProps
> = ({
	isOpen,
	onClose,
	onSubmit,
	isLoading,
	initialData,
}) => {
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');

	const [errors, setErrors] = useState<IFormErrors>({});

	useEffect(() => {
		setErrors({});

		if (isOpen && initialData) {
			setTitle(initialData.title);
			setBody(initialData.content);
		} else if (isOpen && !initialData) {
			setTitle('');
			setBody('');
		}
	}, [isOpen, initialData]);

	const validateForm = (): boolean => {
		const newErrors: IFormErrors = {};
		let isValid = true;

		const hasLetters = /[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]/;

		if (!title.trim()) {
			newErrors.title = 'El título es obligatorio.';
			isValid = false;
		} else if (title.length < 10) {
			newErrors.title = `Mínimo 10 caracteres (tienes ${title.length}).`;
			isValid = false;
		} else if (!hasLetters.test(title)) {
			newErrors.title =
				'El título debe contener texto descriptivo (no solo números o símbolos).';
			isValid = false;
		}

		if (!body.trim()) {
			newErrors.body = 'El contenido es obligatorio.';
			isValid = false;
		} else if (body.length < 50) {
			newErrors.body = `Mínimo 50 caracteres (tienes ${body.length}).`;
			isValid = false;
		} else if (!hasLetters.test(body)) {
			newErrors.body =
				'El contenido debe tener una redacción válida (no solo números o símbolos).';
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		await onSubmit(title, body);
	};

	const handleTitleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setTitle(e.target.value);
		if (errors.title)
			setErrors({ ...errors, title: undefined });
	};

	const handleBodyChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		setBody(e.target.value);
		if (errors.body)
			setErrors({ ...errors, body: undefined });
	};

	if (!isOpen) return null;

	const modalTitle = initialData
		? 'Editar Bitácora'
		: 'Nueva Bitácora';
	const buttonText = isLoading
		? 'Guardando...'
		: initialData
			? 'Actualizar'
			: 'Guardar Registro';

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
					{modalTitle}
				</h3>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="form-control">
						<Input
							label="Título"
							placeholder="Ej: Avance semanal del proyecto..."
							value={title}
							onChange={handleTitleChange}
							disabled={isLoading}
							className={errors.title ? 'input-error' : ''}
						/>

						{errors.title && (
							<span className="text-error text-xs mt-1 block">
								{errors.title}
							</span>
						)}
					</div>

					<div className="form-control">
						<TextArea
							label="Contenido"
							placeholder="Describe los avances y tareas realizadas..."
							value={body}
							onChange={handleBodyChange}
							disabled={isLoading}
							className={
								errors.body ? 'textarea-error' : ''
							}
						/>

						{errors.body && (
							<span className="text-error text-xs mt-1 block">
								{errors.body}
							</span>
						)}

						<div className="text-right text-xs text-gray-400 mt-1">
							{body.length}
						</div>
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
							{buttonText}
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
