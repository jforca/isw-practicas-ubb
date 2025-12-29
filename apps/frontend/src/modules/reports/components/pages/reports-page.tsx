import React, { useEffect, useState } from 'react';
import { ReportsTemplate } from '../templates/reports-template';
import { CreateReportModal } from '../organism/create-report-modal';
import { ReportsTable } from '../organism/reports-table';
import { Button } from '../atoms/button';
import { UseFindReports } from '../../Hooks/use-find-reports.hook';
import { UseCreateReport } from '../../Hooks/use-create-report.hook';
import { UseDeleteReport } from '../../Hooks/use-delete-report.hook';
import { useAuth } from '../../../../common/hooks/auth.hook';
import {
	UseGetStudentDetails,
	type IStudentDetails,
} from '../../../dashboard-encargado/hooks/get-student-details.hook';

export const ReportsPage: React.FC = () => {
	const [isUploadModalOpen, setIsUploadModalOpen] =
		useState(false);
	const { getSession } = useAuth();
	const {
		handleGetStudentDetails,
		isLoading: isLoadingStudent,
	} = UseGetStudentDetails();
	const [internshipId, setInternshipId] = useState<
		number | null
	>(null);

	const {
		data: reports,
		isLoading: isLoadingReports,
		findReports,
		removeReport,
		error: listError,
	} = UseFindReports();
	const { createReport, isLoading: isCreating } =
		UseCreateReport();
	const { deleteReport } = UseDeleteReport();

	useEffect(() => {
		const fetchInternshipId = async () => {
			const { session } = await getSession();
			if (session?.user?.id) {
				const details = (await handleGetStudentDetails(
					session.user.id,
				)) as IStudentDetails;
				const activeApp = details?.applications?.find(
					(app) => app.internship,
				);
				if (activeApp?.internship) {
					setInternshipId(
						Number(
							(
								activeApp.internship as unknown as {
									id: number | string;
								}
							).id,
						),
					);
				}
			}
		};
		fetchInternshipId();
	}, [getSession, handleGetStudentDetails]);

	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		if (internshipId) {
			findReports(internshipId, searchTerm);
		}
	}, [internshipId, findReports, searchTerm]);

	const handleOpenUpload = () => {
		setIsUploadModalOpen(true);
	};

	const handleFormSubmit = async (
		title: string,
		file: File,
	) => {
		if (!internshipId) return;

		const success = await createReport({
			title,
			file,
			internshipId,
		});

		if (success) {
			setIsUploadModalOpen(false);
			findReports(internshipId, searchTerm);
		} else {
			alert('Error al subir el informe');
		}
	};

	const handleDelete = async (id: number) => {
		if (!internshipId) return;

		const success = await deleteReport(id);
		if (success) {
			removeReport(id);
			findReports(internshipId, searchTerm);
		} else {
			alert('Error al eliminar el informe');
		}
	};

	const pageHeader = (
		<div className="flex justify-between items-center">
			<h1 className="text-2xl font-bold text-base-content">
				Gestión de Informes (PDF)
			</h1>
			<div className="flex gap-4">
				<input
					type="text"
					placeholder="Buscar por nombre..."
					className="input input-bordered w-full max-w-xs"
					value={searchTerm}
					maxLength={155}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<Button
					onClick={handleOpenUpload}
					variant="primary"
				>
					+ Subir Informe
				</Button>
			</div>
		</div>
	);

	let contentNode: React.ReactNode;

	if (isLoadingReports && reports.length === 0) {
		contentNode = (
			<div className="flex justify-center p-8">
				<span className="loading loading-spinner text-primary"></span>
			</div>
		);
	} else if (listError) {
		contentNode = (
			<div className="alert alert-error">
				Error: {listError}
			</div>
		);
	} else if (isLoadingStudent) {
		contentNode = (
			<div className="flex justify-center p-8">
				<span className="loading loading-spinner text-primary"></span>
			</div>
		);
	} else if (!internshipId) {
		contentNode = (
			<div className="alert alert-warning">
				No se encontró una práctica activa para este
				estudiante.
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
