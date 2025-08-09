const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@saas': path.resolve(__dirname, 'src/saas'),
      '@tenant': path.resolve(__dirname, 'src/tenant'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@components': path.resolve(__dirname, 'src/shared/components'),
      '@utils': path.resolve(__dirname, 'src/shared/utils'),
      '@types': path.resolve(__dirname, 'src/shared/types'),
      '@hooks': path.resolve(__dirname, 'src/shared/hooks'),
      '@services': path.resolve(__dirname, 'src/shared/services'),
      '@constants': path.resolve(__dirname, 'src/shared/constants'),
      '@theme': path.resolve(__dirname, 'src/shared/theme'),
      '@tests': path.resolve(__dirname, 'src/tests'),
    },
  },
  jest: {
    configure: (jestConfig) => {
      // Add polyfills and setup files
      jestConfig.setupFiles = [
        ...(jestConfig.setupFiles || []),
        path.resolve(__dirname, 'src/tests/setup/polyfills.js'),
      ];

      jestConfig.setupFilesAfterEnv = [
        ...(jestConfig.setupFilesAfterEnv || []),
        path.resolve(__dirname, 'src/tests/setupTests.ts'),
      ];

      // Ensure jsdom and transform exceptions for ESM libs like msw
      jestConfig.testEnvironment = 'jsdom';
      jestConfig.transformIgnorePatterns = [
        'node_modules/(?!(msw|@mswjs|@bundled-es-modules|outvariant|@open-draft|strict-event-emitter|statuses|headers-polyfill|@inquirer|chalk|strip-ansi|ansi-regex|string-width)/)'
      ];

      // Module name mapping for aliases and assets
      jestConfig.moduleNameMapper = {
        ...(jestConfig.moduleNameMapper || {}),
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@saas/(.*)$': '<rootDir>/src/saas/$1',
        '^@tenant/(.*)$': '<rootDir>/src/tenant/$1',
        '^@shared$': '<rootDir>/src/shared',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
        '^@components/(.*)$': '<rootDir>/src/shared/components/$1',
        '^@utils/(.*)$': '<rootDir>/src/shared/utils/$1',
        '^@types$': '<rootDir>/src/shared/types',
        '^@types/(.*)$': '<rootDir>/src/shared/types/$1',
        '^@hooks/(.*)$': '<rootDir>/src/shared/hooks/$1',
        '^@services/(.*)$': '<rootDir>/src/shared/services/$1',
        '^@constants$': '<rootDir>/src/shared/constants',
        '^@constants/(.*)$': '<rootDir>/src/shared/constants/$1',
        '^@theme/(.*)$': '<rootDir>/src/shared/theme/$1',
        '^@tests$': '<rootDir>/src/tests',
        '^@tests/(.*)$': '<rootDir>/src/tests/$1',
        '^@shared/store/slices/apiSlice$': '<rootDir>/src/tests/mocks/apiSlice.mock.ts',
        '^.+\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^.+\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/tests/mocks/fileMock.js',
      };

      return jestConfig;
    },
  },
};
