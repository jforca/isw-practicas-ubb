import { Card } from '@common/components';
import {
	EmptyState,
	ErrorState,
	Loader,
} from '@modules/applications-management/components/atoms';
import {
	Pagination,
	PaginationInfo,
} from '@modules/applications-management/components/molecules';
import type {
	TApplicationManagement,
	TPagination,
} from '@modules/applications-management/hooks';
import { UseUpdateApplicationStatus } from '@modules/applications-management/hooks';
import {
	Building2,
	Calendar,
	CheckCircle,
	Clock,
	Edit,
	GraduationCap,
	Loader2,
	Mail,
	User,
	XCircle,
} from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const statusConfig = {
	pending: {
		label: 'Pendiente',
		badge: 'badge-warning',
		icon: Clock,
	},
	approved: {
		label: 'Aprobada',
		badge: 'badge-success',
		icon: CheckCircle,
	},
	rejected: {
		label: 'Rechazada',
		badge: 'badge-error',
		icon: XCircle,
	},
};

type TApplicationCardsProps = {
	data: TApplicationManagement[];
	pagination: TPagination;
	isLoading: boolean;
	error: string | null;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onNextPage: () => void;
	onPrevPage: () => void;
	onLimitChange: (limit: number) => void;
	onRefresh: () => void;
};

export function ApplicationManagementCards({
	data,
	pagination,
	isLoading,
	error,
	currentPage,
	totalPages,
	onPageChange,
	onNextPage,
	onPrevPage,
	onLimitChange,
	onRefresh,
}: TApplicationCardsProps) {
	const id = useId();

	if (error) {
		return (
			<article className="section-sm">
				<ErrorState message={error} onRetry={onRefresh} />
			</article>
		);
	}

	return (
		<article className="section-sm">
			<PaginationInfo
				showing={data.length}
				total={pagination.total}
				limit={pagination.limit}
				isLoading={isLoading}
				onLimitChange={onLimitChange}
			/>

			{isLoading ? (
				<Loader />
			) : data.length === 0 ? (
				<EmptyState message="No hay postulaciones para revisar" />
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{data.map((application) => (
						<ApplicationManagementCard
							key={`${id}-${application.id}`}
							application={application}
							onRefresh={onRefresh}
						/>
					))}
				</div>
			)}

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				isLoading={isLoading}
				onPageChange={onPageChange}
				onNextPage={onNextPage}
				onPrevPage={onPrevPage}
			/>
		</article>
	);
}

function ApplicationManagementCard({
	application,
	onRefresh,
}: {
	application: TApplicationManagement;
	onRefresh: () => void;
}) {
	const config = statusConfig[application.status];
	const StatusIcon = config.icon;

	const approveModalRef = useRef<HTMLDialogElement>(null);
	const rejectModalRef = useRef<HTMLDialogElement>(null);
	const editModalRef = useRef<HTMLDialogElement>(null);

	const [actionType, setActionType] = useState<
		'approved' | 'rejected' | 'pending' | null
	>(null);
	const [selectedStatus, setSelectedStatus] = useState<
		'pending' | 'approved' | 'rejected'
	>(application.status);

	const { handleUpdateStatus, isLoading, error, reset } =
		UseUpdateApplicationStatus();

	const handleApprove = async () => {
		setActionType('approved');
		const result = await handleUpdateStatus(
			application.id,
			'approved',
		);
		if (result) {
			approveModalRef.current?.close();
			onRefresh();
		}
	};

	const handleReject = async () => {
		setActionType('rejected');
		const result = await handleUpdateStatus(
			application.id,
			'rejected',
		);
		if (result) {
			rejectModalRef.current?.close();
			onRefresh();
		}
	};

	const handleEditStatus = async () => {
		setActionType(selectedStatus);
		const result = await handleUpdateStatus(
			application.id,
			selectedStatus,
		);
		if (result) {
			editModalRef.current?.close();
			onRefresh();
		}
	};

	const handleCloseModal = (
		ref: React.RefObject<HTMLDialogElement | null>,
	) => {
		ref.current?.close();
		reset();
		setActionType(null);
	};

	const handleOpenEditModal = () => {
		setSelectedStatus(application.status);
		editModalRef.current?.showModal();
	};

	// Obtener tipos de práctica
	const offerTypes = application.offer.offerTypes ?? [];

	return (
		<Card>
			<Card.Body>
				{/* Header con título y estado */}
				<div className="flex justify-between items-start gap-2">
					<Card.Title className="text-base text-primary">
						{application.offer.title}
					</Card.Title>
					<Card.Badge className={config.badge}>
						<StatusIcon className="w-3 h-3 mr-1" />
						{config.label}
					</Card.Badge>
				</div>

				{/* Información del estudiante */}
				<div className="bg-base-200 rounded-lg p-3 mt-3">
					<h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
						<User size={16} className="text-primary" />
						Información del Estudiante
					</h4>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
						<div className="flex items-center gap-2 text-base-content/70">
							<User size={14} />
							<span>
								{application.student?.name ?? 'Sin nombre'}
							</span>
						</div>
						<div className="flex items-center gap-2 text-base-content/70">
							<Mail size={14} />
							<span className="truncate">
								{application.student?.email ?? 'Sin email'}
							</span>
						</div>
					</div>
				</div>

				{/* Información de la oferta */}
				<div className="mt-3 space-y-2">
					<div className="flex items-center gap-2 text-sm text-base-content/70">
						<Building2 size={14} className="shrink-0" />
						<span className="truncate">
							{application.offer.internshipCenter
								?.legal_name ?? 'Sin centro'}
						</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-base-content/70">
						<Calendar size={14} className="shrink-0" />
						<span>
							Postulado:{' '}
							{new Date(
								application.created_at,
							).toLocaleDateString('es-CL')}
						</span>
					</div>
				</div>

				{/* Tipos de práctica */}
				{offerTypes.length > 0 && (
					<div className="flex flex-wrap gap-1 mt-3">
						{offerTypes.map((type) => (
							<span
								key={type.id}
								className="badge badge-outline badge-sm gap-1"
							>
								<GraduationCap className="w-3 h-3" />
								{type.name}
							</span>
						))}
					</div>
				)}

				<Card.Divider />

				{/* Acciones */}
				<div className="flex justify-end gap-2">
					{application.status === 'pending' ? (
						<>
							<button
								type="button"
								className="btn btn-error btn-sm gap-1"
								onClick={() =>
									rejectModalRef.current?.showModal()
								}
							>
								<XCircle size={16} />
								Rechazar
							</button>
							<button
								type="button"
								className="btn btn-success btn-sm gap-1"
								onClick={() =>
									approveModalRef.current?.showModal()
								}
							>
								<CheckCircle size={16} />
								Aprobar
							</button>
						</>
					) : (
						<button
							type="button"
							className="btn btn-outline btn-sm gap-1"
							onClick={handleOpenEditModal}
						>
							<Edit size={16} />
							Editar estado
						</button>
					)}
				</div>

				{/* Modal Aprobar */}
				{createPortal(
					<dialog ref={approveModalRef} className="modal">
						<div className="modal-box">
							<h3 className="font-bold text-lg text-success">
								Aprobar Postulación
							</h3>
							<p className="py-4">
								¿Estás seguro que deseas aprobar la
								postulación de{' '}
								<strong>{application.student?.name}</strong>{' '}
								a la oferta{' '}
								<strong>{application.offer.title}</strong>?
							</p>
							{error && actionType === 'approved' && (
								<div className="alert alert-error mb-4">
									<span>{error}</span>
								</div>
							)}
							<div className="modal-action">
								<button
									type="button"
									className="btn btn-ghost"
									onClick={() =>
										handleCloseModal(approveModalRef)
									}
									disabled={isLoading}
								>
									Cancelar
								</button>
								<button
									type="button"
									className="btn btn-success gap-2"
									onClick={handleApprove}
									disabled={isLoading}
								>
									{isLoading &&
									actionType === 'approved' ? (
										<>
											<Loader2
												size={16}
												className="animate-spin"
											/>
											Aprobando...
										</>
									) : (
										<>
											<CheckCircle size={16} />
											Confirmar Aprobación
										</>
									)}
								</button>
							</div>
						</div>
						<form
							method="dialog"
							className="modal-backdrop"
						>
							<button type="submit">close</button>
						</form>
					</dialog>,
					document.body,
				)}

				{/* Modal Rechazar */}
				{createPortal(
					<dialog ref={rejectModalRef} className="modal">
						<div className="modal-box">
							<h3 className="font-bold text-lg text-error">
								Rechazar Postulación
							</h3>
							<p className="py-4">
								¿Estás seguro que deseas rechazar la
								postulación de{' '}
								<strong>{application.student?.name}</strong>{' '}
								a la oferta{' '}
								<strong>{application.offer.title}</strong>?
							</p>
							{error && actionType === 'rejected' && (
								<div className="alert alert-error mb-4">
									<span>{error}</span>
								</div>
							)}
							<div className="modal-action">
								<button
									type="button"
									className="btn btn-ghost"
									onClick={() =>
										handleCloseModal(rejectModalRef)
									}
									disabled={isLoading}
								>
									Cancelar
								</button>
								<button
									type="button"
									className="btn btn-error gap-2"
									onClick={handleReject}
									disabled={isLoading}
								>
									{isLoading &&
									actionType === 'rejected' ? (
										<>
											<Loader2
												size={16}
												className="animate-spin"
											/>
											Rechazando...
										</>
									) : (
										<>
											<XCircle size={16} />
											Confirmar Rechazo
										</>
									)}
								</button>
							</div>
						</div>
						<form
							method="dialog"
							className="modal-backdrop"
						>
							<button type="submit">close</button>
						</form>
					</dialog>,
					document.body,
				)}

				{/* Modal Editar Estado */}
				{createPortal(
					<dialog ref={editModalRef} className="modal">
						<div className="modal-box">
							<h3 className="font-bold text-lg text-primary">
								Editar Estado de Postulación
							</h3>
							<p className="py-2 text-base-content/70">
								Cambia el estado de la postulación de{' '}
								<strong>{application.student?.name}</strong>{' '}
								a la oferta{' '}
								<strong>{application.offer.title}</strong>
							</p>

							<div className="form-control w-full mt-4">
								<label className="label">
									<span className="label-text font-medium">
										Nuevo estado
									</span>
								</label>
								<div className="flex flex-col gap-2">
									<label
										className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
											selectedStatus === 'pending'
												? 'border-warning bg-warning/10'
												: 'border-base-300 hover:border-warning/50'
										}`}
									>
										<input
											type="radio"
											name="status"
											value="pending"
											checked={selectedStatus === 'pending'}
											onChange={(e) =>
												setSelectedStatus(
													e.target.value as
														| 'pending'
														| 'approved'
														| 'rejected',
												)
											}
											className="radio radio-warning"
										/>
										<Clock
											size={18}
											className="text-warning"
										/>
										<span className="font-medium">
											Pendiente
										</span>
									</label>
									<label
										className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
											selectedStatus === 'approved'
												? 'border-success bg-success/10'
												: 'border-base-300 hover:border-success/50'
										}`}
									>
										<input
											type="radio"
											name="status"
											value="approved"
											checked={
												selectedStatus === 'approved'
											}
											onChange={(e) =>
												setSelectedStatus(
													e.target.value as
														| 'pending'
														| 'approved'
														| 'rejected',
												)
											}
											className="radio radio-success"
										/>
										<CheckCircle
											size={18}
											className="text-success"
										/>
										<span className="font-medium">
											Aprobada
										</span>
									</label>
									<label
										className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
											selectedStatus === 'rejected'
												? 'border-error bg-error/10'
												: 'border-base-300 hover:border-error/50'
										}`}
									>
										<input
											type="radio"
											name="status"
											value="rejected"
											checked={
												selectedStatus === 'rejected'
											}
											onChange={(e) =>
												setSelectedStatus(
													e.target.value as
														| 'pending'
														| 'approved'
														| 'rejected',
												)
											}
											className="radio radio-error"
										/>
										<XCircle
											size={18}
											className="text-error"
										/>
										<span className="font-medium">
											Rechazada
										</span>
									</label>
								</div>
							</div>

							{error && actionType === selectedStatus && (
								<div className="alert alert-error mt-4">
									<span>{error}</span>
								</div>
							)}

							<div className="modal-action">
								<button
									type="button"
									className="btn btn-ghost"
									onClick={() =>
										handleCloseModal(editModalRef)
									}
									disabled={isLoading}
								>
									Cancelar
								</button>
								<button
									type="button"
									className="btn btn-primary gap-2"
									onClick={handleEditStatus}
									disabled={
										isLoading ||
										selectedStatus === application.status
									}
								>
									{isLoading ? (
										<>
											<Loader2
												size={16}
												className="animate-spin"
											/>
											Guardando...
										</>
									) : (
										<>
											<Edit size={16} />
											Guardar cambio
										</>
									)}
								</button>
							</div>
						</div>
						<form
							method="dialog"
							className="modal-backdrop"
						>
							<button type="submit">close</button>
						</form>
					</dialog>,
					document.body,
				)}
			</Card.Body>
		</Card>
	);
}
