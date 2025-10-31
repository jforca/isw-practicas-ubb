import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod/v4';

export const env = createEnv({
	clientPrefix: 'VITE_',
	client: {
		VITE_BACKEND_URL: z.url(),
	},

	runtimeEnv: import.meta.env,
});
