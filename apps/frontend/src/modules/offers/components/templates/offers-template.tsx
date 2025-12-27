import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SearchBar } from '@common/components';
import {
	Plus,
	GraduationCap,
	Building2,
	Calendar,
	Loader2,
} from 'lucide-react';
import { OffersHeader } from '@modules/offers/components/organisms/offers-header';
import { OfferCards } from '@modules/offers/components/organisms/offer-cards';
import {
	UseFindManyOffers,
	UseCreateOneOffer,
	UseFindOfferTypes,
	UseFindInternshipCenters,
	type TFilters,
} from '@modules/offers/hooks';

export function OffersTemplate() {
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

	// Cargar datos al montar
	useEffect(() => {
		handleFindMany(0, pagination.limit);
	}, [handleFindMany, pagination.limit]);

	// Estado del formulario de creación
	type TCreateForm = {
		title: string;
		description: string;
		deadline: string;
		offerTypeId: number | '';
		internshipCenterId: number | '';
	};

	const [createForm, setCreateForm] = useState<TCreateForm>(
		{
			title: '',
			description: '',
			deadline: '',
			offerTypeId: '',
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
		value: string | number,
	) => {
		setCreateForm((prev) => ({ ...prev, [field]: value }));
		setCreateErrors((prev) => ({
			...prev,
			[field]: validateField(field, value),
		}));
	};

	const validateField = (
		field: keyof TCreateForm,
		value: string | number,
	) => {
		switch (field) {
			case 'title':
				if (!value) return 'El título es requerido';
				return null;
			case 'description':
				if (!value) return 'La descripción es requerida';
				return null;
			case 'deadline':
				if (!value) return 'La fecha límite es requerida';
				return null;
			case 'offerTypeId':
				if (!value)
					return 'El tipo de práctica es requerido';
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
		if (createForm[field]) return `${base} input-success`;
		return base;
	};

	const handleOpenCreateModal = () => {
		setCreateForm({
			title: '',
			description: '',
			deadline: '',
			offerTypeId: '',
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
			offerTypeId: createForm.offerTypeId as number,
			internshipCenterId:
				createForm.internshipCenterId as number,
		});

		if (result) {
			createModalRef.current?.close();
			refresh();
		}
	};

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
				<select
					className="select select-bordered"
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

				{/* Filtro de tipo de práctica */}
				<select
					className="select select-bordered"
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
				<button
					type="button"
					className="btn btn-primary"
					onClick={handleOpenCreateModal}
				>
					<Plus size={18} />
					Nueva Oferta
				</button>
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
											<span className="label-text-alt text-error">
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
									<select
										value={createForm.offerTypeId}
										onChange={(e) =>
											handleInputChange(
												'offerTypeId',
												e.target.value
													? Number(e.target.value)
													: '',
											)
										}
										className="select select-bordered w-full"
										disabled={isCreating}
									>
										<option value="">
											Seleccionar tipo...
										</option>
										{offerTypes.map((type) => (
											<option key={type.id} value={type.id}>
												{type.name}
											</option>
										))}
									</select>
									{createErrors.offerTypeId && (
										<label className="label">
											<span className="label-text-alt text-error">
												{createErrors.offerTypeId}
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
											<span className="label-text-alt text-error">
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
											<span className="label-text-alt text-error">
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
									className={`textarea textarea-bordered w-full ${
										createErrors.description
											? 'textarea-error'
											: ''
									}`}
									rows={4}
									disabled={isCreating}
									placeholder="Describe las responsabilidades, requisitos y beneficios de la práctica..."
								/>
								{createErrors.description && (
									<label className="label">
										<span className="label-text-alt text-error">
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
			/>
		</section>
	);
}
