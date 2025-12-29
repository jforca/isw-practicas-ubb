import React from 'react';
import { Button } from '../atoms/button';

interface IDeleteConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
}

export const DeleteConfirmationModal: React.FC<
	IDeleteConfirmationModalProps
> = ({
	isOpen,
	onClose,
	onConfirm,
	title = '¿Eliminar informe?',
}) => {
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
				<h3 className="text-lg font-bold">{title}</h3>
				<p className="py-4">
					¿Estás seguro de que deseas eliminar este informe?
					Esta acción no se puede deshacer.
				</p>
				<div className="modal-action">
					<Button
						variant="secondary"
						onClick={onClose}
						type="button"
					>
						Cancelar
					</Button>
					<Button
						variant="danger"
						onClick={onConfirm}
						type="button"
					>
						Eliminar
					</Button>
				</div>
			</div>
			<button
				className="modal-backdrop bg-black/50"
				onClick={onClose}
				type="button"
				aria-label="Cerrar modal"
			></button>
		</div>
	);
};
