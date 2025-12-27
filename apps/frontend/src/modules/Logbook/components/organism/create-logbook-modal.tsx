import React, { useState } from 'react';
import { Button } from '../atoms/button';
import { Input } from '../atoms/input';
import { TextArea } from '../atoms/text-area';

interface ICreateLogbookModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (title: string, body: string) => Promise<void>;
	isLoading: boolean;
}

export const CreateLogbookModal: React.FC<
	ICreateLogbookModalProps
> = ({ isOpen, onClose, onSubmit, isLoading }) => {
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');

	if (!isOpen) return null;

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	) => {
		e.preventDefault(); // Ahora TS sabe que esto es válido
		await onSubmit(title, body);
		setTitle('');
		setBody('');
	};

	return (
		// Fondo oscuro del modal
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
					Nueva Bitácora
				</h3>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						label="Título"
						placeholder="Ej: Avance semanal..."
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
						disabled={isLoading}
					/>

					<TextArea
						label="Contenido"
						placeholder="Describe los avances y tareas realizadas..."
						value={body}
						onChange={(e) => setBody(e.target.value)}
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
							{isLoading
								? 'Guardando...'
								: 'Guardar Registro'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
