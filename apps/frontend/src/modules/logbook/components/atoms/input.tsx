import React from 'react';

interface IInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

export const Input: React.FC<IInputProps> = ({
	label,
	error,
	className,
	...props
}) => {
	return (
		<div className="form-control w-full">
			{label && (
				<div className="label">
					<span className="label-text font-semibold">
						{label}
					</span>
				</div>
			)}
			<input
				className={`input input-bordered w-full ${error ? 'input-error' : ''} ${className}`}
				{...props}
			/>
			{error && (
				<div className="label">
					<span className="label-text-alt text-error">
						{error}
					</span>
				</div>
			)}
		</div>
	);
};
