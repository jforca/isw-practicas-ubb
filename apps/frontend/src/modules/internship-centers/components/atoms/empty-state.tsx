export function EmptyState({
	message = 'No se encontraron resultados',
}: {
	message?: string;
}) {
	return (
		<div className="flex flex-col items-center justify-center py-12">
			<p className="text-base-content/60 text-lg">
				{message}
			</p>
		</div>
	);
}
