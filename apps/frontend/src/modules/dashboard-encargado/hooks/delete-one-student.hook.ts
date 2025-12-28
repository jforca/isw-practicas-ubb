import { useState, useCallback } from 'react';

export function UseDeleteStudent() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);
	const [deletedId, setDeletedId] = useState<string | null>(
		null,
	);

	const handleDelete = useCallback(async (id: string) => {
		setIsLoading(true);
		setError(null);
		setIsSuccess(false);

		try {
			const response = await fetch(
				`/api/students/delete-one/${id}`,
				{
					method: 'DELETE',
				},
			);

			if (!response.ok) {
				const text = await response.text();
				let errorResult: { message?: string };
				try {
					errorResult = JSON.parse(text);
				} catch {
					console.error('Error parsing response:', text);
					throw new Error('Error desconocido del servidor');
				}
				throw new Error(
					errorResult.message ||
						'Error al eliminar el estudiante',
				);
			}

			setDeletedId(id);
			setIsSuccess(true);
			return true;
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Sucedió un error desconocido';
			setError(errorMessage);
			return false;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const reset = useCallback(() => {
		setDeletedId(null);
		setIsSuccess(false);
		setError(null);
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
