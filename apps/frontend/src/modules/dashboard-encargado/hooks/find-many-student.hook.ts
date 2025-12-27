import { useState, useCallback } from 'react';
import type { TStudent } from '@packages/schema/student.schema';

export type TPagination = {
	total: number;
	limit: number;
	page: number;
	totalPages: number;
};

export function useFindManyStudents() {
	const [data, setData] = useState<TStudent[]>([]);
	const [pagination, setPagination] =
		useState<TPagination | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleFindMany = useCallback(
		async (page = 1, limit = 5) => {
			setIsLoading(true);
			setError(null);
			setIsSuccess(false);

			try {
				const response = await fetch(
					`/api/students/find-many?page=${page}&limit=${limit}`,
				);

				const result = await response.json();

				if (!response.ok) {
					throw new Error(
						result.message ||
							'Error al Cargar a los Estudiantes',
					);
				}

				setData(result.payload);
				setPagination(result.pagination);
				setIsSuccess(true);

				return result;
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
						: 'Error Desconocido al Cargar a los Estudiantes';
				setError(errorMessage);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	return {
		data,
		pagination,
		isLoading,
		error,
		isSuccess,
		handleFindMany,
	};
}
