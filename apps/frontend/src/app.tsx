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
import { Auth } from '@common/components/auth';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/*Public Routes - Rutas publicas */}
				<Route index element={<LoginPage />} />

				{/*Private Routes - Protegidas por autenticación */}
				{/* /app/nombre-ruta */}
				{/*Private Routes - Protegidas por autenticación */}
				<Route path="app" element={<Layout />}>
					{/* Rutas para Encargado (Coordinator) */}
					<Route
						element={
							<Auth allowedRoles={['coordinator']} />
						}
					>
						<Route
							path="students"
							element={<EncargadoDashboardPage />}
						/>
						<Route
							path="internship-centers"
							element={<InternshipCentersPage />}
						/>
						<Route path="offers" element={<OffersPage />} />
						<Route
							path="internship/evaluations"
							element={<EvaluationsPage />}
						/>
						<Route
							path="internship/report"
							element={<ReportPage />}
						/>
						<Route
							path="reports"
							element={<ReportsPage />}
						/>
					</Route>

					{/* Rutas para Alumnos (Student) */}
					<Route
						element={<Auth allowedRoles={['student']} />}
					>
						<Route
							path="logbook"
							element={<LogbookPage />}
						/>
						<Route
							path="applications-management"
							element={<ApplicationsManagementPage />}
						/>
						<Route
							path="my-applications"
							element={<ApplicationsPage />}
						/>
						{/* Los alumnos pueden ver ofertas, pero quizás con vista limitada. 
                            Por ahora usamos la misma página, asumiendo que el componente maneja permisos internos 
                            o que es vista de lectura. Si no, habría que crear una OffersPageStudent. 
                            El usuario dijo "offerts (Habilitado para hacer CRUDs)" para Encargado. 
                            Asumiré que Students NO entran a esta ruta de gestión, sino a una de postulación.
                            Pero el plan decía "Offers (View only?)". 
                            Dejaré Offers fuera de Student por seguridad si es CRUD puro, 
                            o la incluiré si es híbrida. 
                            Revisando el plan: "Students: Access to Logbook, My Applications, Offers (View only?)".
                            Voy a incluirla pero ojo con el CRUD. */}
						{/* <Route path="offers" element={<OffersPage />} /> */}
					</Route>

					{/* Rutas para Supervisor */}
					<Route
						element={<Auth allowedRoles={['supervisor']} />}
					>
						<Route
							path="internship/supervisor"
							element={<SupervisorPage />}
						/>
					</Route>
				</Route>

				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
