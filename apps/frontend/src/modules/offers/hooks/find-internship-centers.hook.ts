import { useState, useCallback, useEffect } from 'react';

export type TInternshipCenterOption = {
	id: number;
	// biome-ignore lint/style/useNamingConvention: backend snake_case
	legal_name: string;
	// biome-ignore lint/style/useNamingConvention: backend snake_case
	company_rut: string;
};

export function UseFindInternshipCenters() {
	const [data, setData] = useState<
		TInternshipCenterOption[]
	>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFindCenters = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(
				'/api/internship-centers/find-many?limit=100',
			);

			if (!response.ok) {
				throw new Error(
					'Error al obtener los centros de práctica',
				);
			}

			const result = await response.json();
			setData(result.data.data);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Error desconocido',
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		handleFindCenters();
	}, [handleFindCenters]);

	return {
		data,
		isLoading,
		error,
		refresh: handleFindCenters,
	};
}
