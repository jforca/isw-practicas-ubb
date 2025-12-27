import { useState, useCallback } from 'react';
import type { TStudent } from '@packages/schema/student.schema';

export const UseFindOneStudent = () => {
	const [data, setData] = useState<TStudent | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleFindOneStudent = useCallback(
		async (id: string) => {
			setIsLoading(true);
			setError(null);
			setIsSuccess(false);

			try {
				const response = await fetch(
					`/api/students/find-one/${id}`,
				);

				if (!response.ok) {
					const errorResult = await response.json();
					throw new Error(
						errorResult.message ||
							'Error al obtener el estudiante',
					);
				}

				const result = await response.json();
				setData(result.payload);
				setIsSuccess(true);
				return result.payload;
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
						: 'Se produjo un error desconocido al buscar el usuario';
				setError(errorMessage);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	const reset = useCallback(() => {
		setData(null);
		setError(null);
		setIsSuccess(false);
	}, []);

	return {
		data,
		isLoading,
		error,
		isSuccess,
		handleFindOneStudent,
		reset,
	};
};
