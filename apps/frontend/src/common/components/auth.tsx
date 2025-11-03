import { useAuth } from '@common/hooks/auth.hook';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

export function Auth() {
	const { getSession } = useAuth();
	const [isAuthenticated, setIsAuthenticated] = useState<
		boolean | null
	>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const { session, error } = await getSession();

				if (error || !session) {
					setIsAuthenticated(false);
				} else {
					setIsAuthenticated(true);
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
				<p>Cargando...</p>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}
