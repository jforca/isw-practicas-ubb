import {
	createContext,
	useContext,
	useId,
	type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// Context para compartir el ID del modal entre componentes
interface IModalContextType {
	modalId: string;
}

const ModalContext =
	createContext<IModalContextType | null>(null);

const useModalContext = () => {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error(
			'Los componentes de Modal deben usarse dentro de un Modal',
		);
	}
	return context;
};

// Componente principal
interface IModalProps {
	children: ReactNode;
}

export function Modal({ children }: IModalProps) {
	const modalId = useId();

	return (
		<ModalContext.Provider value={{ modalId }}>
			{children}
		</ModalContext.Provider>
	);
}

// Subcomponente: Botón que abre el modal
interface IModalTriggerProps {
	children: ReactNode;
	className?: string;
}

function ModalTrigger({
	children,
	className,
}: IModalTriggerProps) {
	const { modalId } = useModalContext();

	const handleOpen = () => {
		const dialog = document.getElementById(
			modalId,
		) as HTMLDialogElement;
		dialog?.showModal();
	};

	return (
		<button
			type="button"
			className={className}
			onClick={handleOpen}
		>
			{children}
		</button>
	);
}

// Subcomponente: Contenedor del modal
interface IModalContentProps {
	children: ReactNode;
	className?: string;
	showCloseButton?: boolean;
}

function ModalContent({
	children,
	className = '',
	showCloseButton = true,
}: IModalContentProps) {
	const { modalId } = useModalContext();

	const modalElement = (
		<dialog id={modalId} className="modal">
			<div className={`modal-box ${className}`}>
				{showCloseButton && (
					<form method="dialog">
						<button
							type="submit"
							className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
							aria-label="Cerrar modal"
						>
							<X size={20} className="stroke-error" />
						</button>
					</form>
				)}
				{children}
			</div>
			<form method="dialog" className="modal-backdrop">
				<button type="submit" aria-label="Cerrar modal">
					close
				</button>
			</form>
		</dialog>
	);

	return createPortal(modalElement, document.body);
}

// Subcomponente: Header del modal
interface IModalHeaderProps {
	children: ReactNode;
	className?: string;
}

function ModalHeader({
	children,
	className = '',
}: IModalHeaderProps) {
	return (
		<div className={`font-bold text-lg ${className}`}>
			{children}
		</div>
	);
}

// Subcomponente: Body del modal
interface IModalBodyProps {
	children: ReactNode;
	className?: string;
}

function ModalBody({
	children,
	className = '',
}: IModalBodyProps) {
	return (
		<div className={`py-4 ${className}`}>{children}</div>
	);
}

// Subcomponente: Footer/Actions del modal
interface IModalActionsProps {
	children: ReactNode;
	className?: string;
}

function ModalActions({
	children,
	className = '',
}: IModalActionsProps) {
	return (
		<div className={`modal-action ${className}`}>
			{children}
		</div>
	);
}

// Exportar subcomponentes como propiedades del componente principal
Modal.Trigger = ModalTrigger;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Actions = ModalActions;

const Title = ({
	children,
}: {
	children: React.ReactNode;
}) => (
	<h2 className="text-2xl font-bold mb-4">{children}</h2>
);

Modal.Title = Title;
