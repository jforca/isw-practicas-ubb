export function ErrorState({
	message,
	onRetry,
}: {
	message: string;
	onRetry: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center py-12">
			<p className="text-error text-lg font-medium">
				{message}
			</p>
			<button
				type="button"
				className="btn btn-primary mt-4"
				onClick={onRetry}
			>
				Reintentar
			</button>
		</div>
	);
}
