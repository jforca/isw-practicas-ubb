import { useState, useCallback, useRef } from 'react';

export type TOffer = {
	id: number;
	title: string;
	description: string;
	deadline: string;
	status: 'published' | 'closed' | 'filled';
	offerType: {
		id: number;
		name: string;
		// biome-ignore lint/style/useNamingConvention: backend snake_case
		is_active: boolean;
	};
	internshipCenter: {
		id: number;
		// biome-ignore lint/style/useNamingConvention: backend snake_case
		legal_name: string;
		// biome-ignore lint/style/useNamingConvention: backend snake_case
		company_rut: string;
		email: string;
		phone: string;
		address: string;
	};
	createdAt: string;
	updatedAt: string;
};

export type TPagination = {
	total: number;
	offset: number;
	limit: number;
	hasMore: boolean;
};

export type TFilters = {
	search: string;
	status: 'all' | 'published' | 'closed' | 'filled';
	offerTypeId: 'all' | string;
};

const initialPagination: TPagination = {
	total: 0,
	offset: 0,
	limit: 6,
	hasMore: false,
};

const initialFilters: TFilters = {
	search: '',
	status: 'all',
	offerTypeId: 'all',
};

export function UseFindManyOffers() {
	const [data, setData] = useState<TOffer[]>([]);
	const [pagination, setPagination] = useState<TPagination>(
		initialPagination,
	);
	const [filters, setFilters] =
		useState<TFilters>(initialFilters);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const filtersRef = useRef<TFilters>(initialFilters);

	const handleFindMany = useCallback(
		async (
			offset: number,
			limit: number,
			currentFilters?: TFilters,
		) => {
			setIsLoading(true);
			setError(null);

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
					`/api/offers/find-many?${params.toString()}`,
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

	const updateFilters = useCallback(
		(newFilters: Partial<TFilters>) => {
			const updated = {
				...filtersRef.current,
				...newFilters,
			};
			filtersRef.current = updated;
			setFilters(updated);
			handleFindMany(0, pagination.limit, updated);
		},
		[handleFindMany, pagination.limit],
	);

	const currentPage =
		Math.floor(pagination.offset / pagination.limit) + 1;
	const totalPages = Math.ceil(
		pagination.total / pagination.limit,
	);

	const goToPage = useCallback(
		(page: number) => {
			const newOffset = (page - 1) * pagination.limit;
			handleFindMany(newOffset, pagination.limit);
		},
		[handleFindMany, pagination.limit],
	);

	const nextPage = useCallback(() => {
		if (pagination.hasMore) {
			goToPage(currentPage + 1);
		}
	}, [currentPage, goToPage, pagination.hasMore]);

	const prevPage = useCallback(() => {
		if (currentPage > 1) {
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
