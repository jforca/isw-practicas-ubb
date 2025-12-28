import { useState, useCallback } from 'react';
import type { TOffer } from './find-many-offers.hook';

type TUpdateOfferData = {
	title?: string;
	description?: string;
	deadline?: string;
	status?: 'published' | 'closed' | 'filled';
	offerTypeIds?: number[];
	internshipCenterId?: number;
};

export function UseUpdateOneOffer() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleUpdateOne = useCallback(
		async (
			id: number,
			data: TUpdateOfferData,
		): Promise<TOffer | null> => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(
					`/api/offers/update-one/${id}`,
					{
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(data),
					},
				);

				if (!response.ok) {
					const result = await response.json();
					throw new Error(
						result.message ||
							'Error al actualizar la oferta',
					);
				}

				const result = await response.json();
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

	return {
		handleUpdateOne,
		isLoading,
		error,
	};
}
