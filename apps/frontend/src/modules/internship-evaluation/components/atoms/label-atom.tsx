import type { ReactNode } from 'react';

interface ILabelAtomProps {
	children: ReactNode;
	htmlFor?: string;
}

export function LabelAtom({
	children,
	htmlFor,
}: ILabelAtomProps) {
	return (
		<label className="label text-sm" htmlFor={htmlFor}>
			{children}
		</label>
	);
}
