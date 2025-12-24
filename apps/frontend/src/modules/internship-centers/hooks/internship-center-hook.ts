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
	limit: 10,
	hasMore: false,
};

export function UseInternshipCenter() {
	const [data, setData] = useState<TInternshipCenter[]>([]);
	const [pagination, setPagination] = useState<TPagination>(
		initialPagination,
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const findMany = useCallback(
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
			findMany(
				(page - 1) * pagination.limit,
				pagination.limit,
			);
		},
		[pagination.limit, findMany],
	);

	const nextPage = useCallback(() => {
		if (pagination.hasMore) {
			findMany(
				pagination.offset + pagination.limit,
				pagination.limit,
			);
		}
	}, [pagination, findMany]);

	const prevPage = useCallback(() => {
		if (pagination.offset > 0) {
			findMany(
				Math.max(0, pagination.offset - pagination.limit),
				pagination.limit,
			);
		}
	}, [pagination, findMany]);

	const changeLimit = useCallback(
		(newLimit: number) => {
			findMany(0, newLimit);
		},
		[findMany],
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
		findMany,
		goToPage,
		nextPage,
		prevPage,
		changeLimit,
	};
}
