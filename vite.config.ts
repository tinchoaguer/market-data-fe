import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^@market-data\/brand(\/.*)?$/,
        replacement: '@maguer/market-data-brand$1',
      },
      {
        find: 'react',
        replacement: resolve(__dirname, 'node_modules/react'),
      },
      {
        find: 'react-dom',
        replacement: resolve(__dirname, 'node_modules/react-dom'),
      },
    ],
    dedupe: ['react', 'react-dom'],
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
