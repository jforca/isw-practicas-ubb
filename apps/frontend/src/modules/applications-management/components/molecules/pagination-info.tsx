interface IPaginationInfoProps {
	showing: number;
	total: number;
	limit: number;
	isLoading: boolean;
	onLimitChange: (limit: number) => void;
}

export function PaginationInfo({
	showing,
	total,
	limit,
	isLoading,
	onLimitChange,
}: IPaginationInfoProps) {
	return (
		<div className="flex items-center justify-between mb-4">
			<p className="text-sm text-base-content/60">
				{isLoading
					? 'Cargando...'
					: `Mostrando ${showing} de ${total} postulaciones`}
			</p>
			<div className="flex items-center gap-2">
				<span className="text-sm text-base-content/60">
					Mostrar:
				</span>
				<select
					className="select select-bordered select-sm"
					value={limit}
					onChange={(e) =>
						onLimitChange(Number(e.target.value))
					}
					disabled={isLoading}
				>
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={20}>20</option>
					<option value={50}>50</option>
				</select>
			</div>
		</div>
	);
}
