import React from 'react';

interface ITextAreaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
}

export const TextArea: React.FC<ITextAreaProps> = ({
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
			<textarea
				className={`textarea textarea-bordered h-24 w-full ${error ? 'textarea-error' : ''} ${className}`}
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
