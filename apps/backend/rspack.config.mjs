import { defineConfig } from '@rspack/cli';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    entry: {
        main: './src/index.ts',
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true,
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
    ignoreWarnings: [
        /Can't resolve '.*(mysql|mysql2|mongodb|sqlite3|sql\.js|react-native-sqlite-storage|better-sqlite3|mssql|oracledb|pg-native|pg-query-stream|redis|ioredis|@google-cloud\/spanner|@sap\/hana-client|typeorm-aurora-data-api-driver).*'/,
        /Critical dependency: the request of a dependency is an expression/,
    ],
    externalsPresets: {},
    externals: [],
    optimization: {
        minimize: false,
    },
    devtool: 'source-map',
});