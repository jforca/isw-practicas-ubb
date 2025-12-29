import { useNavigate } from 'react-router';
import {
	BookCheck,
	Briefcase,
	Building,
	LogOut,
	Menu,
	UserCircle2,
	UsersRound,
	Book,
	FileText,
	FileStack,
	School,
} from 'lucide-react';
import { useAuth } from '@common/hooks/auth.hook';
import { useEffect, useState } from 'react';
import { authClient } from '@lib/auth-client';
import { NavLink, Outlet } from 'react-router';

export function Layout() {
	const { getSession } = useAuth();
	const navigate = useNavigate();
	const [userRole, setUserRole] = useState<string | null>(
		null,
	);
	const [userName, setUserName] = useState<string>('');

	useEffect(() => {
		const loadSession = async () => {
			const { session } = await getSession();
			if (session?.user) {
				// @ts-expect-error: better-auth types
				setUserRole(session.user.user_role);
				setUserName(session.user.name);
			}
		};
		loadSession();
	}, [getSession]);

	const handleLogout = async () => {
		await authClient.signOut();
		navigate('/');
	};

	const renderLinks = () => {
		if (!userRole) return null;

		if (userRole === 'coordinator') {
			return (
				<>
					<li>
						<NavLink
							to="/app/students"
							className={({ isActive }) =>
								`flex flex-col lg:flex-row items-center gap-1${isActive ? ' text-primary' : ''}`
							}
						>
							<UsersRound size={28} />
							<span className="paragraph-1">Alumnos</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/app/internship-centers"
							className={({ isActive }) =>
								`flex flex-col lg:flex-row items-center gap-1${isActive ? ' text-primary' : ''}`
							}
						>
							<Building size={28} />
							<span className="paragraph-1">Centros</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/app/offers"
							className={({ isActive }) =>
								`flex flex-col lg:flex-row items-center gap-1${isActive ? ' text-primary' : ''}`
							}
						>
							<Briefcase size={28} />
							<span className="paragraph-1">Ofertas</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/app/internship/evaluations"
							className={({ isActive }) =>
								`flex flex-col lg:flex-row items-center gap-1${isActive ? ' text-primary' : ''}`
							}
						>
							<BookCheck size={28} />
							<span className="paragraph-1">
								Evaluaciones
							</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/app/reports"
							className={({ isActive }) =>
								`flex flex-col lg:flex-row items-center gap-1${isActive ? ' text-primary' : ''}`
							}
						>
							<FileText size={28} />
							<span className="paragraph-1">Informes</span>
						</NavLink>
					</li>
				</>
			);
		}

		if (userRole === 'student') {
			return (
				<>
					<li>
						<NavLink
							to="/app/logbook"
							className={({ isActive }) =>
								`flex flex-col lg:flex-row items-center gap-1${isActive ? ' text-primary' : ''}`
							}
						>
							<Book size={28} />
							<span className="paragraph-1">Bitácora</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/app/my-applications"
							className={({ isActive }) =>
								`flex flex-col lg:flex-row items-center gap-1${isActive ? ' text-primary' : ''}`
							}
						>
							<FileStack size={28} />
							<span className="paragraph-1">
								Mis Postulaciones
							</span>
						</NavLink>
					</li>
					{/* 
                    <li>
                        <NavLink
                            to="/app/offers"
                            className={({ isActive }) =>
                                `flex flex-col lg:flex-row items-center gap-1${isActive ? ' text-primary' : ''}`
                            }
                        >
                            <Briefcase size={28} />
                            <span className="paragraph-1">Ofertas</span>
                        </NavLink>
                    </li> 
                    */}
				</>
			);
		}

		if (userRole === 'supervisor') {
			return (
				<li>
					<NavLink
						to="/app/internship/supervisor"
						className={({ isActive }) =>
							`flex flex-col lg:flex-row items-center gap-1${isActive ? ' text-primary' : ''}`
						}
					>
						<School size={28} />
						<span className="paragraph-1">Supervisor</span>
					</NavLink>
				</li>
			);
		}

		return null;
	};

	return (
		<div className="flex flex-col h-full">
			<nav className="drawer sticky top-0 z-50 shadow-sm shrink-0">
				<input
					id="my-drawer-2"
					type="checkbox"
					className="drawer-toggle"
				/>
				<div className="drawer-content flex flex-col bg-white ">
					{/* Navbar */}
					<div className="navbar h-20 w-[95%] mx-auto">
						<div className="flex-none lg:hidden">
							<label
								htmlFor="my-drawer-2"
								aria-label="open sidebar"
								className="btn btn-square btn-ghost"
							>
								<Menu />
							</label>
						</div>
						<h2 className="font-bold subtitle-1 hidden lg:flex">
							Ubb practicas
						</h2>
						<div className="flex-1 hidden lg:flex justify-center">
							<ul className="menu menu-horizontal">
								<li>
									<NavLink
										to="/app/internship-centers"
										className={({ isActive }) =>
											`flex flex-col items-center gap-1${isActive ? ' text-primary' : ''}`
										}
									>
										<Building size={28} />
										<span className="paragraph-1">
											Centro de practica
										</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/app/offers"
										className={({ isActive }) =>
											`flex flex-col items-center gap-1${isActive ? ' text-primary' : ''}`
										}
									>
										<Briefcase size={28} />
										<span className="paragraph-1">
											Ofertas
										</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/app/internship/evaluations"
										className={({ isActive }) =>
											`flex flex-col items-center gap-1${isActive ? ' text-primary' : ''}`
										}
									>
										<BookCheck size={28} />
										<span className="paragraph-1">
											Evaluaciones
										</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/app/internship/supervisor"
										className={({ isActive }) =>
											`flex flex-col items-center gap-1${isActive ? ' text-primary' : ''}`
										}
									>
										<School size={28} />
										<span className="paragraph-1">
											Supervisor
										</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/app/students"
										className={({ isActive }) =>
											`flex flex-col items-center gap-1${isActive ? ' text-primary' : ''}`
										}
									>
										<UsersRound size={28} />
										<span className="paragraph-1">
											Alumnos
										</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/app/logbook"
										className={({ isActive }) =>
											`flex flex-col items-center gap-1${isActive ? ' text-primary' : ''}`
										}
									>
										<Book size={28} />
										<span className="paragraph-1">
											Bitácora
										</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/app/reports"
										className={({ isActive }) =>
											`flex flex-col items-center gap-1${isActive ? ' text-primary' : ''}`
										}
									>
										<FileText size={28} />
										<span className="paragraph-1">
											Informe final
										</span>
									</NavLink>
								</li>
							</ul>
						</div>

						<div className="flex-1 lg:flex-none"></div>

						<div className="dropdown dropdown-bottom dropdown-end flex-none">
							<button
								tabIndex={0}
								type="button"
								className="cursor-pointer flex items-center"
							>
								<div className="avatar">
									<div className="mask mask-squircle w-10 h-10">
										<img
											alt="Avatar"
											src="https://img.daisyui.com/images/profile/demo/2@94.webp"
										/>
									</div>
								</div>
								<div className="text-left ml-2 hidden sm:block">
									<div className="text-sm font-bold">
										{userName || 'Usuario'}
									</div>
									<div className="text-xs text-base-content/60 capitalize">
										{userRole || 'Rol'}
									</div>
								</div>
							</button>
							<ul
								tabIndex={-1}
								className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-sm mt-4"
							>
								<li>
									<NavLink
										to="/app/user-profile"
										className="text-base-content/80"
									>
										<UserCircle2 size={18} /> Perfil
									</NavLink>
								</li>

								<li>
									<button
										type="button"
										onClick={handleLogout}
										className="text-base-content/80"
									>
										<LogOut size={18} />
										Salir
									</button>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="drawer-side z-50">
					<label
						htmlFor="my-drawer-2"
						aria-label="close sidebar"
						className="drawer-overlay"
					></label>
					<ul className="menu bg-base-200 min-h-full w-80 p-4 gap-2">
						<h2 className="text-center font-bold subtitle-1 mb-4">
							Ubb practicas
						</h2>
						{renderLinks()}
					</ul>
				</div>
			</nav>
			<main className="flex-1 overflow-y-auto py-8">
				<div className="container mx-auto px-4">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
