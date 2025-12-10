import { BrowserRouter, Routes, Route } from 'react-router';
import {
	LoginPage,
	InternshipCentersPage,
	NotFoundPage,
	EncargadoDashboardPage,
} from '@modules';
import { LogbookPage } from '@modules/Logbook/components/pages/logbook-page';
// import { Auth } from '@common/components/auth';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/*Public Routes */}
				<Route index element={<LoginPage />} />
				<Route path="/logbook" element={<LogbookPage />} />

				{/*Private Routes - Protegidas por autenticación */}
				{/* /app/nombre-ruta */}
				{/* <Route element={<Auth />}></Route> */}
				<Route path="app">
					<Route
						path="internship-centers"
						element={<InternshipCentersPage />}
					/>
					<Route
						path="students"
						element={<EncargadoDashboardPage />}
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
