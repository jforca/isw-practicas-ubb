import { Link } from 'react-router';

export function NotFoundTemplate() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
			<div className="max-w-4xl w-full">
				<div className="hero bg-base-100 shadow-xl rounded-lg p-6">
					<div className="hero-content flex-col lg:flex-row gap-6">
						<div className="text-center lg:text-left">
							<h1 className="text-6xl font-extrabold text-error">
								404
							</h1>
							<h2 className="text-2xl font-semibold mt-2">
								Página no encontrada
							</h2>
							<p className="mt-3 text-base-content/70">
								Lo sentimos — la página que buscas no existe
								o ha sido movida.
							</p>

							<div className="mt-6 flex gap-3 justify-center lg:justify-start">
								<Link to="/" className="btn btn-error">
									Ir al inicio
								</Link>
								<Link
									to="/"
									type="button"
									className="btn btn-ghost"
								>
									Volver
								</Link>
							</div>
						</div>

						<div className="flex-1">
							<div className="w-full h-56 rounded-lg bg-linear-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-40 h-40 text-error"
									viewBox="0 0 64 64"
									fill="none"
								>
									<title>Ilustración de página 404</title>
									<rect
										x="6"
										y="10"
										width="52"
										height="36"
										rx="3"
										stroke="currentColor"
										strokeWidth="2"
										fill="rgba(99,102,241,0.06)"
									/>
									<rect
										x="12"
										y="16"
										width="40"
										height="6"
										rx="1"
										fill="currentColor"
										opacity="0.08"
									/>
									<path
										d="M20 36h24"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										opacity="0.6"
									/>
									<circle
										cx="32"
										cy="28"
										r="6"
										stroke="currentColor"
										strokeWidth="2"
										fill="rgba(99,102,241,0.12)"
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>

				<p className="mt-4 text-center text-sm text-base-content/60">
					Si crees que esto es un error, ponte en contacto
					con el equipo de soporte.
				</p>
			</div>
		</div>
	);
}
