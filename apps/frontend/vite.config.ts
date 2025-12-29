import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		plugins: [react(), tailwindcss(), svgr()],
		resolve: {
			alias: {
				'@lib': path.resolve(__dirname, './src/lib'),
				'@styles': path.resolve(__dirname, './src/styles'),
				'@common': path.resolve(__dirname, './src/common'),
				'@modules': path.resolve(
					__dirname,
					'./src/modules',
				),
				'@packages': path.resolve(
					__dirname,
					'../../packages',
				),
			},
		},
		server: {
			proxy: {
				'/api': {
					target: env.VITE_BACKEND_URL,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, '/api'),
				},
				'/uploads': {
					target: env.VITE_BACKEND_URL,
					changeOrigin: true,
				},
			},
		},
	};
});
