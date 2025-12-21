import { Outlet } from 'react-router';
import { Menu } from 'lucide-react';

export function Layout() {
	return (
		<div className="flex flex-col h-full">
			<nav className="drawer sticky top-0 z-50 shadow-sm flex-shrink-0">
				<input
					id="my-drawer-2"
					type="checkbox"
					className="drawer-toggle"
				/>
				<div className="drawer-content flex flex-col">
					{/* Navbar */}
					<div className="navbar bg-white w-full h-16">
						<div className="flex-none lg:hidden">
							<label
								htmlFor="my-drawer-2"
								aria-label="open sidebar"
								className="btn btn-square btn-ghost"
							>
								<Menu />
							</label>
						</div>
						<div className="mx-2 flex-1 px-2 font-bold text-lg">
							Ubb practicas
						</div>
						<div className="hidden flex-none lg:block">
							<ul className="menu menu-horizontal">
								{/* Navbar menu content here */}
								<li>
									<a href="/#">Navbar Item 1</a>
								</li>
								<li>
									<a href="/#">Navbar Item 2</a>
								</li>
							</ul>
						</div>
					</div>
					{/* Page content here */}
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
