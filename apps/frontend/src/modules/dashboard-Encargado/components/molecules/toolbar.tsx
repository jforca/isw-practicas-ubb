import { SearchInput } from '@modules/dashboard-Encargado/components/atoms/search-input';

export function Toolbar() {
	return (
		<div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
			<div className="flex gap-3 items-center w-full">
				<SearchInput placeholder="Buscar por nombre, RUT, carrera..." />

				<span className="text-sm text-base-content/70">
					Todos
				</span>
			</div>

			<div className="flex items-center gap-3 self-end lg:self-auto text-sm pr-2 lg:pr-20">
				<button
					type="button"
					className="btn btn-sm bg-blue-400"
				>
					Nuevo alumno
				</button>
				<button
					type="button"
					className="btn btn-sm bg-blue-300"
				>
					Exportar CSV
				</button>
			</div>
		</div>
	);
}
