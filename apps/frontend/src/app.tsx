import { BrowserRouter, Routes, Route } from 'react-router';
import { LoginPage } from '@modules/login/components/pages/login-page';
import { Auth } from '@common/components/auth';
import {
	ReportPage,
	SupervisorPage,
} from '@modules/internship-evaluation/components/pages';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/*Public Routes */}
				<Route index element={<LoginPage />} />
				{/* Internship evaluation public routes */}
				<Route
					path="internship/report"
					element={<ReportPage />}
				/>
				<Route
					path="internship/supervisor"
					element={<SupervisorPage />}
				/>

				{/*Private Routes - Protegidas por autenticación */}
				<Route path="/app" element={<Auth />}>
					{/* Aquí van todas las rutas que requieren autenticación */}
					{/* Ejemplo: */}
					{/* <Route path="/app" element={<Dashboard />} /> */}
					{/* <Route path="/profile" element={<Profile />} /> */}
				</Route>

				{/* <Route path="about" element={<About />} /> */}

				{/* <Route element={<AuthLayout />}>
					<Route path="login" element={<Login />} />
					<Route path="register" element={<Register />} />
				</Route> */}

				{/* <Route path="concerts">
					<Route index element={<ConcertsHome />} />
					<Route path=":city" element={<City />} />
					<Route path="trending" element={<Trending />} />
				</Route> */}
			</Routes>
		</BrowserRouter>
	);
}

export default App;
