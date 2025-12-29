import { Layout } from '@common/components';
import {
	ApplicationsManagementPage,
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

import { ReportsPage } from '@modules/reports/components/pages/reports-page';
// import { Auth } from '@common/components/auth';

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
							path="reports"
							element={<ReportsPage />}
						/>

						<Route
							path="students"
							element={<EncargadoDashboardPage />}
						/>
						<Route path="offers" element={<OffersPage />} />
						<Route
							path="applications-management"
							element={<ApplicationsManagementPage />}
						/>
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
