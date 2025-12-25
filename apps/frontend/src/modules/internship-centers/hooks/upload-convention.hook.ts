import { useState, useCallback } from 'react';
import { env } from '@lib/env';

type TUploadConventionResponse = {
	success: boolean;
	message: string;
	data?: {
		document: {
			id: number;
			fileName: string;
			mimeType: string;
			uploadedAt: string;
		};
		internshipCenter: {
			id: number;
			conventionDocumentId: number;
		};
	};
	error?: string;
};

export function useUploadConvention() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);
	const [data, setData] =
		useState<TUploadConventionResponse | null>(null);

	const handleUpload = useCallback(
		async (internshipCenterId: number, file: File) => {
			setIsLoading(true);
			setError(null);
			setIsSuccess(false);
			setData(null);

			try {
				const formData = new FormData();
				formData.append('file', file);

				const response = await fetch(
					`${env.VITE_BACKEND_URL}/api/documents/convention/${internshipCenterId}`,
					{
						method: 'POST',
						body: formData,
						credentials: 'include',
					},
				);

				const result: TUploadConventionResponse =
					await response.json();

				if (!response.ok) {
					setError(
						result.message || 'Error al subir el convenio',
					);
					return null;
				}

				setData(result);
				setIsSuccess(true);
				return result;
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
		setIsLoading(false);
		setError(null);
		setIsSuccess(false);
		setData(null);
	}, []);

	return {
		handleUpload,
		isLoading,
		error,
		isSuccess,
		data,
		reset,
	};
}
