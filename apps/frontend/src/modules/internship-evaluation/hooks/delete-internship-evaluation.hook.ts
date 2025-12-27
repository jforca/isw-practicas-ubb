import { useState, useCallback } from 'react';

export function UseDeleteInternshipEvaluation() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);
	const [deletedId, setDeletedId] = useState<number | null>(
		null,
	);

	const handleDelete = useCallback(async (id: number) => {
		setIsLoading(true);
		setError(null);
		setIsSuccess(false);

		try {
			const response = await fetch(
				`/api/internship-evaluations/delete/${id}`,
				{
					method: 'DELETE',
				},
			);

			if (!response.ok) {
				const errorResult = await response.json();
				throw new Error(
					errorResult.message ||
						'Error al eliminar la evaluación de práctica',
				);
			}

			setDeletedId(id);
			setIsSuccess(true);
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
	}, []);

	const reset = useCallback(() => {
		setError(null);
		setIsSuccess(false);
		setDeletedId(null);
	}, []);

	return {
		isLoading,
		error,
		isSuccess,
		deletedId,
		handleDelete,
		reset,
	};
}
