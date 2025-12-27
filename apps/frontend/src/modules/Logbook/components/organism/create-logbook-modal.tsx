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

	useEffect(() => {
		if (isOpen && initialData) {
			setTitle(initialData.title);
			setBody(initialData.content);
		} else if (isOpen && !initialData) {
			setTitle('');
			setBody('');
		}
	}, [isOpen, initialData]);

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	) => {
		e.preventDefault();
		await onSubmit(title, body);
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
					<Input
						label="Título"
						placeholder="Ej: Avance semanal..."
						value={title}
						onChange={(
							e: React.ChangeEvent<HTMLInputElement>,
						) => setTitle(e.target.value)}
						required
						disabled={isLoading}
					/>

					<TextArea
						label="Contenido"
						placeholder="Describe los avances y tareas realizadas..."
						value={body}
						onChange={(
							e: React.ChangeEvent<HTMLTextAreaElement>,
						) => setBody(e.target.value)}
						required
						disabled={isLoading}
					/>

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
