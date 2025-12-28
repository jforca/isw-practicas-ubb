import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from '@common/components';
import {
	LoginPage,
	InternshipCentersPage,
	NotFoundPage,
	EncargadoDashboardPage,
	OffersPage,
	LogbookPage,
	ReportPage,
	EvaluationsPage,
	SupervisorPage,
} from '@modules';

import { ReportsPage } from '@modules/reports/components/pages/reports-page';
// import { Auth } from '@common/components/auth';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/*Public Routes - Rutas publicas */}
				<Route index element={<LoginPage />} />
				<Route path="/logbook" element={<LogbookPage />} />
				<Route path="/reports" element={<ReportsPage />} />

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
					</Route>
				</Route>

				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
