import { useState, useEffect } from 'react';
import {
	ChileanNumberRegex,
	ChileanRUTRegex,
} from '@packages/utils/regex.utils';
import { UseCreateStudent } from '@modules/dashboard-encargado/hooks/create-one-student.hook';
import { UseFindOneStudent } from '@modules/dashboard-encargado/hooks/find-one-student.hook';
import { UseUpdateOneStudent } from '@modules/dashboard-encargado/hooks/update-one-student.hook';

import {
	User,
	Mail,
	Phone,
	Loader2,
	Briefcase,
} from 'lucide-react';
import { StudentInternship } from '@packages/schema/student.schema';

type TCreateForm = {
	name: string;
	email: string;
	rut: string;
	phone: string;
	currentInternship: string;
};

interface ICreateStudentFormProps {
	onSuccess?: () => void;
	studentId?: string;
}

export function CreateStudentForm({
	onSuccess,
	studentId,
}: ICreateStudentFormProps) {
	const [createForm, setCreateForm] = useState<TCreateForm>(
		{
			name: '',
			email: '',
			rut: '',
			phone: '',
			currentInternship: StudentInternship.practica1,
		},
	);
	const [createErrors, setCreateErrors] = useState<
		Record<keyof TCreateForm, string | null>
	>({} as Record<keyof TCreateForm, string | null>);

	const {
		handleCreate,
		isLoading: isCreating,
		error: createError,
	} = UseCreateStudent();

	const {
		handleUpdateOne,
		isLoading: isUpdating,
		error: updateError,
	} = UseUpdateOneStudent();

	const { handleFindOneStudent, isLoading: isLoadingData } =
		UseFindOneStudent();

	const isLoading =
		isCreating || isUpdating || isLoadingData;
	const error = createError || updateError;

	useEffect(() => {
		if (studentId) {
			const loadStudent = async () => {
				const student =
					await handleFindOneStudent(studentId);
				if (student) {
					setCreateForm({
						name: student.name,
						email: student.email,
						rut: student.rut,
						phone: student.phone || '',
						currentInternship:
							student.currentInternship ||
							StudentInternship.practica1,
					});
				}
			};
			loadStudent();
		}
	}, [studentId, handleFindOneStudent]);

	useEffect(() => {
		if (error) {
			setCreateErrors((prev) => ({
				...prev,
				email: error,
			}));
		}
	}, [error]);

	const handleInputChange = (
		field: keyof TCreateForm,
		value: string,
	) => {
		setCreateForm((prev) => ({ ...prev, [field]: value }));
		setCreateErrors((prev) => ({
			...prev,
			[field]: validateField(field, value),
		}));
	};

	const validateField = (
		field: keyof TCreateForm,
		value: string,
	) => {
		// En modo edición, si está vacío, no hay error (se ignora el campo)
		if (studentId && !value) return null;

		switch (field) {
			case 'rut':
				if (!studentId && !value)
					return 'El RUT es obligatorio';
				if (
					value &&
					!ChileanRUTRegex.test(value.replace(/\./g, ''))
				)
					return 'RUT inválido (ej: 12.345.678-9)';
				return null;
			case 'phone':
				if (
					value &&
					!ChileanNumberRegex.test(
						value.replace(/\s+/g, ''),
					)
				)
					return 'Teléfono inválido (ej: +56 9 1234 5678)';
				return null;
			case 'email':
				if (!studentId && !value)
					return 'El correo es obligatorio';
				if (
					value &&
					!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
				)
					return 'Correo inválido (ej: correo@ejemplo.com)';
				return null;
			case 'name': {
				if (!studentId && !value)
					return 'El nombre es obligatorio';
				if (value) {
					// Validar que solo contenga letras, espacios y acentos
					const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
					if (!nameRegex.test(value)) {
						return 'El nombre solo puede contener letras y espacios';
					}
					// Validar que tenga al menos 2 caracteres
					if (value.trim().length < 2) {
						return 'El nombre debe tener al menos 2 caracteres';
					}
				}
				return null;
			}
			case 'currentInternship':
				if (!studentId && !value)
					return 'Este campo es obligatorio';
				return null;
			default:
				if (!studentId && !value)
					return 'Este campo es obligatorio';
				return null;
		}
	};

	const isCreateFormValid = () => {
		const fields = Object.keys(createForm) as Array<
			keyof TCreateForm
		>;
		let valid = true;
		const nextErrors: Record<
			keyof TCreateForm,
			string | null
		> = {} as Record<keyof TCreateForm, string | null>;

		for (const f of fields) {
			const err = validateField(f, createForm[f] ?? '');
			nextErrors[f] = err;

			if (err && f !== 'phone') valid = false;
		}

		setCreateErrors(nextErrors);
		return valid;
	};

	const getInputClass = (field: keyof TCreateForm) => {
		const base = 'input w-full rounded-lg';
		const err = createErrors[field];

		if (err) return `${base} input-error`;
		if (createForm[field]) return `${base} input-success`;
		return base;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isCreateFormValid()) return;

		const studentData = {
			name: createForm.name,
			email: createForm.email,
			rut: createForm.rut.replace(/\./g, ''),
			phone: createForm.phone
				? createForm.phone.replace(/\s+/g, '')
				: null,
			currentInternship: createForm.currentInternship,
		};

		let result: unknown;
		if (studentId) {
			// MODO EDICIÓN: Filtrar campos vacíos si es necesario o enviar todo
			// Para simplificar, enviamos lo que hay en el form, el backend (PATCH) actualizará lo que llegue.
			// Pero ojo: si el usuario borró un campo obligatorio y lo dejó vacío, validateField lo permitió (si así lo configuramos),
			// pero aquí podríamos querer filtrar los vacíos para no enviar strings vacíos al backend si no es la intención.
			// En este caso, como precargamos los datos, el form tiene los datos actuales. Si el usuario edita, tiene el nuevo valor.
			result = await handleUpdateOne(
				studentData,
				studentId,
			);
		} else {
			// MODO CREACIÓN
			result = await handleCreate(studentData);
		}

		if (result) {
			if (!studentId) {
				setCreateForm({
					name: '',
					email: '',
					rut: '',
					phone: '',
					currentInternship: StudentInternship.practica1,
				});
			}
			setCreateErrors(
				{} as Record<keyof TCreateForm, string | null>,
			);

			onSuccess?.();
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4"
		>
			{error && (
				<div className="alert alert-error">
					<span>{error}</span>
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="flex flex-col gap-2">
					<h4>
						<User size={18} className="inline mr-2" />
						Nombre Completo *
					</h4>
					<input
						type="text"
						value={createForm.name}
						onChange={(e) =>
							handleInputChange('name', e.target.value)
						}
						className={getInputClass('name')}
						disabled={isLoading}
						placeholder="Juan Pérez"
					/>
					{createErrors.name && (
						<label className="label">
							<span className="label-text-alt text-error">
								{createErrors.name}
							</span>
						</label>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<h4>
						<User size={18} className="inline mr-2" />
						RUT *
					</h4>
					<input
						type="text"
						value={createForm.rut}
						onChange={(e) =>
							handleInputChange('rut', e.target.value)
						}
						className={getInputClass('rut')}
						disabled={isLoading}
						placeholder="12.345.678-9"
					/>
					{createErrors.rut && (
						<label className="label">
							<span className="label-text-alt text-error">
								{createErrors.rut}
							</span>
						</label>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<h4>
						<Mail size={18} className="inline mr-2" />
						Correo Electrónico *
					</h4>
					<input
						type="email"
						value={createForm.email}
						onChange={(e) =>
							handleInputChange('email', e.target.value)
						}
						className={getInputClass('email')}
						disabled={isLoading}
						placeholder="correo@ejemplo.com"
					/>
					{createErrors.email && (
						<label className="label">
							<span className="label-text-alt text-error">
								{createErrors.email}
							</span>
						</label>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<h4>
						<Phone size={18} className="inline mr-2" />
						Teléfono
					</h4>
					<input
						type="tel"
						value={createForm.phone}
						onChange={(e) =>
							handleInputChange('phone', e.target.value)
						}
						className={getInputClass('phone')}
						disabled={isLoading}
						placeholder="+56 9 1234 5678"
					/>
					{createErrors.phone && (
						<label className="label">
							<span className="label-text-alt text-error">
								{createErrors.phone}
							</span>
						</label>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<h4>
						<Briefcase size={18} className="inline mr-2" />
						Práctica Actual
					</h4>
					<select
						value={createForm.currentInternship}
						onChange={(e) =>
							handleInputChange(
								'currentInternship',
								e.target.value,
							)
						}
						className="select select-bordered w-full"
						disabled={isLoading}
					>
						{Object.values(StudentInternship).map(
							(value) => (
								<option key={value} value={value}>
									{value}
								</option>
							),
						)}
					</select>
				</div>
			</div>

			<div className="flex justify-end gap-3 mt-4">
				<button
					type="submit"
					className="btn btn-primary"
					disabled={isLoading} // Deshabilitado mientras carga
				>
					{isLoading ? (
						<>
							<Loader2 className="animate-spin" size={18} />
							Creando...
						</>
					) : studentId ? (
						'Guardar Cambios'
					) : (
						'Crear Estudiante'
					)}
				</button>
			</div>
		</form>
	);
}
