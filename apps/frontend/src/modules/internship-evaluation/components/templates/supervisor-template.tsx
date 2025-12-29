import { SupervisorEvaluationForm } from '@modules/internship-evaluation/components/organisms';
import { School } from 'lucide-react';

interface ISupervisorTemplateProps {
	evaluationId?: number;
	onSuccess?: () => void;
}

export function SupervisorTemplate({
	evaluationId,
	onSuccess,
}: ISupervisorTemplateProps) {
	return (
		<div className="p-8 min-h-[70vh]">
			<main className="flex-1 rounded-box p-6 bg-base-100 shadow">
				<header className="flex items-center gap-6 mb-8">
					<article className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
						<School size={24} />
					</article>
					<div>
						<h1 className="text-3xl font-bold text-base-content">
							Evaluación Supervisor
						</h1>
						<p className="text-base-content/60 mt-1">
							Registra la evaluación del supervisor de
							práctica
						</p>
					</div>
				</header>
				<div className="p-4 rounded bg-base-100">
					<SupervisorEvaluationForm
						evaluationId={evaluationId}
						onSuccess={onSuccess}
					/>
				</div>
				<p className="text-base-content/30 text-sm mt-6">
					&copy; {new Date().getFullYear()} Practicas UBB
				</p>
			</main>
		</div>
	);
}

export default SupervisorTemplate;
