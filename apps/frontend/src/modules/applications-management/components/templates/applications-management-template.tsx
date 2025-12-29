import { SearchBar } from '@common/components';
import {
	ApplicationManagementCards,
	ApplicationsManagementHeader,
} from '@modules/applications-management/components/organisms';
import {
	UseFindAllApplications,
	type TFilters,
} from '@modules/applications-management/hooks';
import { useEffect } from 'react';

export function ApplicationsManagementTemplate() {
	const {
		data: applications,
		pagination,
		filters,
		isLoading,
		error,
		currentPage,
		totalPages,
		handleFindMany,
		updateFilters,
		goToPage,
		nextPage,
		prevPage,
		changeLimit,
		refresh,
	} = UseFindAllApplications();

	useEffect(() => {
		handleFindMany(0, pagination.limit);
	}, [handleFindMany, pagination.limit]);

	const handleSearch = (search: string) => {
		updateFilters({ search });
	};

	const handleStatusChange = (
		status: TFilters['status'],
	) => {
		updateFilters({ status });
	};

	return (
		<section className="section-base">
			<ApplicationsManagementHeader />

			{/* Barra de búsqueda y filtros */}
			<div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mt-6">
				<div className="flex-1">
					<SearchBar
						placeholder="Buscar por nombre de alumno u oferta..."
						onSearch={handleSearch}
					/>
				</div>

				{/* Filtro de estado */}
				<select
					className="select select-bordered w-full sm:w-auto"
					value={filters.status}
					onChange={(e) =>
						handleStatusChange(
							e.target.value as TFilters['status'],
						)
					}
				>
					<option value="all">Todos los estados</option>
					<option value="pending">Pendientes</option>
					<option value="approved">Aprobadas</option>
					<option value="rejected">Rechazadas</option>
				</select>
			</div>

			<ApplicationManagementCards
				data={applications}
				pagination={pagination}
				isLoading={isLoading}
				error={error}
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={goToPage}
				onNextPage={nextPage}
				onPrevPage={prevPage}
				onLimitChange={changeLimit}
				onRefresh={refresh}
			/>
		</section>
	);
}
