import React from 'react';
import { Button } from '../atoms/button';
import type { ILogbookEntry } from '../types';

interface ILogbookTableProps {
	entries: ILogbookEntry[];
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
	onView: (entry: ILogbookEntry) => void;
}

export const LogbookTable: React.FC<ILogbookTableProps> = ({
	entries,
	onEdit,
	onDelete,
	onView,
}) => {
	const truncateText = (
		text: string,
		maxLength: number,
	) => {
		if (!text) return '';
		if (text.length <= maxLength) return text;
		return `${text.substring(0, maxLength)}...`;
	};

	return (
		<div className="overflow-x-auto">
			<table className="table w-full">
				<thead>
					<tr>
						<th className="w-1/4">Título</th>
						<th className="w-1/3">Resumen</th>
						<th>Fecha</th>
						<th className="text-center">Acciones</th>
					</tr>
				</thead>
				<tbody>
					{entries.map((entry) => (
						<tr key={entry.id} className="hover">
							<td className="font-bold text-base-content">
								{truncateText(entry.title, 30)}
							</td>

							<td className="text-sm text-gray-500">
								{truncateText(entry.content, 50)}
							</td>

							<td>
								{new Date(
									entry.createdAt,
								).toLocaleDateString()}
							</td>

							<td className="flex justify-center gap-2">
								<Button
									variant="secondary"
									className="btn-xs btn-square cursor-pointer"
									onClick={() => onView(entry)}
									title="Ver detalle"
									aria-label="Ver detalle"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										role="img"
									>
										<title>Ver detalle</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
										/>
									</svg>
								</Button>

								<Button
									variant="primary"
									className="btn-xs btn-square cursor-pointer"
									onClick={() => onEdit(entry.id!)}
									title="Editar"
									aria-label="Editar"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										role="img"
									>
										<title>Editar</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
										/>
									</svg>
								</Button>

								<Button
									variant="danger"
									className="btn-xs btn-square cursor-pointer"
									onClick={() => onDelete(entry.id!)}
									title="Eliminar"
									aria-label="Eliminar"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										role="img"
									>
										<title>Eliminar</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
