import { useAuth } from '@common/hooks/auth.hook';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

export function Auth({
	allowedRoles,
}: {
	allowedRoles?: string[];
}) {
	const { getSession } = useAuth();
	const [isAuthenticated, setIsAuthenticated] = useState<
		boolean | null
	>(null);
	const [userRole, setUserRole] = useState<string | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const { session, error } = await getSession();

				if (error || !session) {
					setIsAuthenticated(false);
				} else {
					setIsAuthenticated(true);
					// @ts-expect-error: better-auth types might not be fully inferred here yet
					setUserRole(session.user.user_role);
				}
			} catch (error) {
				console.error(
					'Error verificando autenticación:',
					error,
				);
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, [getSession]);

	if (isLoading) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
				}}
			>
				<span className="loading loading-spinner loading-lg text-primary"></span>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	if (allowedRoles) {
		if (!userRole || !allowedRoles.includes(userRole)) {
			// Si hay roles permitidos definidos, y el usuario NO tiene rol O su rol no está en la lista -> Redirigir
			return <Navigate to="/" replace />;
		}
	}

	return <Outlet />;
}
