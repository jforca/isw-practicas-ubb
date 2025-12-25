import { useState, useCallback } from 'react';
import type { TInternshipCenter } from '@packages/schema/internship-centers.schema';

export function UseFindOneInternshipCenter() {
	const [data, setData] =
		useState<TInternshipCenter | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFindOne = useCallback(async (id: number) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(
				`/api/internship-centers/find-one/${id}`,
			);

			if (!response.ok) {
				const errorResult = await response.json();
				throw new Error(
					errorResult.message ||
						'Error al obtener el centro de prácticas',
				);
			}

			const result = await response.json();
			setData(result.data);
			return result.data;
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: 'Error desconocido';
			setError(errorMessage);
			setData(null);
			return null;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const reset = useCallback(() => {
		setData(null);
		setError(null);
	}, []);

	return {
		data,
		isLoading,
		error,
		handleFindOne,
		reset,
	};
}
