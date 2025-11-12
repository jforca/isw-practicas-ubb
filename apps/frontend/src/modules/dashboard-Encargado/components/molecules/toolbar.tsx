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

			<div className="flex items-center gap-3 self-end lg:self-auto text-sm">
				<span className="link link-hover">
					Nuevo alumno
				</span>
				<span className="link link-hover">
					Exportar CSV
				</span>
			</div>
		</div>
	);
}
