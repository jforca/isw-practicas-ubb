import { useCallback, useState } from 'react';

type TApplicationStatus =
	| 'pending'
	| 'approved'
	| 'rejected';

type TUpdateStatusResponse = {
	id: number;
	status: TApplicationStatus;
};

export function UseUpdateApplicationStatus() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleUpdateStatus = useCallback(
		async (
			applicationId: number,
			status: TApplicationStatus,
		): Promise<TUpdateStatusResponse | null> => {
			setIsLoading(true);
			setError(null);
			setIsSuccess(false);

			try {
				const response = await fetch(
					`/api/applications/update-status/${applicationId}`,
					{
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
						},
						credentials: 'include',
						body: JSON.stringify({ status }),
					},
				);

				const result = await response.json();

				if (!response.ok) {
					setError(
						result.message ||
							'Error al actualizar el estado',
					);
					return null;
				}

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
		setError(null);
		setIsSuccess(false);
	}, []);

	return {
		isLoading,
		error,
		isSuccess,
		handleUpdateStatus,
		reset,
	};
}
