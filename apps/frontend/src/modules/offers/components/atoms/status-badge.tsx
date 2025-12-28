interface IStatusBadgeProps {
	status: 'published' | 'closed' | 'filled';
}

export function StatusBadge({ status }: IStatusBadgeProps) {
	const statusConfig = {
		published: {
			label: 'Publicada',
			className: 'badge-success',
		},
		closed: {
			label: 'Cerrada',
			className: 'badge-error',
		},
		filled: {
			label: 'Cubierta',
			className: 'badge-warning',
		},
	};

	const config = statusConfig[status];

	return (
		<span className={`badge ${config.className} badge-sm`}>
			{config.label}
		</span>
	);
}
