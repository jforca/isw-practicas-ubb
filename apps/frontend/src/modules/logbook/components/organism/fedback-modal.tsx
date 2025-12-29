import React from 'react';
import { Button } from '../atoms/button';

type TFeedbackType = 'success' | 'error';

interface IFeedbackModalProps {
	isOpen: boolean;
	onClose: () => void;
	type: TFeedbackType;
	title: string;
	message: string;
}

export const FeedbackModal: React.FC<
	IFeedbackModalProps
> = ({ isOpen, onClose, type, title, message }) => {
	if (!isOpen) return null;

	const isSuccess = type === 'success';

	return (
		<div className="modal modal-open z-50">
			<div className="modal-box text-center relative">
				<button
					onClick={onClose}
					className="btn btn-sm btn-circle absolute right-2 top-2"
					type="button"
					aria-label="Cerrar modal"
				>
					✕
				</button>

				<div className="flex justify-center mb-4">
					{isSuccess ? (
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
							<svg
								className="w-8 h-8 text-green-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								role="img"
							>
								<title>Icono de éxito</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
					) : (
						<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
							<svg
								className="w-8 h-8 text-red-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								role="img"
							>
								<title>Icono de error</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</div>
					)}
				</div>

				<h3
					className={`text-lg font-bold mb-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}
				>
					{title}
				</h3>
				<p className="py-2 text-gray-600">{message}</p>

				<div className="modal-action justify-center mt-6">
					<Button
						variant={isSuccess ? 'primary' : 'secondary'}
						onClick={onClose}
						type="button"
					>
						{isSuccess ? 'Continuar' : 'Cerrar'}
					</Button>
				</div>
			</div>

			<form method="dialog" className="modal-backdrop">
				<button onClick={onClose} type="button">
					close
				</button>
			</form>
		</div>
	);
};
