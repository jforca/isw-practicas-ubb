import { Card, Modal } from '@common/components';
import { EmptyState } from '@modules/offers/components/atoms/empty-state';
import { ErrorState } from '@modules/offers/components/atoms/error-state';
import { Loader } from '@modules/offers/components/atoms/loader';
import { Pagination } from '@modules/offers/components/molecules/pagination';
import { PaginationInfo } from '@modules/offers/components/molecules/pagination-info';
import type {
	TInternshipCenterOption,
	TOffer,
	TOfferType,
	TPagination,
} from '@modules/offers/hooks';
import { UseDeleteOffer } from '@modules/offers/hooks/delete-offer.hook';
import { UseUpdateOneOffer } from '@modules/offers/hooks/update-one-offer.hook';
import {
	Building2,
	Calendar,
	Eye,
	FileText,
	GraduationCap,
	Loader2,
	PenLine,
	Send,
	Trash,
} from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Reproducir reglas de validación del backend (mantener en sync con packages/schema/offers.schema.ts)
const OFFER_TITLE_REGEX =
	/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,\-()]+$/u;
const OFFER_DESCRIPTION_REGEX =
	/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,;:!?¿¡\-()/'"%]+$/u;

type TOfferCardsProps = {
	data: TOffer[];
	pagination: TPagination;
	offerTypes: TOfferType[];
	internshipCenters: TInternshipCenterOption[];
	isLoading: boolean;
	error: string | null;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onNextPage: () => void;
	onPrevPage: () => void;
	onLimitChange: (limit: number) => void;
	onRefresh: () => void;
	onApply?: (offerId: number, offerTitle: string) => void;
};

export function OfferCards({
	data,
	pagination,
	offerTypes,
	internshipCenters,
	isLoading,
	error,
	currentPage,
	totalPages,
	onPageChange,
	onNextPage,
	onPrevPage,
	onLimitChange,
	onRefresh,
	onApply,
}: TOfferCardsProps) {
	const id = useId();

	if (error) {
		return (
			<article className="section-sm">
				<ErrorState
					message={error}
					onRetry={() => onPageChange(1)}
				/>
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
				<EmptyState message="No se encontraron ofertas de práctica" />
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{data.map((o) => (
						<OfferCard
							key={`${id}-${o.id}`}
							offer={o}
							offerTypes={offerTypes}
							internshipCenters={internshipCenters}
							onRefresh={onRefresh}
							onApply={onApply}
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

type TOfferCardProps = {
	offer: TOffer;
	offerTypes: TOfferType[];
	internshipCenters: TInternshipCenterOption[];
	onRefresh: () => void;
	onApply?: (offerId: number, offerTitle: string) => void;
};

function OfferCard({
	offer: o,
	offerTypes,
	internshipCenters,
	onRefresh,
	onApply,
}: TOfferCardProps) {
	// Cambiar para soportar múltiples tipos de práctica
	type TEditForm = {
		title: string;
		description: string;
		deadline: string;
		status: 'published' | 'closed' | 'filled';
		offerTypeIds: number[];
		internshipCenterId: number;
	};

	const [editForm, setEditForm] = useState<TEditForm>({
		title: o.title,
		description: o.description,
		deadline: o.deadline.split('T')[0],
		status: o.status,
		offerTypeIds: Array.isArray(o.offerTypes)
			? o.offerTypes.map((t) => t.id)
			: o.offerType
				? [o.offerType.id]
				: [],
		internshipCenterId: o.internshipCenter.id,
	});
	const [editErrors, setEditErrors] = useState<
		Record<keyof TEditForm, string | null>
	>({} as Record<keyof TEditForm, string | null>);

	const [touched, setTouched] = useState<
		Record<keyof TEditForm, boolean>
	>({} as Record<keyof TEditForm, boolean>);

	const editModalRef = useRef<HTMLDialogElement>(null);
	const deleteModalRef = useRef<HTMLDialogElement>(null);

	const {
		handleUpdateOne,
		isLoading: isUpdating,
		error: updateError,
	} = UseUpdateOneOffer();

	const {
		handleDelete,
		isLoading: isDeleting,
		error: deleteError,
	} = UseDeleteOffer();

	const validateField = (
		field: keyof TEditForm,
		value: string | number | number[],
	) => {
		switch (field) {
			case 'title':
				if (!value) return 'El título es requerido';
				if (typeof value === 'string') {
					if (value.length < 5)
						return 'El título debe tener al menos 5 caracteres';
					if (value.length > 155)
						return 'El título no puede exceder 155 caracteres';
					if (!OFFER_TITLE_REGEX.test(value))
						return 'El título contiene caracteres no permitidos';
					if (!/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(value))
						return 'El título debe contener letras';
				}
				return null;
			case 'description':
				if (!value) return 'La descripción es requerida';
				if (typeof value === 'string') {
					if (value.length < 10)
						return 'La descripción debe tener al menos 10 caracteres';
					if (value.length > 255)
						return 'La descripción no puede exceder 255 caracteres';
					if (!OFFER_DESCRIPTION_REGEX.test(value))
						return 'La descripción contiene caracteres no permitidos';
					if (!/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(value))
						return 'La descripción debe contener texto legible';
				}
				return null;
			case 'deadline':
				if (!value) return 'La fecha límite es requerida';
				if (typeof value === 'string') {
					const d = new Date(value);
					if (Number.isNaN(d.getTime()))
						return 'Formato de fecha inválido';
					const now = new Date();
					if (!(d > now))
						return 'La fecha límite debe ser en el futuro';
				}
				return null;
			case 'offerTypeIds':
				if (
					!value ||
					(Array.isArray(value) && value.length === 0)
				)
					return 'Debe seleccionar al menos un tipo de práctica';
				return null;
			case 'internshipCenterId':
				if (!value)
					return 'El centro de práctica es requerido';
				return null;
			default:
				return null;
		}
	};

	const handleInputChange = (
		field: keyof TEditForm,
		value: string | number | number[],
	) => {
		setEditForm((prev) => ({ ...prev, [field]: value }));
		setEditErrors((prev) => ({
			...prev,
			[field]: validateField(field, value),
		}));
		setTouched((prev) => ({ ...prev, [field]: true }));
	};

	const isEditFormValid = () => {
		const fields = Object.keys(editForm) as Array<
			keyof TEditForm
		>;
		let valid = true;
		const nextErrors: Record<
			keyof TEditForm,
			string | null
		> = {} as Record<keyof TEditForm, string | null>;
		for (const f of fields) {
			const err = validateField(f, editForm[f]);
			nextErrors[f] = err;
			if (err) valid = false;
		}
		setEditErrors(nextErrors);
		return valid;
	};

	const getEditInputClass = (field: keyof TEditForm) => {
		const base = 'input w-full rounded-lg';
		const err = editErrors[field];
		if (err) return `${base} input-error`;
		const isTouched = touched[field];
		const val = editForm[field];
		if (
			isTouched &&
			val &&
			(typeof val === 'string' ? val.trim() !== '' : true)
		)
			return `${base} input-success`;
		return base;
	};

	const getEditTextareaClass = (field: keyof TEditForm) => {
		const base = 'textarea textarea-bordered w-full';
		const err = editErrors[field];
		if (err) return `${base} textarea-error`;
		const isTouched = touched[field];
		const val = editForm[field];
		if (
			isTouched &&
			val &&
			typeof val === 'string' &&
			val.trim() !== ''
		)
			return `${base} textarea-success`;
		return base;
	};

	const handleSaveEdit = async () => {
		if (!isEditFormValid()) return;

		const result = await handleUpdateOne(o.id, {
			title: editForm.title,
			description: editForm.description,
			deadline: editForm.deadline,
			status: editForm.status,
			offerTypeIds: editForm.offerTypeIds,
			internshipCenterId: editForm.internshipCenterId,
		});

		if (result) {
			editModalRef.current?.close();
			onRefresh();
		}
	};

	const handleConfirmDelete = async () => {
		const success = await handleDelete(o.id);
		if (success) {
			deleteModalRef.current?.close();
			onRefresh();
		}
	};

	const handleOpenEditModal = () => {
		setEditForm({
			title: o.title,
			description: o.description,
			deadline: o.deadline.split('T')[0],
			status: o.status,
			offerTypeIds: Array.isArray(o.offerTypes)
				? o.offerTypes.map((t) => t.id)
				: o.offerType
					? [o.offerType.id]
					: [],
			internshipCenterId: o.internshipCenter.id,
		});
		setEditErrors(
			{} as Record<keyof TEditForm, string | null>,
		);
		setTouched({} as Record<keyof TEditForm, boolean>);
	};

	const formattedDeadline = new Date(
		o.deadline,
	).toLocaleDateString('es-CL', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});

	const statusConfig = {
		published: {
			label: 'Publicada',
			className: 'badge-success',
		},
		closed: { label: 'Cerrada', className: 'badge-error' },
		filled: {
			label: 'Cubierta',
			className: 'badge-warning',
		},
	};

	// Visualización de tipos de práctica — soporta varias formas de payload
	const payload = o as unknown as Record<string, unknown>;
	const rawOfferTypes = Array.isArray(payload.offerTypes)
		? (payload.offerTypes as Array<Record<string, unknown>>)
		: undefined;
	const rawOfferOfferTypes = Array.isArray(
		payload.offerOfferTypes,
	)
		? (payload.offerOfferTypes as Array<
				Record<string, unknown>
			>)
		: undefined;
	const rawOfferType = payload.offerType as
		| Record<string, unknown>
		| undefined;

	const extractedOfferTypes =
		rawOfferTypes ??
		rawOfferOfferTypes?.map(
			(oot) => oot.offerType as Record<string, unknown>,
		) ??
		(rawOfferType ? [rawOfferType] : []);

	const offerTypeNames = extractedOfferTypes
		.map((t) =>
			t && typeof t.name === 'string' ? t.name : undefined,
		)
		.filter((n): n is string => Boolean(n));
	let showOfferType = 'Sin tipo';
	if (offerTypeNames.length === 1)
		showOfferType = offerTypeNames[0];
	if (offerTypeNames.length === 2)
		showOfferType = 'Práctica I & II';

	return (
		<Card className="hover:scale-102 transition-transform">
			<Card.Body>
				<Card.Container className="flex justify-between items-start">
					<Card.Container className="flex-1">
						<Card.Title className="text-primary font-bold line-clamp-2">
							{o.title}
						</Card.Title>
					</Card.Container>
					<Card.Badge
						className={`${statusConfig[o.status].className} ml-2`}
					>
						{statusConfig[o.status].label}
					</Card.Badge>
				</Card.Container>

				<Card.Container className="mt-2">
					<div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
						<GraduationCap
							size={16}
							className="text-primary"
						/>
						<span className="text-sm font-medium text-primary">
							{showOfferType}
						</span>
					</div>
				</Card.Container>

				<Card.P className="text-base-content/80 mt-3 line-clamp-3">
					{o.description}
				</Card.P>

				<Card.Container className="mt-4 flex items-center gap-2 text-sm">
					<Building2 size={16} className="text-accent" />
					<div>
						<p className="font-medium text-base-content">
							{o.internshipCenter?.legal_name ??
								'Sin centro'}
						</p>
					</div>
				</Card.Container>

				<Card.Divider />

				<Card.Container className="flex justify-between items-center">
					<div className="inline-flex items-center gap-1.5 text-sm text-base-content/70">
						<Calendar size={16} className="text-primary" />
						<span className="font-medium">
							{formattedDeadline}
						</span>
					</div>

					<Card.Actions className="justify-end">
						{/* Modal Ver */}
						<Modal>
							<Card.ToolTip
								dataTip="Ver"
								className="tooltip-primary"
							>
								<Modal.Trigger className="btn btn-primary btn-soft rounded-full size-10">
									<Eye className="scale-300" />
								</Modal.Trigger>
							</Card.ToolTip>
							<Modal.Content className="container">
								<Modal.Header className="text-primary title-2">
									{o.title}
								</Modal.Header>
								<Modal.Body className="flex flex-col gap-4">
									<div className="flex items-center gap-2">
										<span
											className={`badge ${statusConfig[o.status].className}`}
										>
											{statusConfig[o.status].label}
										</span>
										<div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
											<GraduationCap
												size={16}
												className="text-primary"
											/>
											<span className="text-sm font-medium text-primary">
												{showOfferType}
											</span>
										</div>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-2 text-base-content/80">
											<h3>
												<Building2
													size={18}
													className="inline mr-2"
												/>
												Centro de Práctica
											</h3>
											<p className="bg-gray-200 rounded-lg p-2">
												{o.internshipCenter?.legal_name ??
													'Sin centro'}
											</p>
										</div>
										<div className="flex flex-col gap-2 text-base-content/80">
											<h3>
												<FileText
													size={18}
													className="inline mr-2"
												/>
												RUT Empresa
											</h3>
											<p className="bg-gray-200 rounded-lg p-2">
												{o.internshipCenter?.company_rut ??
													'Sin RUT'}
											</p>
										</div>
										<div className="flex flex-col gap-2 text-base-content/80">
											<h3>
												<Calendar
													size={18}
													className="inline mr-2"
												/>
												Fecha Límite
											</h3>
											<p className="bg-gray-200 rounded-lg p-2">
												{formattedDeadline}
											</p>
										</div>
									</div>
									<div className="flex flex-col gap-2 text-base-content/80">
										<h3>Descripción</h3>
										<p className="bg-gray-200 rounded-lg p-2">
											{o.description}
										</p>
									</div>
								</Modal.Body>
							</Modal.Content>
						</Modal>

						{/* Modal Editar */}
						<Card.ToolTip
							dataTip="Editar"
							className="tooltip-success"
						>
							<button
								type="button"
								className="btn btn-success btn-soft rounded-full size-10"
								onClick={() => {
									handleOpenEditModal();
									editModalRef.current?.showModal();
								}}
							>
								<PenLine className="scale-300" />
							</button>
						</Card.ToolTip>
						{createPortal(
							<dialog ref={editModalRef} className="modal">
								<div className="modal-box container">
									<button
										type="button"
										className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
										onClick={() =>
											editModalRef.current?.close()
										}
									>
										✕
									</button>
									<h3 className="text-primary title-2 font-bold mb-4">
										Editar Oferta
									</h3>
									<div className="flex flex-col gap-4">
										{updateError && (
											<div className="alert alert-error">
												<span>{updateError}</span>
											</div>
										)}
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div className="flex flex-col gap-2 text-base-content/80 sm:col-span-2">
												<h4>Título *</h4>
												<input
													type="text"
													value={editForm.title}
													onChange={(e) =>
														handleInputChange(
															'title',
															e.target.value,
														)
													}
													className={getEditInputClass(
														'title',
													)}
													disabled={isUpdating}
												/>
												{editErrors.title && (
													<label className="label">
														<span className="label-text-alt text-error text-sm">
															{editErrors.title}
														</span>
													</label>
												)}
											</div>
											<div className="flex flex-col gap-2 text-base-content/80">
												<h4>
													<GraduationCap
														size={18}
														className="inline mr-2"
													/>
													Tipo de Práctica *
												</h4>
												{/* Checkboxes para Práctica 1 y Práctica 2 */}
												{(() => {
													const t1 = offerTypes[0];
													const t2 = offerTypes[1];
													return (
														<div className="flex flex-row gap-4 items-center">
															<label className="label cursor-pointer inline-flex items-center">
																<input
																	type="checkbox"
																	className="checkbox mr-2"
																	checked={
																		!!t1 &&
																		editForm.offerTypeIds.includes(
																			t1.id,
																		)
																	}
																	onChange={(e) => {
																		if (!t1) return;
																		if (e.target.checked) {
																			handleInputChange(
																				'offerTypeIds',
																				Array.from(
																					new Set([
																						...editForm.offerTypeIds,
																						t1.id,
																					]),
																				),
																			);
																		} else {
																			handleInputChange(
																				'offerTypeIds',
																				editForm.offerTypeIds.filter(
																					(id) =>
																						id !== t1.id,
																				),
																			);
																		}
																	}}
																/>
																<span className="label-text">
																	Práctica 1
																</span>
															</label>
															<label className="label cursor-pointer inline-flex items-center">
																<input
																	type="checkbox"
																	className="checkbox mr-2"
																	checked={
																		!!t2 &&
																		editForm.offerTypeIds.includes(
																			t2.id,
																		)
																	}
																	onChange={(e) => {
																		if (!t2) return;
																		if (e.target.checked) {
																			handleInputChange(
																				'offerTypeIds',
																				Array.from(
																					new Set([
																						...editForm.offerTypeIds,
																						t2.id,
																					]),
																				),
																			);
																		} else {
																			handleInputChange(
																				'offerTypeIds',
																				editForm.offerTypeIds.filter(
																					(id) =>
																						id !== t2.id,
																				),
																			);
																		}
																	}}
																/>
																<span className="label-text">
																	Práctica 2
																</span>
															</label>
														</div>
													);
												})()}
												{editErrors.offerTypeIds && (
													<label className="label">
														<span className="label-text-alt text-error text-sm">
															{editErrors.offerTypeIds}
														</span>
													</label>
												)}
											</div>
											<div className="flex flex-col gap-2 text-base-content/80">
												<h4>
													<Building2
														size={18}
														className="inline mr-2"
													/>
													Centro de Práctica *
												</h4>
												<select
													value={
														editForm.internshipCenterId
													}
													onChange={(e) =>
														handleInputChange(
															'internshipCenterId',
															Number(e.target.value),
														)
													}
													className="select select-bordered w-full"
													disabled={isUpdating}
												>
													{internshipCenters.map(
														(center) => (
															<option
																key={center.id}
																value={center.id}
															>
																{center.legal_name}
															</option>
														),
													)}
												</select>
												{editErrors.internshipCenterId && (
													<label className="label">
														<span className="label-text-alt text-error text-sm">
															{
																editErrors.internshipCenterId
															}
														</span>
													</label>
												)}
											</div>
											<div className="flex flex-col gap-2 text-base-content/80">
												<h4>
													<Calendar
														size={18}
														className="inline mr-2"
													/>
													Fecha Límite *
												</h4>
												<input
													type="date"
													value={editForm.deadline}
													onChange={(e) =>
														handleInputChange(
															'deadline',
															e.target.value,
														)
													}
													className={getEditInputClass(
														'deadline',
													)}
													disabled={isUpdating}
												/>
												{editErrors.deadline && (
													<label className="label">
														<span className="label-text-alt text-error text-sm">
															{editErrors.deadline}
														</span>
													</label>
												)}
											</div>
											<div className="flex flex-col gap-2 text-base-content/80">
												<h4>Estado</h4>
												<select
													value={editForm.status}
													onChange={(e) =>
														handleInputChange(
															'status',
															e.target
																.value as TEditForm['status'],
														)
													}
													className="select select-bordered w-full"
													disabled={isUpdating}
												>
													<option value="published">
														Publicada
													</option>
													<option value="closed">
														Cerrada
													</option>
													<option value="filled">
														Cubierta
													</option>
												</select>
											</div>
										</div>
										<div className="flex flex-col gap-2 text-base-content/80">
											<h4>Descripción *</h4>
											<textarea
												value={editForm.description}
												onChange={(e) =>
													handleInputChange(
														'description',
														e.target.value,
													)
												}
												className={getEditTextareaClass(
													'description',
												)}
												rows={3}
												disabled={isUpdating}
											/>
											{editErrors.description && (
												<label className="label">
													<span className="label-text-alt text-error text-sm">
														{editErrors.description}
													</span>
												</label>
											)}
										</div>
									</div>
									<div className="modal-action">
										<button
											type="button"
											className="btn btn-error btn-soft"
											onClick={() =>
												editModalRef.current?.close()
											}
											disabled={isUpdating}
										>
											Cancelar
										</button>
										<button
											type="button"
											className="btn btn-success btn-soft"
											onClick={handleSaveEdit}
											disabled={isUpdating}
										>
											{isUpdating ? (
												<>
													<Loader2
														size={18}
														className="animate-spin"
													/>
													Guardando...
												</>
											) : (
												<>
													<PenLine size={18} />
													Guardar Edición
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

						{/* Modal Eliminar */}
						<Card.ToolTip
							dataTip="Eliminar"
							className="tooltip-error"
						>
							<button
								type="button"
								className="btn btn-error btn-soft rounded-full size-10"
								onClick={() =>
									deleteModalRef.current?.showModal()
								}
							>
								<Trash className="scale-300" />
							</button>
						</Card.ToolTip>
						{createPortal(
							<dialog
								ref={deleteModalRef}
								className="modal"
							>
								<div className="modal-box">
									<button
										type="button"
										className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
										onClick={() =>
											deleteModalRef.current?.close()
										}
									>
										✕
									</button>
									<h3 className="text-error title-2 font-bold mb-4">
										Eliminar Oferta
									</h3>
									<p className="text-base-content/80">
										¿Estás seguro de que deseas eliminar la
										oferta <strong>"{o.title}"</strong>?
										Esta acción no se puede deshacer.
									</p>
									{deleteError && (
										<div className="alert alert-error mt-4">
											<span>{deleteError}</span>
										</div>
									)}
									<div className="modal-action">
										<button
											type="button"
											className="btn btn-ghost"
											onClick={() =>
												deleteModalRef.current?.close()
											}
											disabled={isDeleting}
										>
											Cancelar
										</button>
										<button
											type="button"
											className="btn btn-error"
											onClick={handleConfirmDelete}
											disabled={isDeleting}
										>
											{isDeleting ? (
												<>
													<Loader2
														size={18}
														className="animate-spin"
													/>
													Eliminando...
												</>
											) : (
												<>
													<Trash size={18} />
													Eliminar
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

						{/* Botón Postular */}
						{o.status === 'published' && onApply && (
							<Card.ToolTip
								dataTip="Postular"
								className="tooltip-info"
							>
								<button
									type="button"
									className="btn btn-info btn-soft rounded-full size-10"
									onClick={() => onApply(o.id, o.title)}
								>
									<Send className="scale-300" />
								</button>
							</Card.ToolTip>
						)}
					</Card.Actions>
				</Card.Container>
			</Card.Body>
		</Card>
	);
}
