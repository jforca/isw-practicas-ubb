import { z } from 'zod/v4';

export const SessionSchema = z.object({
	id: z.string(),
	expiresAt: z.coerce.date(),
	token: z.string(),
	ipAddress: z.string().nullable(),
	userAgent: z.string().nullable(),
	userId: z.string().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type TSession = z.infer<typeof SessionSchema>;
