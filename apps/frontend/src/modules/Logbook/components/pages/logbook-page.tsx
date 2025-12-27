import React, {
	useEffect,
	useMemo,
	useCallback,
} from 'react';
import type { ILogbookEntry } from '../types';
import { LogbookTable } from '../organism/logbook-table-component';
import { LogbookManagementTemplate } from '../templates/logbook-template';
import { Button } from '../atoms/button';
import { UseFindManyLogbookEntries } from '../../Hooks/use-find-many-logbook-entries.hook';

const CURRENT_INTERNSHIP_ID = 1;

export const LogbookPage: React.FC = () => {
	const {
		data,
		isLoading,
		error,
		handleFindMany,
		nextPage,
		prevPage,
		currentPage,
		totalPages,
		pagination,
	} = UseFindManyLogbookEntries(CURRENT_INTERNSHIP_ID);

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

	const handleEdit = useCallback((id: number) => {
		console.log(`Editar ID: ${id}`);
	}, []);

	const handleDelete = useCallback((id: number) => {
		if (window.confirm(`¿Eliminar registro ${id}?`)) {
			console.log(`Eliminar ID: ${id}`);
		}
	}, []);

	const handleNewEntry = () => {
		console.log('Crear nuevo registro');
	};

	const pageHeader = (
		<div className="flex justify-between items-center">
			<h1 className="text-2xl font-bold text-base-content">
				Gestión de Registros del Logbook
			</h1>
			<Button onClick={handleNewEntry} variant="primary">
				+ Nuevo Registro
			</Button>
		</div>
	);

	let contentNode: React.ReactNode;

	if (isLoading && entries.length === 0) {
		contentNode = (
			<div className="flex justify-center p-8">
				<span className="loading loading-spinner loading-lg text-primary"></span>
			</div>
		);
	} else if (error) {
		contentNode = (
			<div className="alert alert-error">
				<span>Error al cargar datos: {error}</span>
				<Button
					onClick={() => handleFindMany(0, 5)}
					variant="secondary"
				>
					Reintentar
				</Button>
			</div>
		);
	} else {
		contentNode = (
			<div className="space-y-4">
				<LogbookTable
					entries={entries}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>

				<div className="flex justify-between items-center mt-4 bg-base-200 p-3 rounded-lg">
					<span className="text-sm text-gray-500">
						Página {currentPage} de {totalPages || 1}
						<span className="ml-2 text-xs opacity-70">
							(Total: {pagination.total})
						</span>
					</span>
					<div className="flex space-x-2">
						<Button
							variant="secondary"
							onClick={prevPage}
							disabled={
								pagination.offset === 0 || isLoading
							}
							className="btn-sm"
						>
							Anterior
						</Button>
						<Button
							variant="primary"
							onClick={nextPage}
							disabled={!pagination.hasMore || isLoading}
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
		<LogbookManagementTemplate
			header={pageHeader}
			content={contentNode}
		/>
	);
};
