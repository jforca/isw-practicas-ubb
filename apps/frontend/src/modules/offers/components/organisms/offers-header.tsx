import { Briefcase } from 'lucide-react';

export function OffersHeader() {
	return (
		<header className="flex gap-4 items-center">
			<article className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white shadow-md">
				<Briefcase size={24} />
			</article>

			<div>
				<h2 className="title-2 font-bold">
					Ofertas de práctica
				</h2>
				<p className="paragraph-1 text-muted text-base-content/60">
					Explora las oportunidades disponibles
				</p>
			</div>
		</header>
	);
}
