import React from 'react';
import type { ILogbookEntry } from '../types';
import { TableHeaderRow } from '../molecules/table-header-row';
import { LogbookEntryRow } from '../molecules/logbook-entry-row';

interface ILogbookTableProps {
	entries: ILogbookEntry[];
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
}

export const LogbookTable: React.FC<ILogbookTableProps> = ({
	entries,
	onEdit,
	onDelete,
}) => {
	if (entries.length === 0) {
		return (
			<p className="text-gray-500 p-4">
				No hay registros en el Logbook.
			</p>
		);
	}

	return (
		// Agregamos el contenedor de desbordamiento y la clase 'table' de DaisyUI
		<div className="overflow-x-auto">
			<table className="table w-full shadow-lg bg-base-100 rounded-box">
				<thead>
					<TableHeaderRow />
				</thead>
				<tbody>
					{/* DaisyUI maneja las rayas y estilos de hover automáticamente */}
					{entries.map((entry) => (
						<LogbookEntryRow
							key={entry.id}
							entry={entry}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					))}
				</tbody>
				{/* Opcional: Footer de la tabla con paginación */}
				<tfoot>
					<TableHeaderRow />
				</tfoot>
			</table>
		</div>
	);
};
