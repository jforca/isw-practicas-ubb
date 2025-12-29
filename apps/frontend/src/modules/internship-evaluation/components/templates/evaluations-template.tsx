import { ClipboardList } from 'lucide-react';
import { EvaluationsTable } from '../organisms/evaluations-table';

export function EvaluationsTemplate() {
	return (
		<div className="p-8 min-h-[70vh]">
			<main className="flex-1 rounded-box p-6 bg-base-100 shadow">
				<div className="p-4 rounded bg-base-100 space-y-4">
					<header className="flex gap-4 items-center">
						<article className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md">
							<ClipboardList size={24} />
						</article>
						<div className="flex flex-col gap-1">
							<h2 className="text-2xl font-semibold">
								Listado de evaluaciones
							</h2>
							<p className="text-sm text-base-content/70">
								Consulta las notas registradas por
								supervisor y encargado. Usa las acciones
								para abrir cada evaluación.
							</p>
						</div>
					</header>
					<EvaluationsTable />
				</div>
				<p className="text-base-content/30 text-sm mt-6">
					&copy; {new Date().getFullYear()} Practicas UBB
				</p>
			</main>
		</div>
	);
}

export default EvaluationsTemplate;
