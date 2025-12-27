import React from 'react';
import type { ILogbookEntry } from '../../components/types';
import { TableData } from '../atoms/table-data';
import { Button } from '../atoms/button';

// 1. DEFINICIÓN DE LA INTERFAZ (El contrato)
interface ILogbookEntryRowProps {
	entry: ILogbookEntry;
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
	onView: (entry: ILogbookEntry) => void; // <--- ¡ESTA LÍNEA ES OBLIGATORIA!
}

// 2. EL COMPONENTE
export const LogbookEntryRow: React.FC<
	ILogbookEntryRowProps
> = ({
	entry,
	onEdit,
	onDelete,
	onView, // <--- Recibir la función aquí
}) => {
	const formatDate = (date: Date | string) => {
		if (!date) return '-';
		if (typeof date === 'string') {
			date = new Date(date);
		}
		return date.toLocaleDateString('es-CL');
	};

	const animationClass =
		'transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95';

	return (
		<tr className="hover:bg-base-200 transition-colors duration-200">
			<TableData>{entry.id}</TableData>
			<TableData>{entry.title}</TableData>

			<TableData
				className="truncate max-w-xs cursor-pointer"
				onClick={() => onView(entry)}
			>
				<span className="hover:text-primary transition-colors">
					{entry.content.substring(0, 50)}...
				</span>
			</TableData>

			<TableData>{formatDate(entry.createdAt)}</TableData>
			<TableData>{formatDate(entry.updatedAt)}</TableData>

			<TableData>
				<div className="flex space-x-2">
					<Button
						variant="secondary"
						className={`btn-xs ${animationClass}`}
						onClick={() => onView(entry)}
					>
						Ver
					</Button>
					<Button
						variant="info"
						className={`btn-xs ${animationClass}`}
						onClick={() => onEdit(entry.id)}
					>
						Editar
					</Button>
					<Button
						variant="danger"
						className={`btn-xs ${animationClass}`}
						onClick={() => onDelete(entry.id)}
					>
						Eliminar
					</Button>
				</div>
			</TableData>
		</tr>
	);
};
