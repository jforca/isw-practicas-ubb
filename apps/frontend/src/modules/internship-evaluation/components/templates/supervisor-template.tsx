import { SupervisorEvaluationForm } from '@modules/internship-evaluation/components/organisms';
import { UserCheck } from 'lucide-react';

export function SupervisorTemplate() {
	return (
		<div className="flex gap-6 p-8 min-h-[70vh]">
			<aside className="w-96 space-y-4">
				<div className="bg-base-100 rounded-lg shadow p-4 flex items-start gap-4">
					<div className="p-3 rounded bg-primary/20 text-primary">
						<UserCheck size={28} />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-primary">
							Evaluación del Supervisor
						</h3>
						<p className="text-sm text-base-content/60">
							Formulario para que el supervisor evalúe
							aspectos técnicos y de buenas prácticas del
							practicante.
						</p>
					</div>
				</div>
				<div className="bg-base-100 rounded-lg shadow p-4 flex items-start gap-4">
					<div className="p-3 rounded bg-primary/10 text-primary">
						<UserCheck size={24} />
					</div>
					<div>
						<h4 className="text-sm font-medium">
							Lorem ipsum dolor sit amet
						</h4>
						<p className="text-xs text-base-content/60">
							Lorem ipsum dolor sit amet, consectetur
							adipiscing elit. Integer nec odio. Praesent
							libero. Sed cursus ante dapibus diam.
						</p>
					</div>
				</div>
			</aside>

			<main className="flex-1 rounded-box p-6 bg-base-100 border border-base-200">
				<div className="p-4 rounded bg-base-100">
					<SupervisorEvaluationForm />
				</div>
				<p className="text-base-content/30 text-sm mt-6">
					&copy; {new Date().getFullYear()} Practicas UBB
				</p>
			</main>
		</div>
	);
}

export default SupervisorTemplate;
