import { useState } from 'react';

export function UseDeleteLogbookEntry() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const deleteEntry = async (id: number) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(
				`/api/logbook-entries/${id}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message ||
						'Error al eliminar la bitácora',
				);
			}

			return true;
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Error desconocido',
			);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		deleteEntry,
		isLoading,
		error,
	};
}
