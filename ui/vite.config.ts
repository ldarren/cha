/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  // import.meta.env.VITE_NAME available here with: process.env.VITE_NAME
  // import.meta.env.VITE_PORT available here with: process.env.VITE_PORT

  // https://vitejs.dev/config/
  return defineConfig({
    plugins: [
      react(),
      mockDevServerPlugin({
        include: ['src/mock/**/*.mock.{js,ts,cjs,mjs,json,json5}'],
      }),
    ],
    server: {
      proxy: {
        '^/api': env.VITE_BACKEND_ORIGIN
      },
    },
    test: {
      globals: true,
      environment: 'jsdom'
    }
  })
}