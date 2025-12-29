import { useCallback, useState } from 'react';

export type TApplication = {
	id: number;
	status: 'pending' | 'approved' | 'rejected';
	// biome-ignore lint/style/useNamingConvention: backend snake_case
	created_at: string;
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

const initialPagination: TPagination = {
	total: 0,
	offset: 0,
	limit: 6,
	hasMore: false,
};

export function UseFindMyApplications() {
	const [data, setData] = useState<TApplication[]>([]);
	const [pagination, setPagination] = useState<TPagination>(
		initialPagination,
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFindMany = useCallback(
		async (offset = 0, limit = 6) => {
			setIsLoading(true);
			setError(null);

			try {
				// Obtener sesión usando el proxy
				const sessionResponse = await fetch(
					'/api/auth/get-session',
				);
				if (!sessionResponse.ok) {
					throw new Error('No estás autenticado');
				}
				const sessionData = await sessionResponse.json();
				const studentId = sessionData?.user?.id;

				if (!studentId) {
					throw new Error('No estás autenticado');
				}

				const params = new URLSearchParams({
					offset: offset.toString(),
					limit: limit.toString(),
				});

				const response = await fetch(
					`/api/applications/find-by-student/${studentId}?${params}`,
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
		[],
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
		[pagination.limit, handleFindMany],
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

	const refresh = useCallback(() => {
		handleFindMany(pagination.offset, pagination.limit);
	}, [pagination.offset, pagination.limit, handleFindMany]);

	const changeLimit = useCallback(
		(newLimit: number) => {
			handleFindMany(0, newLimit);
		},
		[handleFindMany],
	);

	return {
		data,
		pagination,
		isLoading,
		error,
		currentPage: currentPage + 1, // 1-indexed para UI
		totalPages,
		handleFindMany,
		goToPage: (page: number) => goToPage(page - 1), // convertir a 0-indexed
		nextPage,
		prevPage,
		changeLimit,
		refresh,
	};
}
