import { Outlet, Link } from 'react-router';
import {
	Menu,
	Settings,
	Pen,
	Building,
	Book,
} from 'lucide-react';

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
						<Link
							to="/app"
							className="font-bold subtitle-1"
						>
							Ubb practicas
						</Link>
						<div className="flex-1 hidden lg:flex justify-center">
							<ul className="menu menu-horizontal">
								<li>
									<Link
										to="/app/internship-centers"
										className="flex flex-col items-center gap-1"
									>
										<Building size={28} />
										<span className="paragraph-1">
											Centro de practica
										</span>
									</Link>
								</li>
								<li>
									<Link
										to="/app/offers"
										className="flex flex-col items-center gap-1"
									>
										<Book size={28} />
										<span className="paragraph-1">
											Ofertas
										</span>
									</Link>
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
									<div className="text-sm">Nombre</div>
									<div className="text-xs text-base-content/60">
										Cargo
									</div>
								</div>
							</button>
							<ul
								tabIndex={-1}
								className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm mt-4"
							>
								<li>
									<a href="/#">
										<Pen /> Perfil
									</a>
								</li>
								<li>
									<a href="/#">
										<Settings />
										Configuración
									</a>
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
						{/* Sidebar content here */}
						<li>
							<a href="/#">Sidebaa Item 1</a>
						</li>
						<li>
							<a href="/#">Sidebaa Item 2</a>
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
