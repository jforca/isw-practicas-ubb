import { useState, useCallback } from 'react';

export type TStudent = {
	id: string;
	name: string;
	rut: string;
	email: string;
	phone?: string;
	userRole: 'student';
	createdAt: string;
	updatedAt: string;
};

type TCreateStudentData = Omit<
	TStudent,
	'id' | 'createdAt' | 'updatedAt' | 'userRole'
>;

export function UseCreateStudent() {
	const [data, setData] = useState<TStudent | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleCreate = useCallback(
		async (studentData: TCreateStudentData) => {
			setIsLoading(true);
			setError(null);
			setIsSuccess(false);

			try {
				const response = await fetch(
					'/api/students/create-one',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(studentData),
					},
				);

				const result = await response.json();

				if (!response.ok) {
					throw new Error(
						result.message ||
							'Error al crear el estudiante',
					);
				}

				setData(result.data);
				setIsSuccess(true);
				return result.payload;
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
		isSuccess,
		handleCreate,
	};
}
