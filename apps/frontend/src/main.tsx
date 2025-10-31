import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/env.ts';
import './styles/base.css';
import App from './app.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
