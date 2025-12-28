import { useState } from 'react';

interface ICreateReportDto {
	title: string;
	file: File;
	internshipId: number;
}

export function UseCreateReport() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createReport = async (data: ICreateReportDto) => {
		setIsLoading(true);
		setError(null);

		try {
			const formData = new FormData();
			formData.append('title', data.title);
			formData.append(
				'internshipId',
				data.internshipId.toString(),
			);
			formData.append('file', data.file);

			const response = await fetch('/api/reports/upload', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message || 'Error al subir el informe',
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
		createReport,
		isLoading,
		error,
	};
}
