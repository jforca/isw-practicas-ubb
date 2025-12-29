import {
	useState,
	useCallback,
	useRef,
	useEffect,
} from 'react';

export type TLogbookEntry = {
	id: number;
	title: string;
	body: string;
	// biome-ignore lint/style/useNamingConvention: El backend usa snake_case
	created_at: string;
	// biome-ignore lint/style/useNamingConvention: El backend usa snake_case
	updated_at: string;
	internshipId?: number;
	internship?: {
		id: number;
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
	internshipId?: number;
};

const initialPagination: TPagination = {
	total: 0,
	offset: 0,
	limit: 10,
	hasMore: false,
};

const initialFilters: TFilters = {
	search: '',
};

export function UseFindManyLogbookEntries(
	internshipId: number,
) {
	const [data, setData] = useState<TLogbookEntry[]>([]);
	const [pagination, setPagination] = useState<TPagination>(
		initialPagination,
	);
	const [filters, setFilters] = useState<TFilters>({
		...initialFilters,
		internshipId,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const filtersRef = useRef<TFilters>({
		...initialFilters,
		internshipId,
	});

	useEffect(() => {
		setFilters((prev) => ({ ...prev, internshipId }));
		filtersRef.current.internshipId = internshipId;
	}, [internshipId]);

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
					internshipId:
						activeFilters.internshipId?.toString() || '',
				});

				if (activeFilters.search) {
					params.append('title', activeFilters.search);
				}

				const response = await fetch(
					`/api/logbook-entries/find-many?${params.toString()}`,
				);

				if (!response.ok) {
					throw new Error('Error al obtener las bitácoras');
				}

				const result = await response.json();

				if (result?.data?.data) {
					setData(result.data.data);
				} else {
					setData([]);
				}

				if (result?.data?.pagination) {
					setPagination(result.data.pagination);
				} else {
					console.warn(
						"El backend no devolvió objeto 'pagination'. Usando default.",
					);
				}
			} catch (err) {
				console.error(err);
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
