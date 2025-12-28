import { useState, useCallback } from 'react';

export interface IStudentDetails {
	user: {
		name: string;
		rut: string;
		email: string;
		phone?: string;
	};
	student: {
		currentInternship?: string;
	};
	applications: Array<{
		id: string;
		status: string;
		// biome-ignore lint/style/useNamingConvention: Backend property
		created_at: string;
		offer?: {
			title: string;
			offerType: {
				name: string;
			};
		};
		internship?: {
			status: string;
			// biome-ignore lint/style/useNamingConvention: Backend property
			start_date: string;
			// biome-ignore lint/style/useNamingConvention: Backend property
			end_date: string;
			evaluations?: {
				supervisorGrade: number;
				reportGrade: number;
				finalGrade: number;
			};
			logbookEntries?: Array<{
				id: string;
				title: string;
				// biome-ignore lint/style/useNamingConvention: Backend property
				created_at: string;
			}>;
		};
	}>;
}

export const UseGetStudentDetails = () => {
	const [data, setData] = useState<IStudentDetails | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGetStudentDetails = useCallback(
		async (id: string) => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(
					`/api/students/details/${id}`,
				);

				if (!response.ok) {
					const errorResult = await response.json();
					throw new Error(
						errorResult.message ||
							'Error al obtener detalles del estudiante',
					);
				}

				const result = await response.json();
				setData(result.data);
				return result.data;
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
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
		data,
		isLoading,
		error,
		handleGetStudentDetails,
	};
};
