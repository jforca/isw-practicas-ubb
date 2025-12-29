import { useId, useState, type FormEvent } from 'react';
import {
	Mail,
	LockKeyhole,
	Eye,
	EyeOff,
} from 'lucide-react';
import { useAuth } from '../../../../common/hooks/auth.hook';
import { useNavigate } from 'react-router';

export function LoginForm() {
	const id = useId();
	const { signInEmail } = useAuth();
	const navigate = useNavigate();

	const [passwordVisible, setPasswordVisible] =
		useState(false);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const { error } = await signInEmail(
				email,
				password,
				false,
			);

			if (error) {
				setError(
					error.message ||
						'Error al iniciar sesión. Verifica tus credenciales.',
				);
			} else {
				navigate('/app/logbook');
			}
		} catch {
			setError('Ocurrió un error inesperado');
		} finally {
			setIsSubmitting(false);
		}
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
				{error && (
					<div
						role="alert"
						className="alert alert-error text-xs p-2"
					>
						<span>{error}</span>
					</div>
				)}

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
						value={email}
						onChange={(e) => setEmail(e.target.value)}
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
						value={password}
						onChange={(e) => setPassword(e.target.value)}
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
