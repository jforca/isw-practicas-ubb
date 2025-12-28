import { useState, useCallback, useRef } from 'react';
import type { TStudent } from '@packages/schema/student.schema';

export type TPagination = {
	total: number;
	limit: number;
	page: number;
	totalPages: number;
};

export type TFilters = {
	search: string;
	internshipTypes: string[];
	statuses: string[];
};

const initialFilters: TFilters = {
	search: '',
	internshipTypes: [],
	statuses: [],
};

export function useFindManyStudents() {
	const [data, setData] = useState<TStudent[]>([]);
	const [pagination, setPagination] =
		useState<TPagination | null>(null);
	const [filters, setFilters] =
		useState<TFilters>(initialFilters);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const filtersRef = useRef<TFilters>(initialFilters);

	const handleFindMany = useCallback(
		async (
			page = 1,
			limit = 5,
			currentFilters?: TFilters,
		) => {
			setIsLoading(true);
			setError(null);
			setIsSuccess(false);

			const activeFilters =
				currentFilters ?? filtersRef.current;

			try {
				const params = new URLSearchParams({
					page: page.toString(),
					limit: limit.toString(),
				});

				if (
					activeFilters.search &&
					activeFilters.search.trim() !== ''
				) {
					params.append(
						'search',
						activeFilters.search.trim(),
					);
				}

				if (activeFilters.internshipTypes.length > 0) {
					params.append(
						'internshipTypes',
						activeFilters.internshipTypes.join(','),
					);
				}

				if (activeFilters.statuses.length > 0) {
					params.append(
						'statuses',
						activeFilters.statuses.join(','),
					);
				}

				const response = await fetch(
					`/api/students/find-many?${params.toString()}`,
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

	const updateFilters = useCallback(
		(newFilters: Partial<TFilters>) => {
			const updated = {
				...filtersRef.current,
				...newFilters,
			};
			filtersRef.current = updated;
			setFilters(updated);
			handleFindMany(1, pagination?.limit ?? 5, updated);
		},
		[handleFindMany, pagination?.limit],
	);

	return {
		data,
		pagination,
		filters,
		isLoading,
		error,
		isSuccess,
		handleFindMany,
		updateFilters,
	};
}
