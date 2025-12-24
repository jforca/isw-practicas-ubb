import { useState, useCallback } from 'react';
import type { TInternshipCenter } from '@packages/schema/internship-centers.schema';

export type TPagination = {
	total: number;
	offset: number;
	limit: number;
	hasMore: boolean;
};

const initialPagination: TPagination = {
	total: 0,
	offset: 0,
	limit: 5,
	hasMore: false,
};

export function UseFindManyInternshipCenter() {
	const [data, setData] = useState<TInternshipCenter[]>([]);
	const [pagination, setPagination] = useState<TPagination>(
		initialPagination,
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFindMany = useCallback(
		async (offset: number, limit: number) => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(
					`/api/internship-centers/find-many?offset=${offset}&limit=${limit}`,
				);

				if (!response.ok) {
					throw new Error('Error al obtener los datos');
				}

				const result = await response.json();
				setData(result.data.data);
				setPagination(result.data.pagination);
			} catch (err) {
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

	const goToPage = useCallback(
		(page: number) => {
			handleFindMany(
				(page - 1) * pagination.limit,
				pagination.limit,
			);
		},
		[pagination.limit, handleFindMany],
	);

	const nextPage = useCallback(() => {
		if (pagination.hasMore) {
			handleFindMany(
				pagination.offset + pagination.limit,
				pagination.limit,
			);
		}
	}, [pagination, handleFindMany]);

	const prevPage = useCallback(() => {
		if (pagination.offset > 0) {
			handleFindMany(
				Math.max(0, pagination.offset - pagination.limit),
				pagination.limit,
			);
		}
	}, [pagination, handleFindMany]);

	const changeLimit = useCallback(
		(newLimit: number) => {
			handleFindMany(0, newLimit);
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
		isLoading,
		error,
		currentPage,
		totalPages,
		handleFindMany,
		goToPage,
		nextPage,
		prevPage,
		changeLimit,
	};
}
