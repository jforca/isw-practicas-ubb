import type { ChangeEvent } from 'react';

type TEvalLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

interface IAfRadioGroupProps {
	name: string;
	value: TEvalLetter | null;
	onChange: (val: TEvalLetter) => void;
	size?: 'xs' | 'sm';
}

const options: TEvalLetter[] = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
];

export function AfRadioGroup({
	name,
	value,
	onChange,
	size = 'xs',
}: IAfRadioGroupProps) {
	const cls =
		size === 'xs' ? 'radio radio-xs' : 'radio radio-sm';
	const handle = (e: ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value as TEvalLetter;
		onChange(val);
	};

	return (
		<div className="grid grid-cols-6 place-items-center gap-1">
			{options.map((opt) => (
				<label
					key={`${name}-${opt}`}
					className="cursor-pointer"
				>
					<input
						type="radio"
						name={name}
						className={cls}
						value={opt}
						checked={value === opt}
						onChange={handle}
					/>
				</label>
			))}
		</div>
	);
}
