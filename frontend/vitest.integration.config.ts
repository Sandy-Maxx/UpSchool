/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup/vitest-setup.ts'],
    include: [
      'tests/integration/**/*.{test,spec}.{js,ts,jsx,tsx}'
    ],
    exclude: [
      'node_modules/',
      'dist/',
      'build/',
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'tests/unit/',
      'tests/e2e/',
      'tests/system/',
      'tests/performance/',
      'tests/security/',
      '**/*.d.ts'
    ],
    testTimeout: 10000, // Integration tests may take longer
    coverage: {
      reporter: ['text', 'json-summary'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/index.tsx',
        'src/main.tsx',
        'src/**/*.d.ts',
        'src/**/*.stories.tsx',
        'src/**/__mocks__/**',
        'src/**/__tests__/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/shared': resolve(__dirname, 'src/shared'),
      '@/saas': resolve(__dirname, 'src/saas'),
      '@/tenant': resolve(__dirname, 'src/tenant'),
      '@/tests': resolve(__dirname, 'tests'),
      '@/test-utils': resolve(__dirname, 'test-utils')
    }
  }
})
