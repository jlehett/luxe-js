const path = require('path');
const { defineConfig } = require('vite');
import { peerDependencies, dependencies } from './package.json';

const externalPackages = [
    ...Object.keys(dependencies || {}),
    ...Object.keys(peerDependencies || {}),
];

const regexesOfPackages = externalPackages.map(
    (pkg) => new RegExp(`^${pkg}(/.*)?`),
);

module.exports = defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'lib/main.js'),
            formats: ['es'],
        },
        rollupOptions: {
            input: {
                'storybook-utils': path.resolve(__dirname, 'lib/storybook-utils/index.js'),
                'async': path.resolve(__dirname, 'lib/async/index.js'),
                'context': path.resolve(__dirname, 'lib/context/index.js'),
                'hooks': path.resolve(__dirname, 'lib/hooks/index.js'),
            },
            output: [
                {
                    dir: 'dist',
                    format: 'es',
                    entryFileNames: '[name].js',
                },
            ],
            // externalize deps that shouldn't be bundled into the lib
            external: regexesOfPackages,
        },
        target: 'esnext',
        sourcemap: true
    }
});
