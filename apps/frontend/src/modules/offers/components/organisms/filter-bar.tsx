import { Filter } from 'lucide-react';

interface IFilterBarProps {
	selectedStatus: string;
	onStatusChange: (status: string) => void;
	selectedType: string;
	onTypeChange: (type: string) => void;
}

export function FilterBar({
	selectedStatus,
	onStatusChange,
	selectedType,
	onTypeChange,
}: IFilterBarProps) {
	return (
		<div className="card bg-base-100 border border-base-300">
			<div className="card-body p-4">
				<div className="flex items-center gap-2 mb-3">
					<Filter size={18} className="text-primary" />
					<h3 className="font-semibold text-sm">Filtros</h3>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="form-control">
						<label
							htmlFor="status-filter"
							className="label"
						>
							<span className="label-text text-xs font-medium">
								Estado
							</span>
						</label>
						<select
							id="status-filter"
							className="select select-bordered select-sm w-full"
							value={selectedStatus}
							onChange={(e) =>
								onStatusChange(e.target.value)
							}
						>
							<option value="all">Todos los estados</option>
							<option value="published">Publicadas</option>
							<option value="closed">Cerradas</option>
							<option value="filled">Cubiertas</option>
						</select>
					</div>

					<div className="form-control">
						<label htmlFor="type-filter" className="label">
							<span className="label-text text-xs font-medium">
								Tipo de Práctica
							</span>
						</label>
						<select
							id="type-filter"
							className="select select-bordered select-sm w-full"
							value={selectedType}
							onChange={(e) => onTypeChange(e.target.value)}
						>
							<option value="all">Todos los tipos</option>
							<option value="1">Práctica I</option>
							<option value="2">Práctica II</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	);
}
