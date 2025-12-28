import { useCallback, useState } from 'react';

type TEvaluationType = 'SUPERVISOR' | 'REPORT';

export type TEvaluationResponse = {
	id: number;
	selectedValue: string;
	comment: string | null;
	numericValue: number;
	score: number;
	item: {
		id: number;
		label: string;
		section: string | null;
		order: number;
		evaluationType: TEvaluationType;
	};
};

export function UseFindEvaluationResponses() {
	const [data, setData] = useState<TEvaluationResponse[]>(
		[],
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFindResponses = useCallback(
		async (evaluationId: number) => {
			setIsLoading(true);
			setError(null);
			try {
				const res = await fetch(
					`/api/internship-evaluations/find-one/${evaluationId}/responses`,
				);
				if (!res.ok) {
					const errorResult = await res.json();
					throw new Error(
						errorResult.message ||
							'Error al obtener las respuestas guardadas',
					);
				}
				const result = await res.json();
				const list = Array.isArray(result.data)
					? (result.data as TEvaluationResponse[])
					: [];
				setData(list);
				return list;
			} catch (err) {
				const msg =
					err instanceof Error
						? err.message
						: 'Error desconocido';
				setError(msg);
				setData([]);
				return [] as TEvaluationResponse[];
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	return {
		data,
		isLoading,
		error,
		handleFindResponses,
	};
}
