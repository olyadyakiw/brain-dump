import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [],
    resolve: {
        alias: {},
    },
    build: {
        sourcemap: true,
    },
    server: {
        port: 5200,
    },
    base: '/',
})
