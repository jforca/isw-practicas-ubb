import React, {
	useEffect,
	useMemo,
	useCallback,
	useState,
} from 'react';
import type { ILogbookEntry } from '../types';
import { LogbookTable } from '../organism/logbook-table-component';
import {
	CreateLogbookModal,
	type ILogbookFormData,
} from '../organism/create-logbook-modal';
import { ViewLogbookModal } from '../organism/view-logbook-modal';
import { DeleteConfirmationModal } from '../organism/delete-confirmation-modal';
import { FeedbackModal } from '../organism/fedback-modal';
import { LogbookManagementTemplate } from '../templates/logbook-template';
import { Button } from '../atoms/button';
import { UseFindManyLogbookEntries } from '../../Hooks/use-find-many-logbook-entries.hook';
import { UseCreateLogbookEntry } from '../../Hooks/use-create-logbook-entry.hook';
import { UseUpdateLogbookEntry } from '../../Hooks/use-update-logbook-entry.hook';
import { useAuth } from '../../../../common/hooks/auth.hook';
import {
	UseGetStudentDetails,
	type IStudentDetails,
} from '../../../dashboard-encargado/hooks/get-student-details.hook';
import { UseDeleteLogbookEntry } from '../../Hooks/use-delete-logbook-entry.hook';

export const LogbookPage: React.FC = () => {
	const [isFormModalOpen, setIsFormModalOpen] =
		useState(false);
	const [editingData, setEditingData] =
		useState<ILogbookFormData | null>(null);
	const [selectedEntry, setSelectedEntry] =
		useState<ILogbookEntry | null>(null);
	const [idToDelete, setIdToDelete] = useState<
		number | null
	>(null);
	const [feedback, setFeedback] = useState({
		isOpen: false,
		type: 'success' as 'success' | 'error',
		title: '',
		message: '',
	});

	const { getSession } = useAuth();
	const {
		handleGetStudentDetails,
		isLoading: isLoadingStudent,
	} = UseGetStudentDetails();
	const [internshipId, setInternshipId] = useState<
		number | null
	>(null);

	const {
		data,
		isLoading: isLoadingList,
		error: listError,
		handleFindMany,
		nextPage,
		prevPage,
		currentPage,
		totalPages,
		pagination,
	} = UseFindManyLogbookEntries(internshipId || 0);

	const { createEntry, isLoading: isCreating } =
		UseCreateLogbookEntry();
	const { updateEntry, isLoading: isUpdating } =
		UseUpdateLogbookEntry();
	const { deleteEntry, isLoading: isDeleting } =
		UseDeleteLogbookEntry();

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

	useEffect(() => {
		if (internshipId) {
			handleFindMany(0, 10);
		}
	}, [internshipId, handleFindMany]);

	const entries: ILogbookEntry[] = useMemo(() => {
		return data.map((item) => ({
			id: item.id,
			title: item.title,
			content: item.body,
			createdAt: item.created_at,
			updatedAt: item.updated_at,
			internshipId:
				item.internshipId || item.internship?.id || 0,
		}));
	}, [data]);

	const handleOpenCreate = () => {
		setEditingData(null);
		setIsFormModalOpen(true);
	};

	const handleEdit = useCallback(
		(id: number) => {
			const entryToEdit = entries.find((e) => e.id === id);
			if (entryToEdit) {
				setEditingData({
					id: entryToEdit.id,
					title: entryToEdit.title,
					content: entryToEdit.content,
				});
				setIsFormModalOpen(true);
			}
		},
		[entries],
	);

	const handleCloseFeedback = () => {
		setFeedback((prev) => ({ ...prev, isOpen: false }));
	};

	const handleFormSubmit = async (
		title: string,
		content: string,
	) => {
		let success = false;

		if (editingData?.id) {
			success = await updateEntry(editingData.id, {
				title,
				content,
			});
		} else {
			success = await createEntry({
				title,
				content,
				internshipId: internshipId || 0,
			});
		}

		if (success) {
			setIsFormModalOpen(false);
			setEditingData(null);
			handleFindMany(pagination.offset, pagination.limit);

			setFeedback({
				isOpen: true,
				type: 'success',
				title: editingData?.id
					? '¡Actualización Exitosa!'
					: '¡Registro Exitoso!',
				message: editingData?.id
					? 'La bitácora ha sido modificada correctamente.'
					: 'La nueva bitácora se ha creado correctamente.',
			});
		} else {
			setFeedback({
				isOpen: true,
				type: 'error',
				title: 'Error al procesar',
				message:
					'No se pudo guardar la bitácora. Verifique los datos e intente nuevamente.',
			});
		}
	};

	const handleDeleteClick = useCallback((id: number) => {
		setIdToDelete(id);
	}, []);

	const handleConfirmDelete = async () => {
		if (!idToDelete) return;

		const success = await deleteEntry(idToDelete);

		if (success) {
			setIdToDelete(null);
			handleFindMany(pagination.offset, pagination.limit);

			setFeedback({
				isOpen: true,
				type: 'success',
				title: 'Eliminado',
				message:
					'El registro ha sido eliminado correctamente.',
			});
		} else {
			setFeedback({
				isOpen: true,
				type: 'error',
				title: 'Error',
				message: 'No se pudo eliminar el registro.',
			});
		}
	};

	const handleView = useCallback((entry: ILogbookEntry) => {
		setSelectedEntry(entry);
	}, []);

	const pageHeader = (
		<div className="flex justify-between items-center">
			<h1 className="text-2xl font-bold text-base-content">
				Gestión de Registros del Logbook
			</h1>
			<Button onClick={handleOpenCreate} variant="primary">
				+ Nuevo Registro
			</Button>
		</div>
	);

	let contentNode: React.ReactNode;

	if (isLoadingList && entries.length === 0) {
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
				<LogbookTable
					entries={entries}
					onEdit={handleEdit}
					onDelete={handleDeleteClick}
					onView={handleView}
				/>

				<div className="flex justify-between items-center mt-4 bg-base-200 p-3 rounded-lg">
					<span className="text-sm text-gray-500">
						Página {currentPage} de {totalPages || 1}
					</span>
					<div className="flex space-x-2">
						<Button
							variant="secondary"
							onClick={prevPage}
							disabled={
								pagination.offset === 0 || isLoadingList
							}
							className="btn-sm"
						>
							Anterior
						</Button>
						<Button
							variant="primary"
							onClick={nextPage}
							disabled={
								!pagination.hasMore || isLoadingList
							}
							className="btn-sm"
						>
							Siguiente
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<LogbookManagementTemplate
				header={pageHeader}
				content={contentNode}
			/>

			<CreateLogbookModal
				isOpen={isFormModalOpen}
				onClose={() => setIsFormModalOpen(false)}
				onSubmit={handleFormSubmit}
				isLoading={isCreating || isUpdating}
				initialData={editingData}
			/>

			<ViewLogbookModal
				isOpen={!!selectedEntry}
				entry={selectedEntry}
				onClose={() => setSelectedEntry(null)}
			/>

			<DeleteConfirmationModal
				isOpen={!!idToDelete}
				onClose={() => setIdToDelete(null)}
				onConfirm={handleConfirmDelete}
				isLoading={isDeleting}
			/>

			<FeedbackModal
				isOpen={feedback.isOpen}
				onClose={handleCloseFeedback}
				type={feedback.type}
				title={feedback.title}
				message={feedback.message}
			/>
		</>
	);
};
