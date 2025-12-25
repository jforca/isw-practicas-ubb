import { useState, useCallback } from 'react';

export function UseDeleteOffer() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleDelete = useCallback(
		async (id: number): Promise<boolean> => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(
					`/api/offers/delete-one/${id}`,
					{
						method: 'DELETE',
					},
				);

				if (!response.ok) {
					const result = await response.json();
					throw new Error(
						result.message || 'Error al eliminar la oferta',
					);
				}

				return true;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: 'Error desconocido';
				setError(errorMessage);
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	return {
		handleDelete,
		isLoading,
		error,
	};
}
