import { Loader2 } from 'lucide-react';

export function Loader({
	text = 'Cargando...',
}: {
	text?: string;
}) {
	return (
		<div className="flex items-center justify-center py-12">
			<Loader2 className="animate-spin text-primary size-8" />
			<span className="ml-2 text-base-content/60">
				{text}
			</span>
		</div>
	);
}
