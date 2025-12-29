import {
	ApplicationsPage,
	EncargadoDashboardPage,
	EvaluationsPage,
	InternshipCentersPage,
	LogbookPage,
	LoginPage,
	NotFoundPage,
	OffersPage,
	ReportPage,
	SupervisorPage,
} from '@modules';
import { BrowserRouter, Route, Routes } from 'react-router';
// import { Auth } from '@common/components';
import { Layout } from '@common/components';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/*Public Routes - Rutas publicas */}
				<Route index element={<LoginPage />} />

				{/*Private Routes - Protegidas por autenticación */}
				{/* /app/nombre-ruta */}
				<Route>
					<Route path="app" element={<Layout />}>
						<Route path="internship">
							<Route
								path="evaluations"
								element={<EvaluationsPage />}
							/>
							<Route
								path="report"
								element={<ReportPage />}
							/>
							<Route
								path="supervisor"
								element={<SupervisorPage />}
							/>
						</Route>

						<Route
							path="internship-centers"
							element={<InternshipCentersPage />}
						/>

						<Route
							path="logbook"
							element={<LogbookPage />}
						/>

						<Route
							path="students"
							element={<EncargadoDashboardPage />}
						/>
						<Route path="offers" element={<OffersPage />} />
						<Route
							path="my-applications"
							element={<ApplicationsPage />}
						/>
					</Route>
				</Route>

				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
