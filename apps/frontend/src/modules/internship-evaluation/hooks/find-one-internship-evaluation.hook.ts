import { useState, useCallback } from 'react';
import type { TInternshipEvaluation } from './create-one-internship-evaluation.hook';

export function UseFindOneInternshipEvaluation() {
	const [data, setData] =
		useState<TInternshipEvaluation | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFindOne = useCallback(async (id: number) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(
				`/api/internship-evaluations/find-one/${id}`,
			);

			if (!response.ok) {
				const errorResult = await response.json();
				throw new Error(
					errorResult.message ||
						'Error al obtener la evaluación de práctica',
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
