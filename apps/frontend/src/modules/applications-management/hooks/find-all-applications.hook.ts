import { useCallback, useState } from 'react';

export type TApplicationManagement = {
	id: number;
	status: 'pending' | 'approved' | 'rejected';
	// biome-ignore lint/style/useNamingConvention: backend snake_case
	created_at: string;
	student: {
		id: string;
		name: string;
		email: string;
	};
	offer: {
		id: number;
		title: string;
		description: string;
		deadline: string;
		internshipCenter: {
			id: number;
			// biome-ignore lint/style/useNamingConvention: backend snake_case
			legal_name: string;
		};
		offerTypes?: {
			id: number;
			name: string;
		}[];
	};
};

export type TPagination = {
	total: number;
	offset: number;
	limit: number;
	hasMore: boolean;
};

export type TFilters = {
	search: string;
	status: 'all' | 'pending' | 'approved' | 'rejected';
	offerTypeId: string;
};

const initialPagination: TPagination = {
	total: 0,
	offset: 0,
	limit: 10,
	hasMore: false,
};

const initialFilters: TFilters = {
	search: '',
	status: 'all',
	offerTypeId: 'all',
};

export function UseFindAllApplications() {
	const [data, setData] = useState<
		TApplicationManagement[]
	>([]);
	const [pagination, setPagination] = useState<TPagination>(
		initialPagination,
	);
	const [filters, setFilters] =
		useState<TFilters>(initialFilters);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFindMany = useCallback(
		async (
			offset = 0,
			limit = 10,
			currentFilters?: TFilters,
		) => {
			setIsLoading(true);
			setError(null);

			const activeFilters = currentFilters ?? filters;

			try {
				const params = new URLSearchParams({
					offset: offset.toString(),
					limit: limit.toString(),
				});

				if (activeFilters.search) {
					params.append('search', activeFilters.search);
				}
				if (activeFilters.status !== 'all') {
					params.append('status', activeFilters.status);
				}
				if (activeFilters.offerTypeId !== 'all') {
					params.append(
						'offerTypeId',
						activeFilters.offerTypeId,
					);
				}

				const response = await fetch(
					`/api/applications/find-many?${params}`,
					{
						credentials: 'include',
					},
				);

				if (!response.ok) {
					throw new Error('Error al obtener postulaciones');
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
		[filters],
	);

	const updateFilters = useCallback(
		(newFilters: Partial<TFilters>) => {
			const updatedFilters = { ...filters, ...newFilters };
			setFilters(updatedFilters);
			handleFindMany(0, pagination.limit, updatedFilters);
		},
		[filters, handleFindMany, pagination.limit],
	);

	const currentPage = Math.floor(
		pagination.offset / pagination.limit,
	);
	const totalPages = Math.ceil(
		pagination.total / pagination.limit,
	);

	const goToPage = useCallback(
		(page: number) => {
			const newOffset = page * pagination.limit;
			handleFindMany(newOffset, pagination.limit);
		},
		[handleFindMany, pagination.limit],
	);

	const nextPage = useCallback(() => {
		if (pagination.hasMore) {
			goToPage(currentPage + 1);
		}
	}, [pagination.hasMore, currentPage, goToPage]);

	const prevPage = useCallback(() => {
		if (currentPage > 0) {
			goToPage(currentPage - 1);
		}
	}, [currentPage, goToPage]);

	const changeLimit = useCallback(
		(newLimit: number) => {
			handleFindMany(0, newLimit);
		},
		[handleFindMany],
	);

	const refresh = useCallback(() => {
		handleFindMany(pagination.offset, pagination.limit);
	}, [handleFindMany, pagination.offset, pagination.limit]);

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
		refresh,
	};
}
