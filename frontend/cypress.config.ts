import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'tests/e2e/support/commands.ts',
    specPattern: 'tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'test-reports/cypress/screenshots',
    videosFolder: 'test-reports/cypress/videos',
    downloadsFolder: 'test-reports/cypress/downloads',
    video: true,
    screenshot: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    retries: {
      runMode: 2,
      openMode: 0
    },
    env: {
      // Environment variables for testing
      SAAS_BASE_URL: 'http://localhost:5173',
      TENANT_BASE_URL: 'http://localhost:5173/tenant',
      TEST_USER_EMAIL: 'test@upschool.com',
      TEST_USER_PASSWORD: 'TestPassword123!'
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(message)
          return null
        }
      })
      
      // Code coverage task
      on('task', {
        coverage() {
          return null
        }
      })
      
      return config
    },
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    supportFile: 'tests/e2e/support/component.ts',
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    indexHtmlFile: 'tests/e2e/support/component-index.html'
  }
})
