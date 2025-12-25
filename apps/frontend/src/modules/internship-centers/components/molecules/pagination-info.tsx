type TPaginationInfoProps = {
	showing: number;
	total: number;
	limit: number;
	isLoading: boolean;
	onLimitChange: (limit: number) => void;
};

export function PaginationInfo({
	showing,
	total,
	limit,
	isLoading,
	onLimitChange,
}: TPaginationInfoProps) {
	return (
		<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
			<p className="paragraph-1 text-base-content/60">
				Mostrando{' '}
				<span className="text-primary font-bold">
					{showing}
				</span>{' '}
				de{' '}
				<span className="text-primary font-bold">
					{total}
				</span>{' '}
				centros de prácticas
			</p>

			<div className="flex items-center gap-2">
				<label
					htmlFor="limit-select"
					className="text-sm text-base-content/60"
				>
					Por página:
				</label>
				<select
					id="limit-select"
					className="select select-sm select-bordered"
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
