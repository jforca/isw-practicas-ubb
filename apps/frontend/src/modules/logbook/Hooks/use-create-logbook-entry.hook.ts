import { useState } from 'react';

interface ICreateLogbookDto {
	title: string;
	content: string;
	internshipId: number;
}

export function UseCreateLogbookEntry() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createEntry = async (data: ICreateLogbookDto) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(
				'/api/logbook-entries/create-one',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message || 'Error al crear la bitácora',
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
		createEntry,
		isLoading,
		error,
	};
}
