import { defineConfig } from '@rspack/cli';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    entry: {
        main: './src/index.ts',
    },
    target: 'node',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true,
        chunkFormat: 'commonjs',
        chunkLoading: false,
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        alias: {
            '@config': path.resolve(__dirname, 'src/config'),
            '@controllers': path.resolve(__dirname, 'src/controllers'),
            '@entities': path.resolve(__dirname, 'src/entities'),
            '@handlers': path.resolve(__dirname, 'src/handlers'),
            '@lib': path.resolve(__dirname, 'src/lib'),
            '@middleware': path.resolve(__dirname, 'src/middleware'),
            '@routes': path.resolve(__dirname, 'src/routes'),
            '@services': path.resolve(__dirname, 'src/services'),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                loader: 'builtin:swc-loader',
                options: {
                    jsc: {
                        parser: {
                            syntax: 'typescript',
                            decorators: true,
                        },
                        transform: {
                            decoratorMetadata: true,
                        },
                        target: 'es2022',
                    },
                },
                type: 'javascript/auto',
            },
        ],
    },
    externalsPresets: { node: true },
    externalsType: 'commonjs',
    externals: [
        'oracledb',
        'pg-native',
        'pg-query-stream',
        'typeorm-aurora-data-api-driver',
        'redis',
        'ioredis',
        'better-sqlite3',
        'sqlite3',
        'sql.js',
        'mssql',
        'react-native-sqlite-storage',
        'mysql',
        'mysql2',
        'mongodb',
        '@google-cloud/spanner',
        '@sap/hana-client',
        '@sap/hana-client/extension/Stream',
        'supports-color',
        // 'typeorm',
        // 'express',
        // 'app-root-path',
    ],
    ignoreWarnings: [
        {
            module: /node_modules\/app-root-path\/lib\/app-root-path\.js/,
            message: /Critical dependency: the request of a dependency is an expression/,
        },
        {
            module: /node_modules\/express\/lib\/view\.js/,
            message: /Critical dependency: the request of a dependency is an expression/,
        },
        {
            module: /node_modules\/typeorm\/connection\/ConnectionOptionsReader\.js/,
            message: /Critical dependency: the request of a dependency is an expression/,
        },
        {
            module: /node_modules\/typeorm\/platform\/PlatformTools\.js/,
            message: /Critical dependency: the request of a dependency is an expression/,
        },
        {
            module: /node_modules\/typeorm\/util\/DirectoryExportedClassesLoader\.js/,
            message: /Critical dependency: the request of a dependency is an expression/,
        },
        {
            module: /node_modules\/typeorm\/util\/ImportUtils\.js/,
            message: /Critical dependency: the request of a dependency is an expression/,
        },
    ],
    optimization: {
        minimize: false,
        splitChunks: false,
    },
    devtool: 'source-map',
});