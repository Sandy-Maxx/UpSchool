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
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'build/',
        'coverage/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/index.tsx',
        'src/main.tsx',
        'src/**/*.stories.tsx',
        'src/**/__mocks__/**',
        'src/**/__tests__/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'tests/unit/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'tests/integration/**/*.{test,spec}.{js,ts,jsx,tsx}'
    ],
    exclude: [
      'node_modules/',
      'dist/',
      'build/',
      'tests/e2e/',
      'tests/system/',
      'tests/performance/',
      'tests/security/',
      '**/*.d.ts'
    ]
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
  },
  define: {
    'import.meta.vitest': undefined,
  }
})
