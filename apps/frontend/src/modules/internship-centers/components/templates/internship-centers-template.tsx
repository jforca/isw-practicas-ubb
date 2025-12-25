import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { TInternshipCenter } from '@packages/schema/internship-centers.schema';
import type {
	TPagination,
	TFilters,
} from '@modules/internship-centers/hooks/find-many-internship-center.hook';
import {
	InternshipCenterCards,
	InternshipCenterHeader,
} from '@modules/internship-centers/components/organisms';
import { SearchBar } from '@common/components';
import { UseCreateOneInternshipCenter } from '@modules/internship-centers/hooks/create-one-internship-center.hook';
import { useUploadConvention } from '@modules/internship-centers/hooks/upload-convention.hook';
import {
	Plus,
	IdCard,
	MapPin,
	Phone,
	Mail,
	FileText,
	Loader2,
} from 'lucide-react';

type TInternshipCentersTemplateProps = {
	centers: TInternshipCenter[];
	pagination: TPagination;
	filters: TFilters;
	isLoading: boolean;
	error: string | null;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onNextPage: () => void;
	onPrevPage: () => void;
	onLimitChange: (limit: number) => void;
	onRefresh: () => void;
	onSearch: (search: string) => void;
	onFilterConvention: (
		hasConvention: TFilters['hasConvention'],
	) => void;
};

export function InternshipCentersTemplate({
	centers,
	pagination,
	filters,
	isLoading,
	error,
	currentPage,
	totalPages,
	onPageChange,
	onNextPage,
	onPrevPage,
	onLimitChange,
	onRefresh,
	onSearch,
	onFilterConvention,
}: TInternshipCentersTemplateProps) {
	// Estado del formulario de creación
	const [createForm, setCreateForm] = useState({
		legal_name: '',
		company_rut: '',
		email: '',
		phone: '',
		address: '',
		description: '',
	});
	const [conventionFile, setConventionFile] =
		useState<File | null>(null);

	// Referencia al modal de crear
	const createModalRef = useRef<HTMLDialogElement>(null);

	// Hooks
	const {
		handleCreateOne,
		isLoading: isCreating,
		error: createError,
	} = UseCreateOneInternshipCenter();

	const {
		handleUpload,
		isLoading: isUploading,
		error: uploadError,
	} = useUploadConvention();

	// Handlers
	const handleInputChange = (
		field: keyof typeof createForm,
		value: string,
	) => {
		setCreateForm((prev) => ({ ...prev, [field]: value }));
	};

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

	const handleOpenCreateModal = () => {
		setCreateForm({
			legal_name: '',
			company_rut: '',
			email: '',
			phone: '',
			address: '',
			description: '',
		});
		setConventionFile(null);
		createModalRef.current?.showModal();
	};

	const handleCreate = async () => {
		const result = await handleCreateOne({
			...createForm,
			convention_document_id: null,
		});

		if (!result) return;

		// Si hay archivo de convenio, subirlo
		if (conventionFile) {
			await handleUpload(result.id, conventionFile);
		}

		createModalRef.current?.close();
		onRefresh();
	};

	return (
		<section className="section-base">
			<InternshipCenterHeader />

			{/* Barra de búsqueda y filtros */}
			<div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
				<div className="flex-1">
					<SearchBar
						placeholder="Buscar por nombre o RUT de empresa..."
						onSearch={onSearch}
					/>
				</div>

				{/* Filtro de convenio */}
				<select
					className="select select-bordered"
					value={filters.hasConvention}
					onChange={(e) =>
						onFilterConvention(
							e.target.value as TFilters['hasConvention'],
						)
					}
				>
					<option value="all">Todos</option>
					<option value="true">Con convenio</option>
					<option value="false">Sin convenio</option>
				</select>

				{/* Botón de crear */}
				<button
					type="button"
					className="btn btn-primary"
					onClick={handleOpenCreateModal}
				>
					<Plus size={18} />
					Nuevo Centro
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
							Crear Nuevo Centro de Prácticas
						</h3>
						<div className="flex flex-col gap-4">
							{createError && (
								<div className="alert alert-error">
									<span>{createError}</span>
								</div>
							)}
							{uploadError && (
								<div className="alert alert-error">
									<span>{uploadError}</span>
								</div>
							)}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="flex flex-col gap-2 text-base-content/80">
									<h4>
										<IdCard
											size={18}
											className="inline mr-2"
										/>
										Nombre Legal *
									</h4>
									<input
										type="text"
										value={createForm.legal_name}
										onChange={(e) =>
											handleInputChange(
												'legal_name',
												e.target.value,
											)
										}
										className="input w-full rounded-lg"
										disabled={isCreating || isUploading}
										placeholder="Nombre de la empresa"
									/>
								</div>
								<div className="flex flex-col gap-2 text-base-content/80">
									<h4>
										<IdCard
											size={18}
											className="inline mr-2"
										/>
										Rut Empresa *
									</h4>
									<input
										type="text"
										value={createForm.company_rut}
										onChange={(e) =>
											handleInputChange(
												'company_rut',
												e.target.value,
											)
										}
										className="input w-full rounded-lg"
										disabled={isCreating || isUploading}
										placeholder="12.345.678-9"
									/>
								</div>
								<div className="flex flex-col gap-2 text-base-content/80">
									<h4>
										<Phone
											size={18}
											className="inline mr-2"
										/>
										Teléfono *
									</h4>
									<input
										type="tel"
										value={createForm.phone}
										onChange={(e) =>
											handleInputChange(
												'phone',
												e.target.value,
											)
										}
										className="input w-full rounded-lg"
										disabled={isCreating || isUploading}
										placeholder="+56 9 1234 5678"
									/>
								</div>
								<div className="flex flex-col gap-2 text-base-content/80">
									<h4>
										<Mail
											size={18}
											className="inline mr-2"
										/>
										Correo Electrónico *
									</h4>
									<input
										type="email"
										value={createForm.email}
										onChange={(e) =>
											handleInputChange(
												'email',
												e.target.value,
											)
										}
										className="input w-full rounded-lg"
										disabled={isCreating || isUploading}
										placeholder="correo@empresa.com"
									/>
								</div>
							</div>
							<div className="flex flex-col gap-2 text-base-content/80">
								<h4>
									<MapPin
										size={18}
										className="inline mr-2"
									/>
									Dirección *
								</h4>
								<input
									type="text"
									value={createForm.address}
									onChange={(e) =>
										handleInputChange(
											'address',
											e.target.value,
										)
									}
									className="input w-full rounded-lg"
									disabled={isCreating || isUploading}
									placeholder="Dirección completa"
								/>
							</div>
							<div className="flex flex-col gap-2 text-base-content/80">
								<h4>Descripción *</h4>
								<input
									type="text"
									value={createForm.description}
									onChange={(e) =>
										handleInputChange(
											'description',
											e.target.value,
										)
									}
									className="input w-full rounded-lg"
									disabled={isCreating || isUploading}
									placeholder="Breve descripción del centro"
								/>
							</div>
							{/* Sección de Convenio */}
							<div className="flex flex-col gap-2 text-base-content/80">
								<h4>
									<FileText
										size={18}
										className="inline mr-2"
									/>
									Convenio (PDF) - Opcional
								</h4>
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-2 p-2 bg-info/10 rounded-lg">
										<FileText
											size={16}
											className="text-info"
										/>
										<span className="text-sm text-info">
											Puede agregar el convenio ahora o
											después
										</span>
									</div>
									<input
										type="file"
										accept="application/pdf"
										onChange={handleFileChange}
										className="file-input file-input-bordered w-full"
										disabled={isCreating || isUploading}
									/>
									{conventionFile && (
										<div className="flex items-center gap-2 p-2 bg-success/10 rounded-lg">
											<FileText
												size={16}
												className="text-success"
											/>
											<span className="text-sm text-success">
												Archivo seleccionado:{' '}
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
								className="btn btn-error btn-soft"
								onClick={() =>
									createModalRef.current?.close()
								}
								disabled={isCreating || isUploading}
							>
								Cancelar
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={handleCreate}
								disabled={isCreating || isUploading}
							>
								{isCreating || isUploading ? (
									<>
										<Loader2
											size={18}
											className="animate-spin"
										/>
										{isUploading
											? 'Subiendo convenio...'
											: 'Creando...'}
									</>
								) : (
									<>
										<Plus size={18} />
										Crear Centro
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

			<InternshipCenterCards
				data={centers}
				pagination={pagination}
				isLoading={isLoading}
				error={error}
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={onPageChange}
				onNextPage={onNextPage}
				onPrevPage={onPrevPage}
				onLimitChange={onLimitChange}
				onRefresh={onRefresh}
			/>
		</section>
	);
}
