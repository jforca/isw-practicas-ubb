import { z } from 'zod/v4';

export const AccountSchema = z.object({
	id: z.string(),
	accountId: z.string(),
	providerId: z.string(),
	userId: z.string(),
	accessToken: z.string().nullable(),
	refreshToken: z.string().nullable(),
	idToken: z.string().nullable(),
	accessTokenExpiresAt: z.coerce.date().nullable(),
	refreshTokenExpiresAt: z.coerce.date().nullable(),
	scope: z.string().nullable(),
	password: z.string().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});
