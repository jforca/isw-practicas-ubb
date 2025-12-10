import type { ChangeEventHandler } from 'react';

interface ITextareaAtomProps {
	id?: string;
	value: string;
	onChange: ChangeEventHandler<HTMLTextAreaElement>;
	placeholder?: string;
}

export function TextareaAtom({
	id,
	value,
	onChange,
	placeholder,
}: ITextareaAtomProps) {
	return (
		<textarea
			id={id}
			className="textarea textarea-bordered h-32 w-full"
			value={value}
			onChange={onChange}
			placeholder={placeholder}
		/>
	);
}
