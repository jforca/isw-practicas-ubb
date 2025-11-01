import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod/v4';

export const env = createEnv({
	server: {
		DATABASE_URL: z.url(),
		BETTER_AUTH_SECRET: z.string().min(5),
		FRONTEND_URL: z.url(),
		PORT: z.coerce.number(),
	},
	runtimeEnv: process.env,
});
