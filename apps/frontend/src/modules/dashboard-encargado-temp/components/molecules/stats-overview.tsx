import { StatCard } from '@modules/dashboard-Encargado/components/atoms/stat-card';

interface IStatsOverviewProps {
	total: number;
	inCourse: number;
	onReview: number;
	onEvaluation: number;
}

// Utiliza las tarjetas superiores
export function StatsOverview({
	total,
	inCourse,
	onReview,
	onEvaluation,
}: IStatsOverviewProps) {
	return (
		<div className="stats stats-vertical sm:stats-horizontal bg-base-100 border border-base-200 rounded-box w-full">
			<StatCard
				label="Alumnos"
				value={total}
				description="Total registrados"
			/>
			<StatCard
				label="En curso"
				value={inCourse}
				description="Prácticas activas"
			/>
			<StatCard
				label="Revisión"
				value={onReview}
				description="Postulaciones nuevas"
			/>
			<StatCard
				label="Evaluación"
				value={onEvaluation}
				description="Pendiente de calificar"
			/>
		</div>
	);
}
