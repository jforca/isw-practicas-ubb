import React, { useState } from 'react';
import { Button } from '../atoms/button';
import type { IReport } from '../../Hooks/use-find-reports.hook';
import { DeleteConfirmationModal } from './delete-confirmation-modal';

interface IReportsTableProps {
	reports: IReport[];
	onDelete: (id: number) => void;
}

export const ReportsTable: React.FC<IReportsTableProps> = ({
	reports,
	onDelete,
}) => {
	const [reportToDelete, setReportToDelete] = useState<
		number | null
	>(null);

	const handleView = (filePath: string) => {
		const url = `/uploads/reports/${filePath}`;
		window.open(url, '_blank');
	};

	const handleDeleteClick = (id: number) => {
		setReportToDelete(id);
	};

	const handleConfirmDelete = () => {
		if (reportToDelete !== null) {
			onDelete(reportToDelete);
			setReportToDelete(null);
		}
	};

	return (
		<div className="overflow-x-auto">
			<table className="table w-full">
				<thead>
					<tr>
						<th className="w-1/3">Título</th>
						<th>Fecha de Subida</th>
						<th className="text-center">Acciones</th>
					</tr>
				</thead>
				<tbody>
					{reports.map((report) => (
						<tr key={report.id} className="hover">
							<td className="font-bold text-base-content">
								{report.title.length > 80
									? `${report.title.substring(0, 80)}...`
									: report.title}
							</td>

							<td>
								{new Date(
									report.uploadedAt,
								).toLocaleDateString()}
							</td>

							<td className="flex justify-center gap-2">
								<Button
									variant="secondary"
									className="btn-xs btn-square cursor-pointer"
									onClick={() =>
										handleView(report.filePath)
									}
									title="Ver PDF"
									aria-label="Ver PDF"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
									>
										<title>Ver PDF</title>
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

								<a
									href={`/uploads/reports/${report.filePath}`}
									download={report.title}
									className="btn btn-secondary btn-xs btn-square"
									title="Descargar"
									target="_blank"
									rel="noreferrer"
									aria-label={`Descargar ${report.title}`}
								>
									<span className="sr-only">Descargar</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-4 h-4"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
										/>
									</svg>
								</a>

								<Button
									variant="danger"
									className="btn-xs btn-square cursor-pointer"
									onClick={() =>
										handleDeleteClick(report.id)
									}
									title="Eliminar"
									aria-label="Eliminar"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
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
					{reports.length === 0 && (
						<tr>
							<td
								colSpan={3}
								className="text-center text-gray-500 py-4"
							>
								No hay informes subidos.
							</td>
						</tr>
					)}
				</tbody>
			</table>

			<DeleteConfirmationModal
				isOpen={!!reportToDelete}
				onClose={() => setReportToDelete(null)}
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
};
