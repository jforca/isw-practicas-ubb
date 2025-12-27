import type { ChangeEventHandler } from 'react';

interface IInputAtomProps {
	id?: string;
	value: string;
	onChange: ChangeEventHandler<HTMLInputElement>;
	placeholder?: string;
}

export function InputAtom({
	id,
	value,
	onChange,
	placeholder,
}: IInputAtomProps) {
	return (
		<input
			id={id}
			className="input input-bordered w-full"
			value={value}
			onChange={onChange}
			placeholder={placeholder}
		/>
	);
}
