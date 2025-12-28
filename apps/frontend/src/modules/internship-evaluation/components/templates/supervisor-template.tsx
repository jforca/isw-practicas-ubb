import { SupervisorEvaluationForm } from '@modules/internship-evaluation/components/organisms';

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
