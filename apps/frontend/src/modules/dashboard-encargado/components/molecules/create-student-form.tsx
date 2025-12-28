import { useState, useEffect } from 'react';
import {
	ChileanNumberRegex,
	ChileanRUTRegex,
} from '@packages/utils/regex.utils';
import { UseCreateStudent } from '@modules/dashboard-encargado/hooks/create-one-student.hook';
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
}

export function CreateStudentForm({
	onSuccess,
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

	const { handleCreate, isLoading, error } =
		UseCreateStudent();

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
		switch (field) {
			case 'rut':
				if (!value) return 'El RUT es obligatorio';
				if (!ChileanRUTRegex.test(value.replace(/\./g, '')))
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
				if (!value) return 'El correo es obligatorio';
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
					return 'Correo inválido (ej: correo@ejemplo.com)';
				return null;
			case 'name': {
				if (!value) return 'El nombre es obligatorio';
				// Validar que solo contenga letras, espacios y acentos
				const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
				if (!nameRegex.test(value)) {
					return 'El nombre solo puede contener letras y espacios';
				}
				// Validar que tenga al menos 2 caracteres
				if (value.trim().length < 2) {
					return 'El nombre debe tener al menos 2 caracteres';
				}
				return null;
			}
			case 'currentInternship':
				if (!value) return 'Este campo es obligatorio';
				return null;
			default:
				if (!value) return 'Este campo es obligatorio';
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

		const result = await handleCreate(studentData);

		if (result) {
			setCreateForm({
				name: '',
				email: '',
				rut: '',
				phone: '',
				currentInternship: StudentInternship.practica1,
			});
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
					) : (
						'Crear Estudiante'
					)}
				</button>
			</div>
		</form>
	);
}
