import React from 'react';
import type { ILogbookEntry } from '../../components/types';
import { TableData } from '../atoms/table-data';
import { Button } from '../atoms/button';

interface ILogbookEntryRowProps {
	entry: ILogbookEntry;
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
}

export const LogbookEntryRow: React.FC<
	ILogbookEntryRowProps
> = ({ entry, onEdit, onDelete }) => {
	// Función simple para formatear la fecha
	const formatDate = (date: Date | string) => {
		if (typeof date === 'string') {
			date = new Date(date);
		}
		return date.toLocaleDateString('es-CL');
	};

	return (
		<tr>
			<TableData>{entry.id}</TableData>
			<TableData>{entry.title}</TableData>
			<TableData className="truncate max-w-xs">
				{entry.content.substring(0, 50)}...
			</TableData>
			<TableData>{formatDate(entry.createdAt)}</TableData>
			<TableData>{formatDate(entry.updatedAt)}</TableData>
			<TableData>
				<div className="flex space-x-2">
					{/* Usamos el estilo btn-ghost para los botones dentro de la tabla */}
					<Button
						variant="info"
						className="btn-xs"
						onClick={() => onEdit(entry.id)}
					>
						Editar
					</Button>
					<Button
						variant="danger"
						className="btn-xs"
						onClick={() => onDelete(entry.id)}
					>
						Eliminar
					</Button>
				</div>
			</TableData>
		</tr>
	);
};
