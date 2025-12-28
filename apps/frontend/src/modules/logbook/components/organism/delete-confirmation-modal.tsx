import React from 'react';
import { Button } from '../atoms/button';

interface IDeleteConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading: boolean;
}

export const DeleteConfirmationModal: React.FC<
	IDeleteConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, isLoading }) => {
	if (!isOpen) return null;

	return (
		<div className="modal modal-open">
			<div className="modal-box">
				<h3 className="font-bold text-lg text-error">
					¿Eliminar registro?
				</h3>
				<p className="py-4">
					Esta acción eliminará la bitácora permanentemente.{' '}
					<br />
					¿Estás seguro de que deseas continuar?
				</p>

				<div className="modal-action">
					<Button
						variant="secondary"
						onClick={onClose}
						disabled={isLoading}
					>
						Cancelar
					</Button>

					<Button
						variant="danger"
						onClick={onConfirm}
						disabled={isLoading}
					>
						{isLoading ? 'Eliminando...' : 'Sí, Eliminar'}
					</Button>
				</div>
			</div>

			{/* Fondo para cerrar al hacer click fuera */}
			<form method="dialog" className="modal-backdrop">
				<button onClick={onClose} type="button">
					close
				</button>
			</form>
		</div>
	);
};
