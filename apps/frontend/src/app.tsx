import { BrowserRouter, Routes, Route } from 'react-router';
import {
	LoginPage,
	InternshipCentersPage,
	NotFoundPage,
	EncargadoDashboardPage,
	OffersPage,
	LogbookPage,
	ReportPage,
	SupervisorPage,
} from '@modules';
// import { Auth } from '@common/components/auth';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/*Public Routes - Rutas publicas */}
				<Route index element={<LoginPage />} />

				{/*Private Routes - Protegidas por autenticación */}
				{/* /app/nombre-ruta */}
				<Route path="app">
					<Route
						path="internship/report"
						element={<ReportPage />}
					/>
					<Route
						path="internship/supervisor"
						element={<SupervisorPage />}
					/>
					<Route
						path="internship-centers"
						element={<InternshipCentersPage />}
					/>
					<Route path="logbook" element={<LogbookPage />} />
					<Route
						path="students"
						element={<EncargadoDashboardPage />}
					/>
					<Route path="offers" element={<OffersPage />} />
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
