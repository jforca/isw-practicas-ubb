import { FileText } from 'lucide-react';

export function ApplicationsHeader() {
	return (
		<header className="flex gap-4 items-center">
			<article className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white shadow-md">
				<FileText size={24} />
			</article>

			<div>
				<h2 className="title-2 font-bold">
					Mis Postulaciones
				</h2>
				<p className="paragraph-1 text-muted text-base-content/60">
					Historial de tus postulaciones a prácticas
				</p>
			</div>
		</header>
	);
}
