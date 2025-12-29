import { authClient } from '@lib/auth-client';
import { useCallback } from 'react';

export function useAuth() {
	// Hook for authentication
	const getSession = useCallback(async () => {
		const { data: session, error } =
			await authClient.getSession();

		return { session, error };
	}, []);

	const signInEmail = useCallback(
		async (
			email: string,
			password: string,
			rememberMe: boolean,
		) => {
			const { data, error } = await authClient.signIn.email(
				{
					email: email,
					password: password,
					rememberMe: rememberMe,
					callbackURL: '/app',
				},
			);

			return { data, error };
		},
		[],
	);

	const signUp = useCallback(
		async (
			email: string,
			password: string,
			name: string,
		) => {
			const { data, error } = await authClient.signUp.email(
				{
					email: email,
					password: password,
					name: name,
				},
			);

			return { data, error };
		},
		[],
	);

	return { signInEmail, getSession, signUp };
}
