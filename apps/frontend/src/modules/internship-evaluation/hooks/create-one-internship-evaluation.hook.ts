import { useState, useCallback } from 'react';

export type TCreateInternshipEvaluationData = {
	supervisorGrade: number;
	supervisorComments: string;
	reportGrade: number;
	reportComments: string;
	finalGrade: number;
	internshipId: number;
};

export type TInternshipEvaluation =
	TCreateInternshipEvaluationData & {
		id: number;
		completedAt: string;
	};

export function UseCreateOneInternshipEvaluation() {
	const [data, setData] =
		useState<TInternshipEvaluation | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleCreateOne = useCallback(
		async (
			evaluationData: TCreateInternshipEvaluationData,
		) => {
			setIsLoading(true);
			setError(null);
			setIsSuccess(false);

			try {
				const response = await fetch(
					'/api/internship-evaluations/',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(evaluationData),
					},
				);

				if (!response.ok) {
					const errorResult = await response.json();
					throw new Error(
						errorResult.message ||
							'Error al crear la evaluación de práctica',
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
		handleCreateOne,
		reset,
	};
}
