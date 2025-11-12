import { Building2 } from 'lucide-react';
import { StatusBadge } from '../atoms/status-badge';
import { DeadlineBadge } from '../atoms/deadline-badge';
import { InternshipTypeBadge } from '../atoms/internship-type-badge';
import { ApplyButton } from '../atoms/apply-button';

interface IOfferCardProps {
	id: number;
	title: string;
	description: string;
	deadline: string;
	status: 'published' | 'closed' | 'filled';
	internshipType: {
		name: string;
	};
	internshipCenter: {
		legalName: string;
		companyRut: string;
	};
	onApply?: (offerId: number) => void;
}

export function OfferCard({
	id,
	title,
	description,
	deadline,
	status,
	internshipType,
	internshipCenter,
	onApply,
}: IOfferCardProps) {
	const isApplyEnabled = status === 'published';

	return (
		<article className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-lg transition-shadow duration-200">
			<div className="card-body">
				{/* Header: Title + Status */}
				<div className="flex items-start justify-between gap-3">
					<h3 className="card-title text-lg font-bold text-primary line-clamp-2">
						{title}
					</h3>
					<StatusBadge status={status} />
				</div>

				{/* Internship Type */}
				<div className="mt-2">
					<InternshipTypeBadge
						typeName={internshipType.name}
					/>
				</div>

				{/* Description */}
				<p className="text-sm text-base-content/80 mt-3 line-clamp-3">
					{description}
				</p>

				{/* Company Info */}
				<div className="mt-4 flex items-center gap-2 text-sm">
					<Building2 size={16} className="text-accent" />
					<div>
						<p className="font-medium text-base-content">
							{internshipCenter.legalName}
						</p>
					</div>
				</div>

				{/* Footer: Deadline + Apply Button */}
				<div className="card-actions justify-between items-center mt-4 pt-4 border-t border-base-300">
					<DeadlineBadge deadline={deadline} />
					<ApplyButton
						onClick={() => onApply?.(id)}
						disabled={!isApplyEnabled}
					/>
				</div>
			</div>
		</article>
	);
}
