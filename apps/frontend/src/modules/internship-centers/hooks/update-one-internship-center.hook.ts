import { useState, useCallback } from 'react';
import type { TInternshipCenter } from '@packages/schema/internship-centers.schema';

type TUpdateInternshipCenterData = Partial<
	Omit<TInternshipCenter, 'id' | 'createdAt' | 'updatedAt'>
>;

export function UseUpdateOneInternshipCenter() {
	const [data, setData] =
		useState<TInternshipCenter | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleUpdateOne = useCallback(
		async (
			id: number,
			updateData: TUpdateInternshipCenterData,
		) => {
			setIsLoading(true);
			setError(null);
			setIsSuccess(false);

			try {
				const response = await fetch(
					`/api/internship-centers/update-one/${id}`,
					{
						method: 'PUT',
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
							'Error al actualizar el centro de prácticas',
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
