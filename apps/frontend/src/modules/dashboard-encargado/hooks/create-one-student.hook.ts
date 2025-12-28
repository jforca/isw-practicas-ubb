import { useState, useCallback } from 'react';
import type { TStudent } from '@packages/schema/student.schema';

type TCreateStudentData = Omit<
	TStudent,
	| 'id'
	| 'createdAt'
	| 'updatedAt'
	| 'user_role'
	| 'emailverified'
	| 'image'
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
		isSuccess,
		handleCreate,
	};
}
