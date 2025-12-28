import { AppDataSource } from '../../config/db.config';
import {
	InternshipCenter,
	Document,
	User,
} from '@entities';
import path from 'path';

export async function seedInternshipCenters() {
	const repo = AppDataSource.getRepository(
		InternshipCenter,
	);
	const count = await repo.count();
	if (count > 0) {
		console.log(
			'Internship centers ya existen — saltando seed.',
		);
		return;
	}

	const centers: Partial<InternshipCenter>[] = [
		{
			legal_name: 'Centro Tecnologías del Sur Ltda',
			company_rut: '76.789.123-4',
			email: 'recursos@tecsur.cl',
			phone: '+56961234567',
			address: 'Av. Las Condes 1234, Santiago',
			description:
				'Empresa de desarrollo tecnológico, recibe proyectos de estudiantes.',
		},
		{
			legal_name: 'Ingeniería Austral S.A.',
			company_rut: '76.456.321-0',
			email: 'contacto@ingaustral.cl',
			phone: '+56961234568',
			address: 'Calle Prat 987, Valdivia',
			description:
				'Servicios de ingeniería y supervisión con prácticas en terreno.',
		},
		{
			legal_name: 'Laboratorios BioChile Ltda',
			company_rut: '76.987.654-3',
			email: 'info@biochile.cl',
			phone: '+56961234569',
			address: 'Boulevard Kennedy 450, Providencia',
			description:
				'Laboratorio clínico con programas de pasantía e investigación.',
		},
		{
			legal_name: 'Constructora Norte Ltda',
			company_rut: '76.321.987-6',
			email: 'rrhh@constructoranorte.cl',
			phone: '+56961234570',
			address: 'Av. Libertador 201, Antofagasta',
			description:
				'Constructora regional con formación técnica en obra.',
		},
		{
			legal_name: 'Servicios Financieros Andinos S.A.',
			company_rut: '76.654.321-2',
			email: 'talento@andinosfin.cl',
			phone: '+56961234571',
			address: 'Calle Estado 45, Temuco',
			description:
				'Institución financiera con prácticas en atención y análisis.',
		},
		{
			legal_name: 'Agroindustrial Valle Verde Ltda',
			company_rut: '76.111.222-3',
			email: 'contacto@valleverde.cl',
			phone: '+56961234572',
			address: 'Camino Real 234, Rancagua',
			description:
				'Empresa agroindustrial con pasantías en producción.',
		},
		{
			legal_name: 'Consultora DataMaps SpA',
			company_rut: '76.222.333-4',
			email: 'hello@datamaps.cl',
			phone: '+56961234573',
			address: 'Cerro Santa Lucía 12, Santiago',
			description:
				'Consultora en análisis de datos y GIS para proyectos estudiantiles.',
		},
		{
			legal_name: 'Energías Renovables del Norte S.A.',
			company_rut: '76.333.444-5',
			email: 'rrhh@ern.cl',
			phone: '+56961234574',
			address: 'Ruta 1 km 15, Iquique',
			description:
				'Proyectos eólicos y solares con pasantías técnicas.',
		},
		{
			legal_name: 'Diseño y Arquitectura Urbana Ltda',
			company_rut: '76.444.555-6',
			email: 'contacto@duarquitectura.cl',
			phone: '+56961234575',
			address: 'Pasaje Alto 56, Concepción',
			description:
				'Estudio de arquitectura con proyectos para estudiantes.',
		},
		{
			legal_name: 'Comercializadora MedTech SpA',
			company_rut: '76.555.666-7',
			email: 'ventas@medtech.cl',
			phone: '+56961234576',
			address: 'Av. Manuel Montt 220, Santiago',
			description:
				'Distribución de equipos médicos con área técnica.',
		},
		{
			legal_name: 'Plásticos y Moldes del Sur Ltda',
			company_rut: '76.666.777-8',
			email: 'produccion@plastsur.cl',
			phone: '+56961234577',
			address: 'Parque Industrial, Talcahuano',
			description:
				'Fábrica con programa de prácticas técnicas y operativas.',
		},
		{
			legal_name: 'Telecomunicaciones Austral S.A.',
			company_rut: '76.777.888-9',
			email: 'soporte@teleaustral.cl',
			phone: '+56961234578',
			address: "Av. Bernardo O'Higgins 150, Punta Arenas",
			description:
				'Operador regional con pasantías en redes y telecomunicaciones.',
		},
	];

	const savedCenters = await repo.save(
		centers as InternshipCenter[],
	);

	// Añadir convenios (documentos) a algunos centros
	try {
		const docRepo = AppDataSource.getRepository(Document);
		const userRepo = AppDataSource.getRepository(User);
		let systemUser = await userRepo.findOne({
			where: { email: 'system@example.com' },
		});
		if (!systemUser) {
			// fallback: usar primer usuario existente
			systemUser = (await userRepo.find({ take: 1 }))[0];
		}

		const templatePath = path.join(
			process.cwd(),
			'apps/backend/src/archives/convention/convenio_practica_plantilla.pdf',
		);

		// Asociar documento de convenio a algunos centros (cada 3º centro)
		for (let i = 0; i < savedCenters.length; i++) {
			if (i % 3 !== 0) continue;
			const center = savedCenters[i];
			const doc = new Document();
			doc.file_name = 'convenio_practica_plantilla.pdf';
			doc.file_path = templatePath;
			doc.mime_type = 'application/pdf';
			doc.uploaded_at = new Date();
			doc.uploader = systemUser as User;
			const savedDoc = await docRepo.save(doc);
			center.convention_document = savedDoc;
			await repo.save(center);
		}
	} catch (err) {
		const msg =
			err instanceof Error ? err.message : String(err);
		console.warn(
			'No se pudo crear/adjuntar documentos de convenio:',
			msg,
		);
	}

	console.log('Seed: internship centers creados.');
}
