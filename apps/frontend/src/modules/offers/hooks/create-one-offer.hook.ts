import { useState, useCallback } from 'react';
import type { TOffer } from './find-many-offers.hook';

type TCreateOfferData = {
	title: string;
	description: string;
	deadline: string;
	status?: 'published' | 'closed' | 'filled';
	offerTypeId: number;
	internshipCenterId: number;
};

export function UseCreateOneOffer() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleCreateOne = useCallback(
		async (
			data: TCreateOfferData,
		): Promise<TOffer | null> => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(
					'/api/offers/create-one',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(data),
					},
				);

				if (!response.ok) {
					const result = await response.json();
					throw new Error(
						result.message || 'Error al crear la oferta',
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
		handleCreateOne,
		isLoading,
		error,
	};
}
