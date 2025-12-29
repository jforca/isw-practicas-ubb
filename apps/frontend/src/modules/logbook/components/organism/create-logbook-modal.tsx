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
	onSubmit: (
		title: string,
		content: string,
	) => Promise<void>;
	isLoading: boolean;
	initialData?: ILogbookFormData | null;
}

interface IFormErrors {
	title?: string;
	content?: string;
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
	const [content, setContent] = useState('');

	const [errors, setErrors] = useState<IFormErrors>({});

	useEffect(() => {
		setErrors({});

		if (isOpen && initialData) {
			setTitle(initialData.title);
			setContent(initialData.content);
		} else if (isOpen && !initialData) {
			setTitle('');
			setContent('');
		}
	}, [isOpen, initialData]);

	const validateForm = (): boolean => {
		const newErrors: IFormErrors = {};
		let isValid = true;

		const hasLetters = /[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]/;

		if (!title.trim()) {
			newErrors.title = 'El título es obligatorio.';
			isValid = false;
			newErrors.title = `Mínimo 10 caracteres (tienes ${title.length}).`;
			isValid = false;
		} else if (title.length > 150) {
			newErrors.title = `Máximo 150 caracteres (tienes ${title.length}).`;
			isValid = false;
		} else if (!hasLetters.test(title)) {
			newErrors.title =
				'El título debe contener texto descriptivo (no solo números o símbolos).';
			isValid = false;
		}

		if (!content.trim()) {
			newErrors.content = 'El contenido es obligatorio.';
			isValid = false;
			newErrors.content = `Mínimo 50 caracteres (tienes ${content.length}).`;
			isValid = false;
		} else if (content.length > 2000) {
			newErrors.content = `Máximo 2000 caracteres (tienes ${content.length}).`;
			isValid = false;
		} else if (!hasLetters.test(content)) {
			newErrors.content =
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

		await onSubmit(title, content);
	};

	const handleTitleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setTitle(e.target.value);
		if (errors.title)
			setErrors({ ...errors, title: undefined });
	};

	const handleContentChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		setContent(e.target.value);
		if (errors.content)
			setErrors({ ...errors, content: undefined });
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
			<div className="modal-box relative w-11/12 max-w-5xl">
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
							maxLength={150}
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
							value={content}
							onChange={handleContentChange}
							maxLength={2000}
							disabled={isLoading}
							className={`h-96 ${
								errors.content ? 'textarea-error' : ''
							}`}
						/>

						{errors.content && (
							<span className="text-error text-xs mt-1 block">
								{errors.content}
							</span>
						)}

						<div className="text-right text-xs text-gray-400 mt-1">
							{content.length}/2000
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
