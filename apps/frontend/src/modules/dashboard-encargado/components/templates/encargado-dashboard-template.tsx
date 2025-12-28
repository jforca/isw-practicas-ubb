import { useState, useEffect, useCallback } from 'react';
import { StatsOverview } from '@modules/dashboard-encargado/components/molecules/stats-overview';
import { Toolbar } from '@modules/dashboard-encargado/components/molecules/toolbar';
import { StudentsTable } from '@modules/dashboard-encargado/components/organisms/students-table';
import { useFindManyStudents } from '@modules/dashboard-encargado/hooks/find-many-student.hook';
import { Pagination } from '@modules/internship-centers/components/molecules/pagination';

export function EncargadoDashboardTemplate() {
	const {
		data: students,
		pagination,
		isLoading,
		error,
		handleFindMany,
		updateFilters,
		filters,
	} = useFindManyStudents();

	const [currentPage, setCurrentPage] = useState(1);
	const [limit] = useState(5);

	useEffect(() => {
		handleFindMany(currentPage, limit);
	}, [currentPage, limit, handleFindMany]);

	const stats = {
		total: pagination?.total ?? 0,
		inCourse: 0,
		onReview: 0,
		onEvaluation: 0,
	};

	const handleSearch = useCallback(
		(search: string) => {
			updateFilters({ search });
			setCurrentPage(1);
		},
		[updateFilters],
	);

	return (
		<section className="p-4 container">
			<header className="flex items-start justify-between mb-4">
				<div>
					<h1 className="text-3xl font-bold">
						Gestión de Alumnos
					</h1>
					<p className="text-sm text-base-content/70">
						Administración CRUD, requisitos académicos y
						estado de prácticas.
					</p>
				</div>
			</header>

			<StatsOverview
				total={stats.total}
				inCourse={stats.inCourse}
				onReview={stats.onReview}
				onEvaluation={stats.onEvaluation}
			/>

			<div className="my-3" />

			<Toolbar
				onStudentCreated={() => {
					handleFindMany(currentPage, limit);
				}}
				onSearch={handleSearch}
				currentFilters={filters}
				onFiltersChange={updateFilters}
			/>

			<div className="my-2" />

			<div className="grid grid-cols-1 gap-4">
				<div className="w-full">
					<StudentsTable
						students={students}
						isLoading={isLoading}
						error={error}
						onStudentDeleted={() => {
							handleFindMany(currentPage, limit);
						}}
					/>
				</div>
				{pagination && pagination.totalPages > 1 && (
					<div className="flex justify-center mt-4">
						<Pagination
							currentPage={currentPage}
							totalPages={pagination.totalPages}
							onNextPage={() =>
								setCurrentPage((prev) => prev + 1)
							}
							onPrevPage={() =>
								setCurrentPage((prev) => prev - 1)
							}
							onPageChange={setCurrentPage}
							isLoading={isLoading}
						/>
					</div>
				)}
			</div>
		</section>
	);
}
