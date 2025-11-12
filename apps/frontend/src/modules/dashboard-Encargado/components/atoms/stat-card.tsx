interface IStatCardProps {
	label: string;
	value: number | string;
	description?: string;
}

// Tarjetas de la parte superior del dashboard
export function StatCard({
	label,
	value,
	description,
}: IStatCardProps) {
	return (
		<div className="stat">
			<div className="stat-title text-base-content/70">
				{label}
			</div>
			<div className="stat-value text-2xl lg:text-3xl">
				{value}
			</div>
			{description ? (
				<div className="stat-desc text-base-content/60">
					{description}
				</div>
			) : null}
		</div>
	);
}
