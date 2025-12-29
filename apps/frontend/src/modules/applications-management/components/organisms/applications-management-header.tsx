import { ClipboardList } from 'lucide-react';

export function ApplicationsManagementHeader() {
	return (
		<header className="flex gap-4 items-center">
			<article className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white shadow-md">
				<ClipboardList size={24} />
			</article>

			<div>
				<h2 className="title-2 font-bold">
					Gestión de Postulaciones
				</h2>
				<p className="paragraph-1 text-muted text-base-content/60">
					Revisa y evalúa las postulaciones de los alumnos
				</p>
			</div>
		</header>
	);
}
