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
		<div className="overflow-x-auto">
			<table className="table w-full shadow-lg bg-base-100 rounded-box">
				<thead>
					<TableHeaderRow />
				</thead>
				<tbody>
					{entries.map((entry) => (
						<LogbookEntryRow
							key={entry.id}
							entry={entry}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
};
