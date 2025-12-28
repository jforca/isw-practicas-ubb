import { z } from 'zod';

const hasLettersRegex = /[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]/;

export const CreateLogbookSchema = z.object({
	title: z
		.string({
			message: 'El título es obligatorio y debe ser texto',
		})
		.min(10, 'El título debe tener al menos 10 caracteres')
		.max(
			155,
			'El título no puede exceder los 155 caracteres',
		)
		.regex(
			hasLettersRegex,
			'El título debe contener texto descriptivo',
		),

	content: z
		.string({
			message:
				'El contenido es obligatorio y debe ser texto',
		})
		.min(
			50,
			'El contenido debe tener al menos 50 caracteres',
		)
		.max(
			2000,
			'El contenido no puede exceder los 2000 caracteres',
		)
		.regex(
			hasLettersRegex,
			'El contenido debe tener una redacción válida',
		),

	internshipId: z.coerce
		.number({
			message:
				'El ID de práctica debe ser un número válido',
		})
		.int()
		.positive(),
});

export const LogbookSchema = CreateLogbookSchema.extend({
	id: z.coerce.number(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type TCreateLogbook = z.infer<
	typeof CreateLogbookSchema
>;
export type TLogbookEntry = z.infer<typeof LogbookSchema>;
