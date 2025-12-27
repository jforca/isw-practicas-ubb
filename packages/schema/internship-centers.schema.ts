import {
	ChileanNumberRegex,
	ChileanRUTRegex,
} from '../utils/regex.utils';
import { z } from 'zod/v4';

export const NAME_REGEX =
	/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,&\-()]+$/u;
export const ADDRESS_REGEX =
	/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,º#\-/()]+$/u;

export const InternshipCentersSchema = z.object({
	id: z.coerce.number().int().positive(),
	legal_name: z
		.string()
		.min(2, { message: 'legal_name demasiado corto' })
		.max(255)
		.regex(NAME_REGEX, {
			message: 'legal_name contiene caracteres inválidos',
		})
		.refine((v) => /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(v), {
			message: 'legal_name debe contener letras',
		}),
	company_rut: z
		.string()
		.min(6, { message: 'company_rut demasiado corto' })
		.max(20)
		.refine(
			(v) => ChileanRUTRegex.test(v.replace(/\./g, '')),
			{ message: 'company_rut inválido' },
		),
	email: z.email(),
	phone: z.string().regex(ChileanNumberRegex),
	address: z
		.string()
		.min(5, { message: 'address demasiado corto' })
		.max(100)
		.regex(ADDRESS_REGEX, {
			message: 'address contiene caracteres inválidos',
		})
		.refine((v) => /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(v), {
			message: 'address debe contener letras',
		}),
	description: z
		.string()
		.min(10, { message: 'description demasiado corto' })
		.max(250)
		.refine((v) => /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(v), {
			message: 'description debe contener texto legible',
		}),
	convention_document_id: z.coerce
		.number()
		.int()
		.positive()
		.nullable()
		.default(null),
	convention_document_name: z
		.string()
		.nullable()
		.default(null),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type TInternshipCenter = z.infer<
	typeof InternshipCentersSchema
>;
