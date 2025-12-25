import { useState, useCallback, useEffect } from 'react';

export type TOfferType = {
	id: number;
	name: string;
	// biome-ignore lint/style/useNamingConvention: backend snake_case
	is_active: boolean;
};

export function UseFindOfferTypes() {
	const [data, setData] = useState<TOfferType[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFindTypes = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/offers/types');

			if (!response.ok) {
				throw new Error(
					'Error al obtener los tipos de oferta',
				);
			}

			const result = await response.json();
			setData(result.data);
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
		handleFindTypes();
	}, [handleFindTypes]);

	return {
		data,
		isLoading,
		error,
		refresh: handleFindTypes,
	};
}
