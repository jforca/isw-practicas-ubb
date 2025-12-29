module.exports = {
	apps: [
		{
			name: 'backend',
			cwd: 'apps/backend',
			script: 'npm',
			args: 'run start',
			watch: false,
			env: {
				NODE_ENV: 'development',
			},
			env_production: {
				NODE_ENV: 'production',
			},
		},
		{
			name: 'frontend',
			cwd: 'apps/frontend',
			script: 'npm',
			args: 'run start',
			watch: false,
			env: {
				NODE_ENV: 'development',
			},
			env_production: {
				NODE_ENV: 'production',
			},
		},
	],
};
