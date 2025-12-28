import type { TFilters } from '@modules/dashboard-encargado/hooks/find-many-student.hook';

type TFilterMenuProps = {
	selectedFilters: TFilters;
	onChange: (filters: Partial<TFilters>) => void;
};

export function FilterMenu({
	selectedFilters,
	onChange,
}: TFilterMenuProps) {
	const toggleFilter = (
		category: 'internshipTypes' | 'statuses',
		value: string,
	) => {
		const currentList = selectedFilters[category] || [];
		const newList = currentList.includes(value)
			? currentList.filter((item) => item !== value)
			: [...currentList, value];

		onChange({
			[category]: newList,
		});
	};

	return (
		<div className="dropdown dropdown-bottom dropdown-end">
			<button
				type="button"
				tabIndex={0}
				className="btn btn-sm bg-gray-200 hover:bg-gray-300 text-gray-800 border-none"
			>
				Filtros
			</button>
			<div
				// biome-ignore lint/a11y/noNoninteractiveTabindex: Required for DaisyUI dropdown
				tabIndex={0}
				className="dropdown-content z-[1] card card-compact w-72 p-2 shadow-lg bg-base-100 text-base-content border rounded-box mt-1"
			>
				<div className="card-body gap-4">
					<h3 className="font-bold text-lg border-b pb-2">
						Filtros
					</h3>

					{/* Filtro Práctica */}
					<div className="flex flex-col gap-2">
						<span className="text-sm font-bold opacity-70">
							Práctica
						</span>
						<div className="flex flex-col gap-1">
							<label className="flex items-center gap-3 cursor-pointer hover:bg-base-200 p-1 rounded-md transition-colors">
								<input
									type="checkbox"
									className="checkbox checkbox-sm checkbox-primary rounded-sm"
									checked={selectedFilters.internshipTypes.includes(
										'Práctica 1',
									)}
									onChange={() =>
										toggleFilter(
											'internshipTypes',
											'Práctica 1',
										)
									}
								/>
								<span className="text-sm">Práctica 1</span>
							</label>
							<label className="flex items-center gap-3 cursor-pointer hover:bg-base-200 p-1 rounded-md transition-colors">
								<input
									type="checkbox"
									className="checkbox checkbox-sm checkbox-primary rounded-sm"
									checked={selectedFilters.internshipTypes.includes(
										'Práctica 2',
									)}
									onChange={() =>
										toggleFilter(
											'internshipTypes',
											'Práctica 2',
										)
									}
								/>
								<span className="text-sm">Práctica 2</span>
							</label>
						</div>
					</div>

					<div className="divider my-0"></div>

					{/* Filtro Estado */}
					<div className="flex flex-col gap-2">
						<span className="text-sm font-bold opacity-70">
							Estado
						</span>
						<div className="flex flex-col gap-1">
							{[
								'En Curso',
								'Evaluación Pendiente',
								'Finalizada',
								'Aprobada',
								'No aprobada',
							].map((status) => (
								<label
									key={status}
									className="flex items-center gap-3 cursor-pointer hover:bg-base-200 p-1 rounded-md transition-colors"
								>
									<input
										type="checkbox"
										className="checkbox checkbox-sm checkbox-primary rounded-sm"
										checked={selectedFilters.statuses.includes(
											status,
										)}
										onChange={() =>
											toggleFilter('statuses', status)
										}
									/>
									<span className="text-sm">{status}</span>
								</label>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
