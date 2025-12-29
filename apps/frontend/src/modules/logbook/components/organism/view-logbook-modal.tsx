import React from 'react';
import { Button } from '../atoms/button';
import type { ILogbookEntry } from '../types';

interface IViewLogbookModalProps {
	isOpen: boolean;
	onClose: () => void;
	entry: ILogbookEntry | null;
}

export const ViewLogbookModal: React.FC<
	IViewLogbookModalProps
> = ({ isOpen, onClose, entry }) => {
	if (!isOpen || !entry) return null;

	const formatDate = (date: Date | string) => {
		if (!date) return '-';
		const d =
			typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString('es-CL', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<div className="modal modal-open">
			<div className="modal-box w-11/12 max-w-5xl relative">
				<button
					onClick={onClose}
					className="btn btn-sm btn-circle absolute right-2 top-2"
					type="button"
				>
					✕
				</button>

				<h3 className="text-2xl font-bold mb-2 text-primary break-words">
					{entry.title}
				</h3>

				<div className="text-xs text-gray-500 mb-6 flex gap-4">
					<span>Creado: {formatDate(entry.createdAt)}</span>
					<span>
						Actualizado: {formatDate(entry.updatedAt)}
					</span>
				</div>

				<div className="bg-base-200 p-4 rounded-lg min-h-[200px]">
					<p className="whitespace-pre-wrap text-base leading-relaxed break-words">
						{entry.content}
					</p>
				</div>

				<div className="modal-action">
					<Button variant="primary" onClick={onClose}>
						Cerrar
					</Button>
				</div>
			</div>

			<form method="dialog" className="modal-backdrop">
				<button onClick={onClose} type="button">
					close
				</button>
			</form>
		</div>
	);
};
