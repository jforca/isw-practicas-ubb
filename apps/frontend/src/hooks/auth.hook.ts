import { authClient } from '@lib/auth-client';

export function useAuth() {
	const getSession = async () => {
		const { data: session, error } =
			await authClient.getSession();

		return { session, error };
	};

	const signInEmail = async (
		email: string,
		password: string,
		rememberMe: boolean,
	) => {
		const { data, error } = await authClient.signIn.email({
			email: email,
			password: password,
			rememberMe: rememberMe,
			callbackURL: '/app',
		});

		return { data, error };
	};

	const signUp = async (
		email: string,
		password: string,
		name: string,
	) => {
		const { data, error } = await authClient.signUp.email({
			email: email,
			password: password,
			name: name,
		});

		return { data, error };
	};

	return { signInEmail, getSession, signUp };
}
