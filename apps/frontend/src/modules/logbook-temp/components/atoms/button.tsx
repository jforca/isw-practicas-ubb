import React from 'react';

interface IButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'danger' | 'info';
}

export const Button: React.FC<IButtonProps> = ({
	children,
	variant = 'primary',
	...props
}) => {
	let colorClass = 'btn';

	switch (variant) {
		case 'primary':
			colorClass += ' btn-primary';
			break;
		case 'secondary':
			colorClass += ' btn-ghost'; // Usamos btn-ghost para un estilo menos intrusivo
			break;
		case 'danger':
			colorClass += ' btn-error';
			break;
		case 'info':
			colorClass += ' btn-info';
			break;
	}

	return (
		<button
			className={`${colorClass} ${props.className}`}
			{...props}
		>
			{children}
		</button>
	);
};
