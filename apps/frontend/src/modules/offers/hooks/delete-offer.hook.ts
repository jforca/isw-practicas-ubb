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
					// Tipar la respuesta de error del backend
					const result = (await response.json()) as {
						message?: string;
						errorDetails?: string;
					};
					const message =
						result.errorDetails ||
						result.message ||
						'Error al eliminar la oferta';
					throw new Error(message);
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
