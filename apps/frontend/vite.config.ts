import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		plugins: [react(), tailwindcss()],
		resolve: {
			alias: {
				'@assets': path.resolve(__dirname, './src/assets'),
				'@components': path.resolve(
					__dirname,
					'./src/components',
				),
				'@hooks': path.resolve(__dirname, './src/hooks'),
				'@lib': path.resolve(__dirname, './src/lib'),
				'@styles': path.resolve(__dirname, './src/styles'),
			},
		},
		server: {
			proxy: {
				'/api': {
					target: env.VITE_BACKEND_URL,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, '/api'),
				},
			},
		},
	};
});
