import { Send } from 'lucide-react';

interface IApplyButtonProps {
	onClick?: () => void;
	disabled?: boolean;
}

export function ApplyButton({
	onClick,
	disabled = false,
}: IApplyButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className="btn btn-primary btn-sm gap-2"
		>
			<Send size={16} />
			Postular
		</button>
	);
}
