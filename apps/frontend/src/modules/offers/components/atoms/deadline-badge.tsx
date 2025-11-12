import { Calendar } from 'lucide-react';

interface IDeadlineBadgeProps {
	deadline: string; // ISO date string
}

export function DeadlineBadge({
	deadline,
}: IDeadlineBadgeProps) {
	const formattedDate = new Date(
		deadline,
	).toLocaleDateString('es-CL', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});

	return (
		<div className="inline-flex items-center gap-1.5 text-sm text-base-content/70">
			<Calendar size={16} className="text-primary" />
			<span className="font-medium">{formattedDate}</span>
		</div>
	);
}
