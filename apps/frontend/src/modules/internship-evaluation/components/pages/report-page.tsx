import { useSearchParams, useNavigate } from 'react-router';
import { ReportTemplate } from '../templates/report-template';

export function ReportPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const evaluationId = searchParams.get('evaluationId');

	const handleSuccess = () => {
		setTimeout(() => {
			navigate('/app/internship/evaluations');
		}, 1500);
	};

	return (
		<ReportTemplate
			evaluationId={
				evaluationId ? Number(evaluationId) : undefined
			}
			onSuccess={handleSuccess}
		/>
	);
}

export default ReportPage;
