import { z } from 'zod/v4';

// Regex para títulos: letras (incluyendo acentos), números, espacios y puntuación básica
export const OFFER_TITLE_REGEX =
	/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,\-()]+$/u;

// Regex para descripciones: más permisivo, incluye algunos símbolos adicionales comunes
export const OFFER_DESCRIPTION_REGEX =
	/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,;:!?¿¡\-()/"'%]+$/u;

// Enum de estados de oferta
export const OfferStatusEnum = z.enum([
	'published',
	'closed',
	'filled',
]);

// Schema base para crear una oferta
export const CreateOfferSchema = z.object({
	title: z
		.string()
		.min(5, {
			message: 'El título debe tener al menos 5 caracteres',
		})
		.max(155, {
			message: 'El título no puede exceder 155 caracteres',
		})
		.regex(OFFER_TITLE_REGEX, {
			message:
				'El título contiene caracteres no permitidos',
		})
		.refine((v) => /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(v), {
			message: 'El título debe contener letras',
		}),
	description: z
		.string()
		.min(10, {
			message:
				'La descripción debe tener al menos 10 caracteres',
		})
		.max(255, {
			message:
				'La descripción no puede exceder 255 caracteres',
		})
		.regex(OFFER_DESCRIPTION_REGEX, {
			message:
				'La descripción contiene caracteres no permitidos',
		})
		.refine((v) => /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(v), {
			message: 'La descripción debe contener texto legible',
		}),
	deadline: z.coerce
		.date()
		.refine((date) => date > new Date(), {
			message: 'La fecha límite debe ser en el futuro',
		}),
	status: OfferStatusEnum.optional().default('published'),
	offerTypeIds: z
		.array(z.coerce.number().int().positive())
		.min(1, {
			message:
				'Debe seleccionar al menos un tipo de práctica',
		})
		.max(2, {
			message:
				'No puede seleccionar más de 2 tipos de práctica',
		}),
	internshipCenterId: z.coerce.number().int().positive({
		message:
			'Debe seleccionar un centro de práctica válido',
	}),
});

// Schema para actualizar una oferta (todos los campos opcionales)
export const UpdateOfferSchema = z.object({
	title: z
		.string()
		.min(5, {
			message: 'El título debe tener al menos 5 caracteres',
		})
		.max(155, {
			message: 'El título no puede exceder 155 caracteres',
		})
		.regex(OFFER_TITLE_REGEX, {
			message:
				'El título contiene caracteres no permitidos',
		})
		.refine((v) => /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(v), {
			message: 'El título debe contener letras',
		})
		.optional(),
	description: z
		.string()
		.min(10, {
			message:
				'La descripción debe tener al menos 10 caracteres',
		})
		.max(255, {
			message:
				'La descripción no puede exceder 255 caracteres',
		})
		.regex(OFFER_DESCRIPTION_REGEX, {
			message:
				'La descripción contiene caracteres no permitidos',
		})
		.refine((v) => /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(v), {
			message: 'La descripción debe contener texto legible',
		})
		.optional(),
	deadline: z.coerce
		.date()
		.refine((date) => date > new Date(), {
			message: 'La fecha límite debe ser en el futuro',
		})
		.optional(),
	status: OfferStatusEnum.optional(),
	offerTypeIds: z
		.array(z.coerce.number().int().positive())
		.min(1, {
			message:
				'Debe seleccionar al menos un tipo de práctica',
		})
		.max(2, {
			message:
				'No puede seleccionar más de 2 tipos de práctica',
		})
		.optional(),
	internshipCenterId: z.coerce
		.number()
		.int()
		.positive({
			message:
				'Debe seleccionar un centro de práctica válido',
		})
		.optional(),
});

// Schema completo de una oferta (incluye id y timestamps)
export const OfferSchema = CreateOfferSchema.extend({
	id: z.coerce.number().int().positive(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

// Schema para el tipo de oferta
export const OfferTypeSchema = z.object({
	id: z.coerce.number().int().positive(),
	name: z
		.string()
		.min(2, {
			message: 'El nombre debe tener al menos 2 caracteres',
		})
		.max(150, {
			message: 'El nombre no puede exceder 150 caracteres',
		})
		.regex(OFFER_TITLE_REGEX, {
			message:
				'El nombre contiene caracteres no permitidos',
		}),
	is_active: z.boolean().default(true),
});

// Schema para la relación N:N entre Offer y OfferType
export const OfferOfferTypeSchema = z.object({
	id: z.coerce.number().int().positive(),
	offerId: z.coerce.number().int().positive(),
	offerTypeId: z.coerce.number().int().positive(),
});

// Tipos inferidos
export type TCreateOffer = z.infer<
	typeof CreateOfferSchema
>;
export type TUpdateOffer = z.infer<
	typeof UpdateOfferSchema
>;
export type TOffer = z.infer<typeof OfferSchema>;
export type TOfferType = z.infer<typeof OfferTypeSchema>;
export type TOfferOfferType = z.infer<
	typeof OfferOfferTypeSchema
>;
export type TOfferStatus = z.infer<typeof OfferStatusEnum>;
