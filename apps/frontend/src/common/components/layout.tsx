import {
	BookCheck,
	Briefcase,
	Building,
	ClipboardList,
	LogOut,
	Menu,
	School,
	UserCircle2,
	UsersRound,
	Book,
	FileText,
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router';

export function Layout() {
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
										to="/app/applications-management"
										className={({ isActive }) =>
											`flex flex-col items-center gap-1${isActive ? ' text-primary' : ''}`
										}
									>
										<ClipboardList size={28} />
										<span className="paragraph-1">
											Postulaciones
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
								className="cursor-pointer flex"
							>
								<div className="avatar">
									<div className="mask mask-squircle w-12">
										<img
											alt="asd"
											src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
										/>
									</div>
								</div>
								<div className="text-left ml-2">
									<div className="text-sm">
										Nombre Apellido
									</div>
									<div className="text-xs text-base-content/60">
										Rol usuario
									</div>
								</div>
							</button>
							<ul
								tabIndex={-1}
								className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm mt-4"
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
									<NavLink
										to="/#"
										className="text-base-content/80"
									>
										<LogOut size={18} />
										Salir
									</NavLink>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="drawer-side">
					<label
						htmlFor="my-drawer-2"
						aria-label="close sidebar"
						className="drawer-overlay"
					></label>
					<ul className="menu bg-base-200 min-h-full w-80 p-4">
						<h2 className="text-center font-bold subtitle-1 mb-4">
							Ubb practicas
						</h2>
						<li>
							<NavLink
								to="/app/internship-centers"
								className={({ isActive }) =>
									`flex items-center gap-1${isActive ? ' text-primary' : ''}`
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
									`flex items-center gap-1${isActive ? ' text-primary' : ''}`
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
									`flex gap-1${isActive ? ' text-primary' : ''}`
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
								to="/app/logbook"
								className={({ isActive }) =>
									`flex gap-1${isActive ? ' text-primary' : ''}`
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
									`flex gap-1${isActive ? ' text-primary' : ''}`
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
			</nav>
			<main className="flex-1 overflow-y-auto py-8">
				<div className="container">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
