interface IScoreButtonProps {
	value: number;
	selected?: boolean;
	onClick: () => void;
	size?: 'sm' | 'md';
}

export function ScoreButton({
	value,
	selected = false,
	onClick,
	size = 'sm',
}: IScoreButtonProps) {
	const sizeClass = size === 'sm' ? 'btn-sm' : 'btn-md';
	return (
		<button
			type="button"
			onClick={onClick}
			className={`btn btn-ghost ${sizeClass} ${selected ? 'btn-primary' : ''}`}
		>
			{value}
		</button>
	);
}
