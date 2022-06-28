import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@assets': path.resolve(__dirname, './src/assets'),
            '@components': path.resolve(__dirname, './src/components'),
            '@contexts': path.resolve(__dirname, './src/contexts'),
            '@root': path.resolve(__dirname, './src/root'),
            '@services': path.resolve(__dirname, './src/services'),
            '@stylesheets': path.resolve(__dirname, './src/stylesheets'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@views': path.resolve(__dirname, './src/views'),
        }
    },
    plugins: [
        react(),
        svgr(),
    ],
})