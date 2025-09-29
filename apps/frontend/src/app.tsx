import { useEffect } from 'react';

function App() {
	useEffect(() => {
		fetch('/api')
			.then((res) => res.json())
			.then(console.log);
	}, []);

	return (
		<>
			<h1>¡Bienvenido a mi Frontend</h1>
			<h2>con Vite y React!</h2>
		</>
	);
}

export default App;
