import { GraduationCap } from 'lucide-react';

interface IInternshipTypeBadgeProps {
	typeName: string;
}

export function InternshipTypeBadge({
	typeName,
}: IInternshipTypeBadgeProps) {
	return (
		<div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
			<GraduationCap size={16} className="text-primary" />
			<span className="text-sm font-medium text-primary">
				{typeName}
			</span>
		</div>
	);
}
