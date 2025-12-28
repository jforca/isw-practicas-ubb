import { useEffect, useMemo, useId } from 'react';
import { Link } from 'react-router';
import { InputAtom, LabelAtom } from '../atoms';
import { UseFindManyInternshipEvaluation } from '../../hooks/find-many-internship-evaluation.hook';

const formatGrade = (grade?: number | string | null) => {
	if (grade == null) return '—';
	const num =
		typeof grade === 'string' ? parseFloat(grade) : grade;
	if (Number.isNaN(num)) return '—';
	return num.toFixed(2);
};

export function EvaluationsTable() {
	const searchId = useId();
	const {
		data,
		pagination,
		filters,
		isLoading,
		error,
		currentPage,
		totalPages,
		handleFindMany,
		updateFilters,
		nextPage,
		prevPage,
		goToPage,
		changeLimit,
	} = UseFindManyInternshipEvaluation();

	useEffect(() => {
		handleFindMany(0, pagination.limit);
	}, [handleFindMany, pagination.limit]);

	const hasData = useMemo(() => data.length > 0, [data]);

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div className="w-full md:max-w-sm">
					<LabelAtom htmlFor={searchId}>Buscar</LabelAtom>
					<InputAtom
						id={searchId}
						value={filters.search}
						onChange={(e) =>
							updateFilters({ search: e.target.value })
						}
						placeholder="Buscar por id o término..."
					/>
				</div>
				<div className="flex items-center gap-3 text-sm text-base-content/70">
					<span>Mostrando</span>
					<select
						className="select select-bordered select-sm"
						value={pagination.limit}
						onChange={(e) =>
							changeLimit(Number(e.target.value))
						}
					>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={20}>20</option>
					</select>
					<span>por página</span>
				</div>
			</div>

			<div className="overflow-x-auto rounded-box border border-base-200 bg-base-100 shadow">
				<table className="table table-zebra w-full">
					<thead>
						<tr>
							<th className="text-xs uppercase">ID</th>
							<th className="text-xs uppercase">
								Supervisor
							</th>
							<th className="text-xs uppercase">
								Encargado
							</th>
							<th className="text-xs uppercase">
								Nota final
							</th>
							<th className="text-xs uppercase text-center">
								Acciones
							</th>
						</tr>
					</thead>
					<tbody>
						{isLoading && (
							<tr>
								<td
									colSpan={5}
									className="text-center py-6 text-base-content/60"
								>
									Cargando evaluaciones...
								</td>
							</tr>
						)}

						{error && !isLoading && (
							<tr>
								<td
									colSpan={5}
									className="text-center py-6 text-error"
								>
									{error}
								</td>
							</tr>
						)}

						{!isLoading &&
							!error &&
							hasData &&
							data.map((item) => (
								<tr key={item.id}>
									<td className="font-semibold">
										#{item.id}
									</td>
									<td>
										{formatGrade(item.supervisorGrade)}
									</td>
									<td>{formatGrade(item.reportGrade)}</td>
									<td className="font-bold">
										{formatGrade(item.finalGrade)}
									</td>
									<td>
										<div className="flex flex-wrap gap-2 justify-center">
											<Link
												to={`/app/internship/supervisor?evaluationId=${item.id}`}
												className="btn btn-outline btn-sm"
											>
												Supervisor
											</Link>
											<Link
												to={`/app/internship/report?evaluationId=${item.id}`}
												className="btn btn-primary btn-sm"
											>
												Encargado
											</Link>
										</div>
									</td>
								</tr>
							))}

						{!isLoading && !error && !hasData && (
							<tr>
								<td
									colSpan={5}
									className="text-center py-6 text-base-content/60"
								>
									No hay evaluaciones registradas.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-sm text-base-content/70">
				<div>
					Página {currentPage} de {totalPages || 1}
				</div>
				<div className="join">
					<button
						type="button"
						className="btn btn-sm join-item"
						onClick={prevPage}
						disabled={pagination.offset === 0}
					>
						Anterior
					</button>
					<button
						type="button"
						className="btn btn-sm join-item"
						onClick={() => goToPage(currentPage)}
					>
						{currentPage}
					</button>
					<button
						type="button"
						className="btn btn-sm join-item"
						onClick={nextPage}
						disabled={!pagination.hasMore}
					>
						Siguiente
					</button>
				</div>
			</div>
		</div>
	);
}
