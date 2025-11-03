import PracticasSvg from '@modules/login/assets/svg/practicas.svg?react';

export function LoginBanner() {
	return (
		<>
			<div className="flex flex-col gap-2">
				<h1 className="text-4xl font-bold text-primary-content">
					Administrador de practicas
				</h1>
				<p className="text-lg text-primary-content">
					Gestiona tus tareas de manera eficiente con
					nuestra interface intuitiva.
				</p>
			</div>

			<div>
				<PracticasSvg className="h-100 xl:h-128 w-auto mx-auto [clip-path:inset(0_0_0.3%_0)]" />
			</div>

			<p className="p-2 text-center rounded-full border-primary-content text-primary-content border-solid border-1 w-fit mx-auto">
				&copy; {new Date().getFullYear()} Practicas Software
			</p>
		</>
	);
}
