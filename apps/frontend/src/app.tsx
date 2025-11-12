import { BrowserRouter, Routes, Route } from 'react-router';
import {
	LoginPage,
	InternshipCentersPage,
	NotFoundPage,
} from '@modules';
// import { Auth } from '@common/components/auth';
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
				{/* /app/nombre-ruta */}
				{/* <Route element={<Auth />}></Route> */}
				<Route path="app">
					<Route
						path="internship-centers"
						element={<InternshipCentersPage />}
					/>
				</Route>

				{/* <Route element={<AuthLayout />}>
					<Route path="login" element={<Login />} />
					<Route path="register" element={<Register />} />
				</Route> */}

				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
