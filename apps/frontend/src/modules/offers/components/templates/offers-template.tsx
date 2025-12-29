import { SearchBar } from '@common/components';
import {
	Building2,
	Calendar,
	GraduationCap,
	Loader2,
	Plus,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { authClient } from '@lib/auth-client';
import { ApplyModal } from '@modules/offers/components/organisms/apply-modal';
import { OfferCards } from '@modules/offers/components/organisms/offer-cards';
import { OffersHeader } from '@modules/offers/components/organisms/offers-header';
import {
	UseCreateOneApplication,
	UseCreateOneOffer,
	UseFindInternshipCenters,
	UseFindManyOffers,
	UseFindOfferTypes,
	type TFilters,
} from '@modules/offers/hooks';

// Reproducir reglas de validación del backend (mantener en sync con packages/schema/offers.schema.ts)
const OFFER_TITLE_REGEX =
	/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,\-()]+$/u;
const OFFER_DESCRIPTION_REGEX =
	/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,;:!?¿¡\-()/'"%]+$/u;

export function OffersTemplate() {
	const { data: session, isPending } =
		authClient.useSession();
	// biome-ignore lint/suspicious/noExplicitAny: role is added by backend
	const userRole = (session?.user as any)?.user_role;

	// Hooks de datos
	const {
		data: offers,
		pagination,
		filters,
		isLoading,
		error,
		currentPage,
		totalPages,
		handleFindMany,
		updateFilters,
		goToPage,
		nextPage,
		prevPage,
		changeLimit,
		refresh,
	} = UseFindManyOffers();

	const { data: offerTypes } = UseFindOfferTypes();
	const { data: internshipCenters } =
		UseFindInternshipCenters();
	const {
		handleCreateOne,
		isLoading: isCreating,
		error: createError,
	} = UseCreateOneOffer();

	// Hook para postulaciones
	const {
		handleCreateOne: handleApply,
		isLoading: isApplying,
		isSuccess: applySuccess,
		error: applyError,
		reset: resetApply,
	} = UseCreateOneApplication();

	// Estado del modal de postulación
	const [applyModalOpen, setApplyModalOpen] =
		useState(false);
	const [selectedOffer, setSelectedOffer] = useState<{
		id: number;
		title: string;
	} | null>(null);

	// Cargar datos al montar y aplicar filtros según rol
	useEffect(() => {
		if (isPending) return;

		if (userRole === 'student') {
			updateFilters({ status: 'published' });
		} else {
			handleFindMany(0, pagination.limit);
		}
	}, [
		handleFindMany,
		pagination.limit,
		userRole,
		updateFilters,
		isPending,
	]);

	// Estado del formulario de creación (soporta uno o dos tipos)
	type TCreateForm = {
		title: string;
		description: string;
		deadline: string;
		offerTypeIds: number[];
		internshipCenterId: number | '';
	};

	const [createForm, setCreateForm] = useState<TCreateForm>(
		{
			title: '',
			description: '',
			deadline: '',
			offerTypeIds: [],
			internshipCenterId: '',
		},
	);
	const [createErrors, setCreateErrors] = useState<
		Record<keyof TCreateForm, string | null>
	>({} as Record<keyof TCreateForm, string | null>);

	const createModalRef = useRef<HTMLDialogElement>(null);

	// Handlers de filtros
	const handleSearch = (search: string) => {
		updateFilters({ search });
	};

	const handleStatusChange = (
		status: TFilters['status'],
	) => {
		updateFilters({ status });
	};

	const handleTypeChange = (
		offerTypeId: TFilters['offerTypeId'],
	) => {
		updateFilters({ offerTypeId });
	};

	// Handlers del formulario de creación
	const handleInputChange = (
		field: keyof TCreateForm,
		value: string | number | number[],
	) => {
		setCreateForm(
			(prev) =>
				({
					...prev,
					[field]: value,
				}) as unknown as TCreateForm,
		);
		setCreateErrors((prev) => ({
			...prev,
			[field]: validateField(
				field,
				value as string | number | number[],
			),
		}));
	};

	const validateField = (
		field: keyof TCreateForm,
		value: string | number | number[] | undefined,
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

	const isCreateFormValid = () => {
		const fields = Object.keys(createForm) as Array<
			keyof TCreateForm
		>;
		let valid = true;
		const nextErrors: Record<
			keyof TCreateForm,
			string | null
		> = {} as Record<keyof TCreateForm, string | null>;
		for (const f of fields) {
			const err = validateField(f, createForm[f]);
			nextErrors[f] = err;
			if (err) valid = false;
		}
		setCreateErrors(nextErrors);
		return valid;
	};

	const getInputClass = (field: keyof TCreateForm) => {
		const base = 'input w-full rounded-lg';
		const err = createErrors[field];
		if (err) return `${base} input-error`;
		// sólo marcar éxito si hay valor y no hay error
		const val = createForm[field];
		if (
			val &&
			(typeof val === 'string' ? val.trim() !== '' : true)
		)
			return `${base} input-success`;
		return base;
	};

	const getTextareaClass = (field: keyof TCreateForm) => {
		const base = 'textarea textarea-bordered w-full';
		const err = createErrors[field];
		if (err) return `${base} textarea-error`;
		const val = createForm[field];
		if (val && typeof val === 'string' && val.trim() !== '')
			return `${base} textarea-success`;
		return base;
	};

	const handleOpenCreateModal = () => {
		setCreateForm({
			title: '',
			description: '',
			deadline: '',
			offerTypeIds: [],
			internshipCenterId: '',
		});
		setCreateErrors(
			{} as Record<keyof TCreateForm, string | null>,
		);
		createModalRef.current?.showModal();
	};

	const handleCreate = async () => {
		if (!isCreateFormValid()) return;

		const result = await handleCreateOne({
			title: createForm.title,
			description: createForm.description,
			deadline: createForm.deadline,
			offerTypeIds: createForm.offerTypeIds,
			internshipCenterId:
				createForm.internshipCenterId as number,
		});

		if (result) {
			createModalRef.current?.close();
			refresh();
		}
	};

	// Handlers para postulación
	const handleOpenApplyModal = (
		offerId: number,
		offerTitle: string,
	) => {
		setSelectedOffer({ id: offerId, title: offerTitle });
		setApplyModalOpen(true);
	};

	const handleConfirmApply = async (
		cvFile: File,
		motivationLetter?: File,
	) => {
		if (selectedOffer) {
			await handleApply({
				offerId: selectedOffer.id,
				cvFile,
				motivationLetter,
			});
		}
	};

	const handleCloseApplyModal = () => {
		setApplyModalOpen(false);
		setSelectedOffer(null);
		resetApply();
	};

	if (isPending) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loader2
					className="animate-spin text-primary"
					size={48}
				/>
			</div>
		);
	}

	return (
		<section className="section-base">
			<OffersHeader />

			{/* Barra de búsqueda y filtros */}
			<div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
				<div className="flex-1">
					<SearchBar
						placeholder="Buscar por título de oferta..."
						onSearch={handleSearch}
					/>
				</div>

				{/* Filtro de estado */}
				{userRole === 'coordinator' && (
					<select
						className="select select-bordered w-full sm:w-auto"
						value={filters.status}
						onChange={(e) =>
							handleStatusChange(
								e.target.value as TFilters['status'],
							)
						}
					>
						<option value="all">Todos los estados</option>
						<option value="published">Publicadas</option>
						<option value="closed">Cerradas</option>
						<option value="filled">Cubiertas</option>
					</select>
				)}

				{/* Filtro de tipo de práctica */}
				<select
					className="select select-bordered w-full sm:w-auto"
					value={filters.offerTypeId}
					onChange={(e) => handleTypeChange(e.target.value)}
				>
					<option value="all">Todos los tipos</option>
					{offerTypes.map((type) => (
						<option
							key={type.id}
							value={type.id.toString()}
						>
							{type.name}
						</option>
					))}
				</select>

				{/* Botón de crear */}
				{userRole === 'coordinator' && (
					<button
						type="button"
						className="btn btn-primary"
						onClick={handleOpenCreateModal}
					>
						<Plus size={18} />
						Nueva Oferta
					</button>
				)}
			</div>

			{/* Modal de crear */}
			{createPortal(
				<dialog ref={createModalRef} className="modal">
					<div className="modal-box container">
						<button
							type="button"
							className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
							onClick={() =>
								createModalRef.current?.close()
							}
						>
							✕
						</button>
						<h3 className="text-primary title-2 font-bold mb-4">
							Crear Nueva Oferta de Práctica
						</h3>
						<div className="flex flex-col gap-4">
							{createError && (
								<div className="alert alert-error">
									<span>{createError}</span>
								</div>
							)}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="flex flex-col gap-2 text-base-content/80 sm:col-span-2">
									<h4>Título *</h4>
									<input
										type="text"
										value={createForm.title}
										onChange={(e) =>
											handleInputChange(
												'title',
												e.target.value,
											)
										}
										className={getInputClass('title')}
										disabled={isCreating}
										placeholder="Ej: Práctica Desarrollo Frontend"
									/>
									{createErrors.title && (
										<label className="label">
											<span className="label-text-alt text-error text-sm">
												{createErrors.title}
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
									<div className="flex flex-col gap-2 text-base-content/80">
										{/* Mostrar dos checkboxes: Práctica 1 y Práctica 2 (vertical) */}
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
																createForm.offerTypeIds.includes(
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
																				...createForm.offerTypeIds,
																				t1.id,
																			]),
																		),
																	);
																} else {
																	handleInputChange(
																		'offerTypeIds',
																		createForm.offerTypeIds.filter(
																			(id) => id !== t1.id,
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
																createForm.offerTypeIds.includes(
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
																				...createForm.offerTypeIds,
																				t2.id,
																			]),
																		),
																	);
																} else {
																	handleInputChange(
																		'offerTypeIds',
																		createForm.offerTypeIds.filter(
																			(id) => id !== t2.id,
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
									</div>
									{createErrors.offerTypeIds && (
										<label className="label">
											<span className="label-text-alt text-error text-sm">
												{createErrors.offerTypeIds}
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
										value={createForm.internshipCenterId}
										onChange={(e) =>
											handleInputChange(
												'internshipCenterId',
												e.target.value
													? Number(e.target.value)
													: '',
											)
										}
										className="select select-bordered w-full"
										disabled={isCreating}
									>
										<option value="">
											Seleccionar centro...
										</option>
										{internshipCenters.map((center) => (
											<option
												key={center.id}
												value={center.id}
											>
												{center.legal_name}
											</option>
										))}
									</select>
									{createErrors.internshipCenterId && (
										<label className="label">
											<span className="label-text-alt text-error text-sm">
												{createErrors.internshipCenterId}
											</span>
										</label>
									)}
								</div>
								<div className="flex flex-col gap-2 text-base-content/80 sm:col-span-2">
									<h4>
										<Calendar
											size={18}
											className="inline mr-2"
										/>
										Fecha Límite de Postulación *
									</h4>
									<input
										type="date"
										value={createForm.deadline}
										onChange={(e) =>
											handleInputChange(
												'deadline',
												e.target.value,
											)
										}
										className={getInputClass('deadline')}
										disabled={isCreating}
									/>
									{createErrors.deadline && (
										<label className="label">
											<span className="label-text-alt text-error text-sm">
												{createErrors.deadline}
											</span>
										</label>
									)}
								</div>
							</div>
							<div className="flex flex-col gap-2 text-base-content/80">
								<h4>Descripción *</h4>
								<textarea
									value={createForm.description}
									onChange={(e) =>
										handleInputChange(
											'description',
											e.target.value,
										)
									}
									className={getTextareaClass(
										'description',
									)}
									rows={4}
									disabled={isCreating}
									placeholder="Describe las responsabilidades, requisitos y beneficios de la práctica..."
								/>
								{createErrors.description && (
									<label className="label">
										<span className="label-text-alt text-error text-sm">
											{createErrors.description}
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
									createModalRef.current?.close()
								}
								disabled={isCreating}
							>
								Cancelar
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={handleCreate}
								disabled={isCreating}
							>
								{isCreating ? (
									<>
										<Loader2
											size={18}
											className="animate-spin"
										/>
										Creando...
									</>
								) : (
									<>
										<Plus size={18} />
										Crear Oferta
									</>
								)}
							</button>
						</div>
					</div>
					<form method="dialog" className="modal-backdrop">
						<button type="submit">close</button>
					</form>
				</dialog>,
				document.body,
			)}

			{/* Grid de ofertas */}
			<OfferCards
				data={offers}
				pagination={pagination}
				offerTypes={offerTypes}
				internshipCenters={internshipCenters}
				isLoading={isLoading}
				error={error}
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={goToPage}
				onNextPage={nextPage}
				onPrevPage={prevPage}
				onLimitChange={changeLimit}
				onRefresh={refresh}
				onApply={handleOpenApplyModal}
				readOnly={userRole !== 'coordinator'}
			/>

			{/* Modal de postulación */}
			{selectedOffer && (
				<ApplyModal
					isOpen={applyModalOpen}
					onClose={handleCloseApplyModal}
					onConfirm={handleConfirmApply}
					isLoading={isApplying}
					isSuccess={applySuccess}
					error={applyError}
					offerTitle={selectedOffer.title}
				/>
			)}
		</section>
	);
}
