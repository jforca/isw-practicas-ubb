import React from 'react';
import type { ILogbookEntry } from '../types';
import { TableHeaderRow } from '../molecules/table-header-row';
// Asegúrate de importar la fila desde molecules
import { LogbookEntryRow } from '../molecules/logbook-entry-row';

// 1. Definimos las props de la TABLA (entries en plural)
interface ILogbookTableProps {
	entries: ILogbookEntry[];
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
	onView: (entry: ILogbookEntry) => void;
}

// 2. Exportamos el componente LogbookTable
export const LogbookTable: React.FC<ILogbookTableProps> = ({
	entries,
	onEdit,
	onDelete,
	onView,
}) => {
	if (entries.length === 0) {
		return (
			<p className="text-gray-500 p-4">
				No hay registros en el Logbook.
			</p>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="table w-full shadow-lg bg-base-100 rounded-box">
				<thead>
					<TableHeaderRow />
				</thead>
				<tbody>
					{/* Aquí mapeamos las entries para crear múltiples filas */}
					{entries.map((entry) => (
						<LogbookEntryRow
							key={entry.id}
							entry={entry}
							onEdit={onEdit}
							onDelete={onDelete}
							onView={onView}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
};
