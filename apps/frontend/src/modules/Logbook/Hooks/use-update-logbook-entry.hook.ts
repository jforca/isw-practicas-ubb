import { useState } from 'react';

interface IUpdateLogbookDto {
	title: string;
	body: string;
}

export function UseUpdateLogbookEntry() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const updateEntry = async (
		id: number,
		data: IUpdateLogbookDto,
	) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(
				`/api/logbook-entries/${id}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message ||
						'Error al actualizar la bitácora',
				);
			}

			return true;
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Error desconocido',
			);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		updateEntry,
		isLoading,
		error,
	};
}
