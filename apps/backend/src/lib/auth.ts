import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { env } from '@lib/env';

export const auth = betterAuth({
	database: new Pool({
		connectionString: env.DATABASE_URL,
	}),
	emailAndPassword: {
		enabled: true,
	},
	secret: env.BETTER_AUTH_SECRET,
	trustedOrigins: [env.FRONTEND_URL],
	advanced: {
		cookiePrefix: 'ing_sw_practicas',
	},
});
