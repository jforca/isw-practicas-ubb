import React, { useEffect, useState } from 'react';
import { ReportsTemplate } from '../templates/reports-template';
import { CreateReportModal } from '../organism/create-report-modal';
import { ReportsTable } from '../organism/reports-table';
import { Button } from '../atoms/button';
import { UseFindReports } from '../../Hooks/use-find-reports.hook';
import { UseCreateReport } from '../../Hooks/use-create-report.hook';
import { UseDeleteReport } from '../../Hooks/use-delete-report.hook';

const CURRENT_INTERNSHIP_ID = 1;

export const ReportsPage: React.FC = () => {
	const [isUploadModalOpen, setIsUploadModalOpen] =
		useState(false);

	const {
		data: reports,
		isLoading: isLoadingReports,
		findReports,
	} = UseFindReports();
	const { createReport, isLoading: isCreating } =
		UseCreateReport();
	const { deleteReport } = UseDeleteReport();

	useEffect(() => {
		findReports(CURRENT_INTERNSHIP_ID);
	}, [findReports]);

	const handleOpenUpload = () => {
		setIsUploadModalOpen(true);
	};

	const handleFormSubmit = async (
		title: string,
		file: File,
	) => {
		const success = await createReport({
			title,
			file,
			internshipId: CURRENT_INTERNSHIP_ID,
		});

		if (success) {
			setIsUploadModalOpen(false);
			findReports(CURRENT_INTERNSHIP_ID);
		} else {
			alert('Error al subir el informe');
		}
	};

	const handleDelete = async (id: number) => {
		const success = await deleteReport(id);
		if (success) {
			findReports(CURRENT_INTERNSHIP_ID);
		} else {
			alert('Error al eliminar el informe');
		}
	};

	const pageHeader = (
		<div className="flex justify-between items-center">
			<h1 className="text-2xl font-bold text-base-content">
				Gestión de Informes (PDF)
			</h1>
			<Button onClick={handleOpenUpload} variant="primary">
				+ Subir Informe
			</Button>
		</div>
	);

	let contentNode: React.ReactNode;

	if (isLoadingReports && reports.length === 0) {
		contentNode = (
			<div className="flex justify-center p-8">
				<span className="loading loading-spinner text-primary"></span>
			</div>
		);
	} else {
		contentNode = (
			<div className="space-y-4">
				<ReportsTable
					reports={reports}
					onDelete={handleDelete}
				/>
			</div>
		);
	}

	return (
		<>
			<ReportsTemplate
				header={pageHeader}
				content={contentNode}
			/>

			<CreateReportModal
				isOpen={isUploadModalOpen}
				onClose={() => setIsUploadModalOpen(false)}
				onSubmit={handleFormSubmit}
				isLoading={isCreating}
			/>
		</>
	);
};
