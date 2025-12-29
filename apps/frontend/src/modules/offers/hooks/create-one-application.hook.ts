import { useCallback, useState } from 'react';

type TApplicationResponse = {
	id: number;
	status: string;
	createdAt: string;
};

type TCreateApplicationError = {
	type:
		| 'OFFER_NOT_FOUND'
		| 'OFFER_NOT_AVAILABLE'
		| 'ACTIVE_INTERNSHIP_EXISTS'
		| 'ACADEMIC_REQUIREMENTS_NOT_MET'
		| 'DUPLICATE_APPLICATION'
		| 'UNKNOWN';
	message: string;
	details: string;
};

type TCreateApplicationParams = {
	offerId: number;
	cvFile: File;
	motivationLetter?: File;
};

export function UseCreateOneApplication() {
	const [data, setData] =
		useState<TApplicationResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] =
		useState<TCreateApplicationError | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleCreateOne = useCallback(
		async ({
			offerId,
			cvFile,
			motivationLetter,
		}: TCreateApplicationParams) => {
			setIsLoading(true);
			setError(null);
			setIsSuccess(false);

			try {
				const formData = new FormData();
				formData.append('offerId', offerId.toString());
				formData.append('cv', cvFile);

				if (motivationLetter) {
					formData.append(
						'motivationLetter',
						motivationLetter,
					);
				}

				const response = await fetch(
					'/api/applications/create-one',
					{
						method: 'POST',
						credentials: 'include',
						body: formData,
					},
				);

				const result = await response.json();

				if (!response.ok) {
					const errorType = mapErrorType(result.message);
					setError({
						type: errorType,
						message: result.message || 'Error al postular',
						details:
							result.details ||
							'Ha ocurrido un error inesperado',
					});
					return null;
				}

				setData(result.data);
				setIsSuccess(true);
				return result.data;
			} catch (err) {
				setError({
					type: 'UNKNOWN',
					message: 'Error de conexión',
					details:
						err instanceof Error
							? err.message
							: 'Error desconocido',
				});
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

function mapErrorType(
	message: string,
): TCreateApplicationError['type'] {
	if (message?.includes('no encontrada'))
		return 'OFFER_NOT_FOUND';
	if (message?.includes('no disponible'))
		return 'OFFER_NOT_AVAILABLE';
	if (message?.includes('práctica activa'))
		return 'ACTIVE_INTERNSHIP_EXISTS';
	if (message?.includes('requisitos'))
		return 'ACADEMIC_REQUIREMENTS_NOT_MET';
	if (message?.includes('duplicada'))
		return 'DUPLICATE_APPLICATION';
	return 'UNKNOWN';
}

export type {
	TApplicationResponse,
	TCreateApplicationError,
};
