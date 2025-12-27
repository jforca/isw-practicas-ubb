import React, {
	useEffect,
	useMemo,
	useCallback,
	useState,
} from 'react';
import type { ILogbookEntry } from '../types';
import { LogbookTable } from '../organism/logbook-table-component';
import { CreateLogbookModal } from '../organism/create-logbook-modal';
import { ViewLogbookModal } from '../organism/view-logbook-modal'; // <--- IMPORTAR
import { LogbookManagementTemplate } from '../templates/logbook-template';
import { Button } from '../atoms/button';
import { UseFindManyLogbookEntries } from '../../Hooks/use-find-many-logbook-entries.hook';
import { UseCreateLogbookEntry } from '../../Hooks/use-create-logbook-entry.hook';

const CURRENT_INTERNSHIP_ID = 1;

export const LogbookPage: React.FC = () => {
	// --- ESTADOS ---
	const [isCreateModalOpen, setIsCreateModalOpen] =
		useState(false);

	// Estado para "Ver Detalle": guarda la entrada seleccionada o null si cerrado
	const [selectedEntry, setSelectedEntry] =
		useState<ILogbookEntry | null>(null);

	// --- HOOKS ---
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
	} = UseFindManyLogbookEntries(CURRENT_INTERNSHIP_ID);

	const { createEntry, isLoading: isCreating } =
		UseCreateLogbookEntry();

	useEffect(() => {
		handleFindMany(0, 5);
	}, [handleFindMany]);

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

	// --- HANDLERS ---
	const handleCreateSubmit = async (
		title: string,
		body: string,
	) => {
		const success = await createEntry({
			title,
			body,
			internshipId: CURRENT_INTERNSHIP_ID,
		});
		if (success) {
			setIsCreateModalOpen(false);
			handleFindMany(0, 5);
		} else {
			alert('Error al crear la entrada');
		}
	};

	const handleEdit = useCallback((id: number) => {
		console.log(`Editar ID: ${id}`);
	}, []);

	const handleDelete = useCallback((id: number) => {
		if (window.confirm(`¿Eliminar registro ${id}?`)) {
			console.log(`Eliminar ID: ${id}`);
		}
	}, []);

	// Handler para abrir el modal de visualización
	const handleView = useCallback((entry: ILogbookEntry) => {
		setSelectedEntry(entry);
	}, []);

	// --- RENDER ---
	const pageHeader = (
		<div className="flex justify-between items-center">
			<h1 className="text-2xl font-bold text-base-content">
				Gestión de Registros del Logbook
			</h1>
			<Button
				onClick={() => setIsCreateModalOpen(true)}
				variant="primary"
			>
				+ Nuevo Registro
			</Button>
		</div>
	);

	let contentNode: React.ReactNode;
	// ... (Tu lógica de loading/error igual que antes) ...
	if (isLoadingList && entries.length === 0) {
		contentNode = (
			<div className="flex justify-center p-8">
				<span className="loading loading-spinner loading-lg text-primary"></span>
			</div>
		);
	} else if (listError) {
		contentNode = (
			<div className="alert alert-error">
				Error: {listError}
			</div>
		);
	} else {
		contentNode = (
			<div className="space-y-4">
				<LogbookTable
					entries={entries}
					onEdit={handleEdit}
					onDelete={handleDelete}
					onView={handleView} // <--- CONECTAR AQUÍ
				/>

				<div className="flex justify-between items-center mt-4 bg-base-200 p-3 rounded-lg">
					{/* ... Tu paginación existente ... */}
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
							className="btn-sm transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95 disabled:hover:scale-100"
						>
							Anterior
						</Button>
						<Button
							variant="primary"
							onClick={nextPage}
							disabled={
								!pagination.hasMore || isLoadingList
							}
							className="btn-sm transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95 disabled:hover:scale-100"
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

			{/* Modal de Creación */}
			<CreateLogbookModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSubmit={handleCreateSubmit}
				isLoading={isCreating}
			/>

			{/* Modal de Visualización (NUEVO) */}
			<ViewLogbookModal
				isOpen={!!selectedEntry} // Abierto si selectedEntry no es null
				entry={selectedEntry}
				onClose={() => setSelectedEntry(null)} // Cerrar limpia el estado
			/>
		</>
	);
};
