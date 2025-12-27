import { useSearchParams } from 'react-router';
import { ReportTemplate } from '../templates/report-template';

export function ReportPage() {
	const [searchParams] = useSearchParams();
	const evaluationId = searchParams.get('evaluationId');

	return (
		<ReportTemplate
			evaluationId={
				evaluationId ? Number(evaluationId) : undefined
			}
		/>
	);
}

export default ReportPage;
