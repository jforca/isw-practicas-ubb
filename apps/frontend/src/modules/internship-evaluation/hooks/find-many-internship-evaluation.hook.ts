import { useState, useCallback, useRef } from 'react';
import type { TInternshipEvaluation } from './create-one-internship-evaluation.hook';

export type TPagination = {
	total: number;
	offset: number;
	limit: number;
	hasMore: boolean;
};

export type TFilters = {
	search: string;
};

const initialPagination: TPagination = {
	total: 0,
	offset: 0,
	limit: 5,
	hasMore: false,
};

const initialFilters: TFilters = {
	search: '',
};

export function UseFindManyInternshipEvaluation() {
	const [data, setData] = useState<TInternshipEvaluation[]>(
		[],
	);
	const [pagination, setPagination] = useState<TPagination>(
		initialPagination,
	);
	const [filters, setFilters] =
		useState<TFilters>(initialFilters);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Ref para mantener los filtros actuales
	const filtersRef = useRef<TFilters>(initialFilters);

	const handleFindMany = useCallback(
		async (
			offset: number,
			limit: number,
			currentFilters?: TFilters,
		) => {
			setIsLoading(true);
			setError(null);

			// Usar los filtros pasados o los del ref
			const activeFilters =
				currentFilters ?? filtersRef.current;

			try {
				const params = new URLSearchParams({
					offset: offset.toString(),
					limit: limit.toString(),
				});

				if (activeFilters.search) {
					params.append('search', activeFilters.search);
				}

				const response = await fetch(
					`/api/internship-evaluations/find-many?${params.toString()}`,
				);

				if (!response.ok) {
					throw new Error('Error al obtener los datos');
				}

				const result = await response.json();
				console.log('API Response:', result);
				setData(result.data.data);
				setPagination(result.data.pagination);
			} catch (err) {
				console.error('Fetch error:', err);
				setError(
					err instanceof Error
						? err.message
						: 'Error desconocido',
				);
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
			// Volver a la primera página con los nuevos filtros
			handleFindMany(0, pagination.limit, updated);
		},
		[handleFindMany, pagination.limit],
	);

	const goToPage = useCallback(
		(page: number) => {
			handleFindMany(
				(page - 1) * pagination.limit,
				pagination.limit,
				filtersRef.current,
			);
		},
		[pagination.limit, handleFindMany],
	);

	const nextPage = useCallback(() => {
		if (pagination.hasMore) {
			handleFindMany(
				pagination.offset + pagination.limit,
				pagination.limit,
				filtersRef.current,
			);
		}
	}, [pagination, handleFindMany]);

	const prevPage = useCallback(() => {
		if (pagination.offset > 0) {
			handleFindMany(
				Math.max(0, pagination.offset - pagination.limit),
				pagination.limit,
				filtersRef.current,
			);
		}
	}, [pagination, handleFindMany]);

	const changeLimit = useCallback(
		(newLimit: number) => {
			handleFindMany(0, newLimit, filtersRef.current);
		},
		[handleFindMany],
	);

	const currentPage =
		Math.floor(pagination.offset / pagination.limit) + 1;
	const totalPages = Math.ceil(
		pagination.total / pagination.limit,
	);

	return {
		data,
		pagination,
		filters,
		isLoading,
		error,
		currentPage,
		totalPages,
		handleFindMany,
		updateFilters,
		goToPage,
		nextPage,
		prevPage,
		changeLimit,
	};
}
