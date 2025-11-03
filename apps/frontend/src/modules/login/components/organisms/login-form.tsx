import { useId, useState, type FormEvent } from 'react';
import {
	Mail,
	LockKeyhole,
	Eye,
	EyeOff,
} from 'lucide-react';

export function LoginForm() {
	const id = useId();

	const [passwordVisible, setPasswordVisible] =
		useState(false);

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
	};

	return (
		<form onSubmit={handleSubmit}>
			<fieldset className="fieldset rounded-box w-sm p-4 gap-2">
				{/* Titulos*/}
				<h3 className="text-4xl font-semibold text-center">
					Bienvenido
				</h3>
				<p className="text-base text-base-content/60 text-center">
					Por favor ingresa tu correo y contraseña para
					iniciar sesión.
				</p>

				{/* Correo */}
				<label
					className="label text-sm"
					htmlFor={`email-${id}`}
				>
					Correo
				</label>
				<div className="relative">
					<label htmlFor={`email-${id}`}>
						<Mail
							size={20}
							strokeWidth={1}
							className="absolute left-3 top-2.5 text-base-content/60 z-10"
						/>
					</label>
					<input
						type="email"
						className="input validator pl-10 w-full text-xs"
						placeholder="correo@ubiobio.cl"
						required
						id={`email-${id}`}
					/>
					<div className="validator-hint">
						Ingresa un correo válido
					</div>
				</div>

				{/* Contraseña */}
				<label
					className="label text-sm"
					htmlFor={`password-${id}`}
				>
					Contraseña
				</label>
				<div className="relative">
					<label htmlFor={`password-${id}`}>
						<LockKeyhole
							size={20}
							strokeWidth={1}
							className="absolute left-3 top-2.5 text-base-content/60 z-10"
						/>
					</label>
					<input
						type={passwordVisible ? 'text' : 'password'}
						className="input validator px-10 w-full text-xs"
						required
						minLength={8}
						placeholder="Contraseña"
						id={`password-${id}`}
					/>

					{passwordVisible ? (
						<Eye
							size={20}
							strokeWidth={1}
							onClick={() => {
								setPasswordVisible(false);
							}}
							className="absolute right-3 top-2.5 text-base-content/60 z-10 cursor-pointer"
						/>
					) : (
						<EyeOff
							size={20}
							strokeWidth={1}
							onClick={() => {
								setPasswordVisible(true);
							}}
							className="absolute right-3 top-2.5 text-base-content/60 z-10 cursor-pointer"
						/>
					)}

					<p className="validator-hint">
						Debe tener al menos 8 caracteres
					</p>
				</div>

				{/* Boton */}
				<button
					type="submit"
					className="btn btn-neutral mt-4"
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Cargando...' : 'Iniciar Sesión'}
					{isSubmitting && (
						<span className="loading loading-dots loading-xs"></span>
					)}
				</button>
			</fieldset>
		</form>
	);
}
