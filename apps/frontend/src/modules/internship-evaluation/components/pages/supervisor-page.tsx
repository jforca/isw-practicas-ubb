import { useSearchParams } from 'react-router';
import { SupervisorTemplate } from '../templates/supervisor-template';

export function SupervisorPage() {
	const [searchParams] = useSearchParams();
	const evaluationId = searchParams.get('evaluationId');

	return (
		<SupervisorTemplate
			evaluationId={
				evaluationId ? Number(evaluationId) : undefined
			}
		/>
	);
}

export default SupervisorPage;
