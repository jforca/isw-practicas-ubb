import { AppDataSource } from '../../config/db.config';
import {
	Offer,
	OffersType,
	Coordinator,
	InternshipCenter,
	OfferOfferType,
} from '@entities';

export async function seedOffers() {
	const repo = AppDataSource.getRepository(Offer);
	const typeRepo = AppDataSource.getRepository(OffersType);
	const coordRepo =
		AppDataSource.getRepository(Coordinator);
	const centerRepo = AppDataSource.getRepository(
		InternshipCenter,
	);

	const count = await repo.count();
	if (count > 0) {
		console.log('Offers ya existen — saltando seed.');
		return;
	}

	const type1 = await typeRepo.findOne({
		where: { name: 'PRACTICA 1' },
	});
	const type2 = await typeRepo.findOne({
		where: { name: 'PRACTICA 2' },
	});
	const coordinators = await coordRepo.find();
	const centers = await centerRepo.find();

	if (!type1 && !type2) {
		console.log(
			'No se encontraron tipos de oferta (PRACTICA 1/2).',
		);
		return;
	}
	if (!coordinators.length || !centers.length) {
		console.log(
			'Faltan coordinadores o centros para crear offers.',
		);
		return;
	}

	const baseDate = new Date();
	const samples = [
		{
			title: 'Desarrollador Fullstack - Práctica',
			description:
				'Integración a equipo de desarrollo para trabajar en aplicaciones web (React/Node).',
		},
		{
			title: 'Analista de Datos - Práctica',
			description:
				'Apoyo en limpieza de datos, visualización y generación de reportes con Python/SQL.',
		},
		{
			title: 'Ingeniería de Campo - Práctica',
			description:
				'Pasantía en obra supervisando instalaciones y apoyo en control de calidad.',
		},
		{
			title: 'Asistente de Laboratorio - Práctica',
			description:
				'Apoyo en procesos de laboratorio clínico y manejo de muestras bajo supervisión.',
		},
		{
			title: 'Marketing Digital - Práctica',
			description:
				'Soporte en campañas digitales, creación de contenido y métricas.',
		},
		{
			title: 'Soporte Técnico de Redes - Práctica',
			description:
				'Instalación y mantención de redes; pruebas y monitoreo bajo supervisión.',
		},
		{
			title: 'Producción Industrial - Práctica',
			description:
				'Participación en línea de producción, control de calidad y mejora continua.',
		},
		{
			title: 'UX/UI Designer - Práctica',
			description:
				'Diseño y prototipado de interfaces, tests de usabilidad y documentación.',
		},
		{
			title: 'Técnico en Energías Renovables - Práctica',
			description:
				'Instalación y mantenimiento de equipos solares y eólicos en terreno.',
		},
		{
			title: 'Logística y Supply Chain - Práctica',
			description:
				'Apoyo en gestión de inventarios, despacho y coordinación logística.',
		},
		{
			title: 'Análisis Financiero Junior - Práctica',
			description:
				'Modelamiento básico, análisis de estados y apoyo en reportes financieros.',
		},
		{
			title: 'Desarrollo de Producto - Práctica',
			description:
				'Apoyo en ciclos de desarrollo, pruebas de concepto y coordinación con stakeholders.',
		},
	];

	const offersPayload: Partial<Offer>[] = samples.map(
		(s, i) => {
			const deadline = new Date(baseDate.getTime());
			deadline.setDate(deadline.getDate() + (i + 1) * 7);

			const coordinator =
				coordinators[i % coordinators.length];
			const center = centers[i % centers.length];

			return {
				title: s.title,
				description: s.description,
				deadline,
				coordinator,
				internshipCenter: center,
			} as Partial<Offer>;
		},
	);

	// Guardar ofertas primero (sin relación many-to-many)
	const created = await repo.save(offersPayload as Offer[]);

	// Crear filas en tabla intermedia `offer_offer_type`
	const ootRepo =
		AppDataSource.getRepository(OfferOfferType);
	const ootRows: Partial<OfferOfferType>[] = [];

	created.forEach((offer, i) => {
		// Decide asignación de tipos: algunos con ambos, otros alternando
		const assignBoth = i % 5 === 0; // cada 5ª oferta tendrá ambos tipos
		const chosen = assignBoth
			? ([type1, type2].filter(Boolean) as OffersType[])
			: ([i % 2 === 0 ? type1 : type2].filter(
					Boolean,
				) as OffersType[]);

		chosen.forEach((t) => {
			ootRows.push({
				offer,
				offerType: t,
			} as Partial<OfferOfferType>);
		});
	});

	if (ootRows.length) {
		await ootRepo.save(ootRows as OfferOfferType[]);
	}

	console.log(
		'Seed: offers creadas y vinculadas a offers-types.',
	);
}
