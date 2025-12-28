import { useSearchParams, useNavigate } from 'react-router';
import { SupervisorTemplate } from '../templates/supervisor-template';

export function SupervisorPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const evaluationId = searchParams.get('evaluationId');

	const handleSuccess = () => {
		setTimeout(() => {
			navigate('/app/internship/evaluations');
		}, 1500);
	};

	return (
		<SupervisorTemplate
			evaluationId={
				evaluationId ? Number(evaluationId) : undefined
			}
			onSuccess={handleSuccess}
		/>
	);
}

export default SupervisorPage;
