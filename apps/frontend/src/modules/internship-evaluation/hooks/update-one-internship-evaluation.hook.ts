import { useState, useCallback } from 'react';
import type { TInternshipEvaluation } from './create-one-internship-evaluation.hook';

type TUpdateInternshipEvaluationData = Partial<
	Omit<TInternshipEvaluation, 'id'>
>;

export function UseUpdateOneInternshipEvaluation() {
	const [data, setData] =
		useState<TInternshipEvaluation | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleUpdateOne = useCallback(
		async (
			id: number,
			updateData: TUpdateInternshipEvaluationData,
		) => {
			setIsLoading(true);
			setError(null);
			setIsSuccess(false);

			try {
				const response = await fetch(
					`/api/internship-evaluations/update/${id}`,
					{
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(updateData),
					},
				);

				if (!response.ok) {
					const errorResult = await response.json();
					throw new Error(
						errorResult.message ||
							'Error al actualizar la evaluación de práctica',
					);
				}

				const result = await response.json();
				setData(result.data);
				setIsSuccess(true);
				return result.data;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: 'Error desconocido';
				setError(errorMessage);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	const reset = useCallback(() => {
		setData(null);
		setError(null);
		setIsSuccess(false);
	}, []);

	return {
		data,
		isLoading,
		error,
		isSuccess,
		handleUpdateOne,
		reset,
	};
}
