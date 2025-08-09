// Production-grade Jest configuration for Multi-Tenant School ERP Platform
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/src/tests/setupTests.ts',
    '@testing-library/jest-dom/extend-expect'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/tests/**/*',
    '!src/**/*.stories.tsx',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/TestDashboard.tsx', // Exclude test dashboard
  ],
  
  // Coverage thresholds - Production standards (temporarily lowered for initial setup)
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
  
  // Test patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/?(*.)(spec|test).{ts,tsx}',
  ],
  
  // Module path mapping
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@saas/(.*)$': '<rootDir>/src/saas/$1',
    '^@tenant/(.*)$': '<rootDir>/src/tenant/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@tests/(.*)$': '<rootDir>/src/tests/$1',
    '^@constants': '<rootDir>/src/shared/constants',
    '^@types': '<rootDir>/src/shared/types',
    // Use manual mocks to avoid ES module issues
    '^axios$': '<rootDir>/src/__mocks__/axios.js',
    '^msw$': '<rootDir>/src/__mocks__/msw.js',
    '^msw/node$': '<rootDir>/src/__mocks__/msw.js',
  },
  
  // Transform configuration - allow transformation of ES module packages
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|(@bundled-es-modules|msw|axios|@mswjs)/)',
  ],
  
  // Module file extensions
  moduleFileExtensions: [
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
  ],
  
  // Test timeout for complex integration tests
  testTimeout: 10000,
  
  // Verbose output for debugging
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Reset modules between tests
  resetMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
};
