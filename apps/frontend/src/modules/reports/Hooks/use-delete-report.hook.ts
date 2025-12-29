import { useState } from 'react';

export function UseDeleteReport() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const deleteReport = async (id: number) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/reports/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message ||
						'Error al eliminar el informe',
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
		deleteReport,
		isLoading,
		error,
	};
}
