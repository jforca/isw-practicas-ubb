import { useId, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { TInternshipCenter } from '@packages/schema/internship-centers.schema';
import { Card, Modal } from '@common/components';

import {
	Eye,
	PenLine,
	Trash,
	FileText,
	IdCard,
	MapPin,
	Phone,
	Mail,
	Loader2,
} from 'lucide-react';
import {
	ChileanNumberRegex,
	ChileanRUTRegex,
} from '@packages/utils/regex.utils';
import {
	NAME_REGEX,
	ADDRESS_REGEX,
} from '@packages/schema/internship-centers.schema';
import { DESCRIPTION_REGEX } from '@packages/schema/internship-centers.schema';
import {
	Loader,
	EmptyState,
	ErrorState,
} from '@modules/internship-centers/components/atoms';
import {
	Pagination,
	PaginationInfo,
} from '@modules/internship-centers/components/molecules';
import {
	UseUploadConvention,
	UseDeleteOneInternshipCenter,
	UseUpdateOneInternshipCenter,
	type TPagination,
} from '@modules/internship-centers/hooks';

type TInternshipCenterCardsProps = {
	data: TInternshipCenter[];
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

export function InternshipCenterCards({
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
}: TInternshipCenterCardsProps) {
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
				<EmptyState message="No se encontraron centros de prácticas" />
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{data.map((c) => (
						<InternshipCenterCard
							key={`${id}-${c.id}`}
							center={c}
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

// Componente interno para manejar el estado de cada card
type TInternshipCenterCardProps = {
	center: TInternshipCenter;
	onRefresh: () => void;
};

function InternshipCenterCard({
	center: c,
	onRefresh,
}: TInternshipCenterCardProps) {
	// Estado del formulario de edición
	type TEditForm = {
		// biome-ignore lint/style/useNamingConvention: a
		legal_name: string;
		// biome-ignore lint/style/useNamingConvention: a
		company_rut: string;
		email: string;
		phone: string;
		address: string;
		description: string;
	};

	const [editForm, setEditForm] = useState<TEditForm>({
		legal_name: c.legal_name,
		company_rut: c.company_rut,
		email: c.email,
		phone: c.phone,
		address: c.address,
		description: c.description,
	});
	const [editErrors, setEditErrors] = useState<
		Record<keyof TEditForm, string | null>
	>({} as Record<keyof TEditForm, string | null>);

	// Estado para el archivo de convenio
	const [conventionFile, setConventionFile] =
		useState<File | null>(null);
	const hasConvention = c.convention_document_id !== null;

	// URL para ver el convenio en nueva pestaña
	const conventionViewUrl = hasConvention
		? `/api/documents/convention/${c.id}/view`
		: null;

	// Handler para abrir convenio en nueva pestaña
	const handleViewConvention = () => {
		if (conventionViewUrl) {
			window.open(conventionViewUrl, '_blank');
		}
	};

	// Referencias a los modales para cerrarlos programáticamente
	const editModalRef = useRef<HTMLDialogElement>(null);
	const deleteModalRef = useRef<HTMLDialogElement>(null);

	// Hooks para operaciones
	const {
		handleUpdateOne,
		isLoading: isUpdating,
		error: updateError,
	} = UseUpdateOneInternshipCenter();

	const {
		handleDelete,
		isLoading: isDeleting,
		error: deleteError,
	} = UseDeleteOneInternshipCenter();

	const {
		handleUpload,
		isLoading: isUploading,
		error: uploadError,
	} = UseUploadConvention();

	// Handler para actualizar el formulario
	const handleInputChange = (
		field: keyof TEditForm,
		value: string,
	) => {
		setEditForm((prev) => ({ ...prev, [field]: value }));
		setEditErrors((prev) => ({
			...prev,
			[field]: validateField(field, value),
		}));
	};

	const validateField = (
		field: keyof TEditForm,
		value: string,
	) => {
		switch (field) {
			case 'company_rut':
				if (!value) return 'RUT es requerido';
				if (!ChileanRUTRegex.test(value.replace(/\./g, '')))
					return 'RUT inválido (ej: 12.345.678-9)';
				return null;
			case 'phone':
				if (!value) return 'Teléfono es requerido';
				if (
					!ChileanNumberRegex.test(
						value.replace(/\s+/g, ''),
					)
				)
					return 'Teléfono inválido (ej: +56912345678)';
				return null;
			case 'email':
				if (!value) return 'Correo es requerido';
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
					return 'Correo inválido';
				return null;
			case 'legal_name':
				if (!value) return 'Nombre legal es requerido';
				if (value.length < 2)
					return 'Nombre demasiado corto';
				if (!NAME_REGEX.test(value))
					return 'Nombre contiene caracteres inválidos';
				if (!/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(value))
					return 'Nombre debe contener letras';
				return null;
			case 'address':
				if (!value) return 'Dirección es requerida';
				if (value.length < 5)
					return 'Dirección demasiado corta';
				if (!ADDRESS_REGEX.test(value))
					return 'Dirección contiene caracteres inválidos';
				if (!/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(value))
					return 'Dirección debe contener letras';
				return null;
			case 'description':
				if (!value) return 'Descripción es requerida';
				if (value.length < 10)
					return 'Descripción demasiado corta';
				if (!DESCRIPTION_REGEX.test(value))
					return 'Descripción contiene caracteres inválidos';
				if (!/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(value))
					return 'Descripción debe contener texto legible';
				return null;
			default:
				return null;
		}
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
			const err = validateField(f, editForm[f] ?? '');
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
		if (editForm[field]) return `${base} input-success`;
		return base;
	};

	// Handler para guardar edición
	const handleSaveEdit = async () => {
		if (!isEditFormValid()) return;

		// Primero actualizar los datos del formulario
		const result = await handleUpdateOne(c.id, editForm);
		if (!result) return;

		// Si hay un archivo de convenio, subirlo
		if (conventionFile) {
			const uploadResult = await handleUpload(
				c.id,
				conventionFile,
			);
			if (!uploadResult) {
				// Aún así cerramos el modal ya que los datos se guardaron
				editModalRef.current?.close();
				onRefresh();
				return;
			}
		}

		editModalRef.current?.close();
		onRefresh();
	};

	// Handler para eliminar
	const handleConfirmDelete = async () => {
		const success = await handleDelete(c.id);
		if (success) {
			deleteModalRef.current?.close();
			onRefresh();
		}
	};

	// Resetear formulario al abrir modal de edición
	const handleOpenEditModal = () => {
		setEditForm({
			legal_name: c.legal_name,
			company_rut: c.company_rut,
			email: c.email,
			phone: c.phone,
			address: c.address,
			description: c.description,
		});
		setConventionFile(null);
	};

	// Handler para el archivo de convenio
	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (file && file.type === 'application/pdf') {
			setConventionFile(file);
		} else if (file) {
			alert('Solo se permiten archivos PDF');
			e.target.value = '';
		}
	};

	return (
		<Card className="hover:scale-102 transition-transform">
			<Card.Body>
				<Card.Container className="flex justify-between">
					<Card.Container>
						<Card.Title className="text-primary font-bold">
							{c.legal_name}
						</Card.Title>
						<Card.P className="paragraph-2 text-base-content/60">
							{c.address}
						</Card.P>
					</Card.Container>
					<Card.ToolTip
						dataTip={
							hasConvention
								? 'Ver Convenio'
								: 'Sin Convenio'
						}
						className={
							hasConvention
								? 'tooltip-info'
								: 'tooltip-warning'
						}
					>
						<button
							type="button"
							className={`btn btn-info btn-soft rounded-full size-10 ${!hasConvention ? 'btn-disabled opacity-50 cursor-not-allowed' : ''}`}
							disabled={!hasConvention}
							onClick={handleViewConvention}
						>
							<FileText className="scale-300" />
						</button>
					</Card.ToolTip>
				</Card.Container>

				<Card.P className="text-base-content/80">
					{c.description}
				</Card.P>

				<Card.Divider />

				<Card.Container className="flex justify-between items-center">
					<Card.Badge className="badge-soft badge-accent paragraph-2 font-medium">
						{c.email}
					</Card.Badge>

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
									{c.legal_name}
								</Modal.Header>
								<Modal.Body className="flex flex-col gap-4">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-2 text-base-content/80">
											<h3>
												<IdCard
													size={18}
													className="inline mr-2"
												/>
												Rut Empresa
											</h3>
											<p className="bg-gray-200 rounded-lg p-2">
												{c.company_rut}
											</p>
										</div>
										<div className="flex flex-col gap-2 text-base-content/80">
											<h3>
												<FileText
													size={18}
													className="inline mr-2"
												/>
												Convenio
											</h3>
											<p className="bg-gray-200 rounded-lg p-2">
												{c.convention_document_name ??
													'Sin convenio'}
											</p>
										</div>
										<div className="flex flex-col gap-2 text-base-content/80">
											<h3>
												<Phone
													size={18}
													className="inline mr-2"
												/>
												Telefono
											</h3>
											<p className="bg-gray-200 rounded-lg p-2">
												{c.phone}
											</p>
										</div>
										<div className="flex flex-col gap-2 text-base-content/80">
											<h3>
												<Mail
													size={18}
													className="inline mr-2"
												/>
												Correo Electrónico
											</h3>
											<p className="bg-gray-200 rounded-lg p-2">
												{c.email}
											</p>
										</div>
									</div>
									<div className="flex flex-col gap-2 text-base-content/80">
										<h3>
											<MapPin
												size={18}
												className="inline mr-2"
											/>
											Dirección
										</h3>
										<p className="bg-gray-200 rounded-lg p-2">
											{c.address}
										</p>
									</div>
									<div className="flex flex-col gap-2 text-base-content/80">
										<h3>Descripción</h3>
										<p className="bg-gray-200 rounded-lg p-2">
											{c.description}
										</p>
									</div>
								</Modal.Body>
								<Modal.Actions>
									<button
										type="button"
										className={`btn btn-info ${!hasConvention ? 'btn-disabled' : ''}`}
										disabled={!hasConvention}
										onClick={handleViewConvention}
									>
										<FileText size={18} />
										Ver Convenio
									</button>
								</Modal.Actions>
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
										Editar: {c.legal_name}
									</h3>
									<div className="flex flex-col gap-4">
										{updateError && (
											<div className="alert alert-error">
												<span>{updateError}</span>
											</div>
										)}
										{uploadError && (
											<div className="alert alert-error">
												<span>{uploadError}</span>
											</div>
										)}
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div className="flex flex-col gap-2 text-base-content/80">
												<h3>
													<IdCard
														size={18}
														className="inline mr-2"
													/>
													Nombre Legal
												</h3>
												<input
													type="text"
													value={editForm.legal_name}
													onChange={(e) =>
														handleInputChange(
															'legal_name',
															e.target.value,
														)
													}
													className={getEditInputClass(
														'legal_name',
													)}
													disabled={isUpdating}
												/>
												{editErrors.legal_name && (
													<label className="label">
														<span className="label-text-alt text-error text-sm">
															{editErrors.legal_name}
														</span>
													</label>
												)}
											</div>
											<div className="flex flex-col gap-2 text-base-content/80">
												<h3>
													<IdCard
														size={18}
														className="inline mr-2"
													/>
													Rut Empresa
												</h3>
												<input
													type="text"
													value={editForm.company_rut}
													onChange={(e) =>
														handleInputChange(
															'company_rut',
															e.target.value,
														)
													}
													className={getEditInputClass(
														'company_rut',
													)}
													disabled={isUpdating}
												/>
												{editErrors.company_rut && (
													<label className="label">
														<span className="label-text-alt text-error text-sm">
															{editErrors.company_rut}
														</span>
													</label>
												)}
											</div>
											<div className="flex flex-col gap-2 text-base-content/80">
												<h3>
													<Phone
														size={18}
														className="inline mr-2"
													/>
													Telefono
												</h3>
												<input
													type="tel"
													value={editForm.phone}
													onChange={(e) =>
														handleInputChange(
															'phone',
															e.target.value,
														)
													}
													className={getEditInputClass(
														'phone',
													)}
													disabled={isUpdating}
												/>
												{editErrors.phone && (
													<label className="label">
														<span className="label-text-alt text-error text-sm">
															{editErrors.phone}
														</span>
													</label>
												)}
											</div>
											<div className="flex flex-col gap-2 text-base-content/80">
												<h3>
													<Mail
														size={18}
														className="inline mr-2"
													/>
													Correo Electrónico
												</h3>
												<input
													type="email"
													value={editForm.email}
													onChange={(e) =>
														handleInputChange(
															'email',
															e.target.value,
														)
													}
													className={getEditInputClass(
														'email',
													)}
													disabled={isUpdating}
												/>
												{editErrors.email && (
													<label className="label">
														<span className="label-text-alt text-error text-sm">
															{editErrors.email}
														</span>
													</label>
												)}
											</div>
										</div>
										<div className="flex flex-col gap-2 text-base-content/80">
											<h3>
												<MapPin
													size={18}
													className="inline mr-2"
												/>
												Dirección
											</h3>
											<input
												type="text"
												value={editForm.address}
												onChange={(e) =>
													handleInputChange(
														'address',
														e.target.value,
													)
												}
												className={getEditInputClass(
													'address',
												)}
												disabled={isUpdating}
											/>
											{editErrors.address && (
												<label className="label">
													<span className="label-text-alt text-error text-sm">
														{editErrors.address}
													</span>
												</label>
											)}
										</div>
										<div className="flex flex-col gap-2 text-base-content/80">
											<h3>Descripción</h3>
											<input
												type="text"
												value={editForm.description}
												onChange={(e) =>
													handleInputChange(
														'description',
														e.target.value,
													)
												}
												className={getEditInputClass(
													'description',
												)}
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
										{/* Sección de Convenio */}
										<div className="flex flex-col gap-2 text-base-content/80">
											<h3>
												<FileText
													size={18}
													className="inline mr-2"
												/>
												Convenio (PDF)
											</h3>
											<div className="flex flex-col gap-2">
												{hasConvention && (
													<div className="flex items-center gap-2 p-2 bg-success/10 rounded-lg">
														<FileText
															size={16}
															className="text-success"
														/>
														<span className="text-sm text-success">
															Convenio actual:{' '}
															{c.convention_document_name}
														</span>
													</div>
												)}
												{!hasConvention && (
													<div className="flex items-center gap-2 p-2 bg-warning/10 rounded-lg">
														<FileText
															size={16}
															className="text-warning"
														/>
														<span className="text-sm text-warning">
															No hay convenio cargado
														</span>
													</div>
												)}
												<input
													type="file"
													accept="application/pdf"
													onChange={handleFileChange}
													className="file-input file-input-bordered w-full"
													disabled={
														isUpdating || isUploading
													}
												/>
												{conventionFile && (
													<div className="flex items-center gap-2 p-2 bg-info/10 rounded-lg">
														<FileText
															size={16}
															className="text-info"
														/>
														<span className="text-sm text-info">
															Nuevo archivo:{' '}
															{conventionFile.name}
														</span>
													</div>
												)}
											</div>
										</div>
									</div>
									<div className="modal-action">
										<button
											type="button"
											className={`btn btn-info btn-soft ${!hasConvention ? 'btn-disabled' : ''}`}
											disabled={
												!hasConvention ||
												isUpdating ||
												isUploading
											}
											onClick={handleViewConvention}
										>
											<FileText size={18} />
											Ver Convenio
										</button>
										<button
											type="button"
											className="btn btn-error btn-soft"
											onClick={() =>
												editModalRef.current?.close()
											}
											disabled={isUpdating || isUploading}
										>
											Cancelar
										</button>
										<button
											type="button"
											className="btn btn-success btn-soft"
											onClick={handleSaveEdit}
											disabled={isUpdating || isUploading}
										>
											{isUpdating || isUploading ? (
												<>
													<Loader2
														size={18}
														className="animate-spin"
													/>
													{isUploading
														? 'Subiendo convenio...'
														: 'Guardando...'}
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
								<div className="modal-box container">
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
										¿Estás seguro que deseas eliminar este
										centro de prácticas?
									</h3>
									<div className="flex flex-col gap-4">
										{deleteError && (
											<div className="alert alert-error">
												<span>{deleteError}</span>
											</div>
										)}
										<div className="bg-neutral/10 border-l-4 border-neutral rounded-lg p-4">
											<p className="font-bold text-neutral mb-2">
												Advertencia: Esta acción no se puede
												deshacer
											</p>
											<p className="text-base-content/80 text-sm">
												Se eliminará permanentemente:
											</p>
											<div className="mt-3 p-3 bg-base-100 rounded-lg">
												<p className="font-semibold text-primary">
													{c.legal_name}
												</p>
											</div>
										</div>
									</div>
									<div className="modal-action">
										<button
											type="button"
											className="btn btn-neutral btn-soft"
											onClick={() =>
												deleteModalRef.current?.close()
											}
											disabled={isDeleting}
										>
											Cancelar
										</button>
										<button
											type="button"
											className="btn btn-error btn-soft"
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
					</Card.Actions>
				</Card.Container>
			</Card.Body>
		</Card>
	);
}
