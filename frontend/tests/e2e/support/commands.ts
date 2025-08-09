/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login as different user types
     * @example cy.loginAs('saas-admin')
     * @example cy.loginAs('tenant-admin', { tenantId: '123' })
     */
    loginAs(userType: 'saas-admin' | 'tenant-admin' | 'teacher' | 'student', options?: { tenantId?: string }): Chainable<Element>

    /**
     * Custom command to navigate to different portals
     * @example cy.visitSaaSPortal('/')
     * @example cy.visitTenantPortal('/dashboard')
     */
    visitSaaSPortal(path: string): Chainable<Element>
    visitTenantPortal(path: string, tenantId?: string): Chainable<Element>

    /**
     * Custom command to wait for API calls
     * @example cy.waitForApi('@getStudents')
     */
    waitForApi(alias: string): Chainable<Element>

    /**
     * Custom command to mock API responses
     * @example cy.mockApiCall('GET', '/api/students', { fixture: 'students.json' })
     */
    mockApiCall(method: string, url: string, response: any): Chainable<Element>

    /**
     * Custom command to seed test data
     * @example cy.seedDatabase()
     */
    seedDatabase(): Chainable<Element>

    /**
     * Custom command to check accessibility
     * @example cy.checkA11y()
     */
    checkA11y(): Chainable<Element>
  }
}

// Login commands
Cypress.Commands.add('loginAs', (userType, options = {}) => {
  const users = {
    'saas-admin': {
      email: 'saas-admin@upschool.com',
      password: 'TestPassword123!',
      portal: 'saas'
    },
    'tenant-admin': {
      email: 'admin@testschool.com',
      password: 'TestPassword123!',
      portal: 'tenant'
    },
    'teacher': {
      email: 'teacher@testschool.com',
      password: 'TestPassword123!',
      portal: 'tenant'
    },
    'student': {
      email: 'student@testschool.com',
      password: 'TestPassword123!',
      portal: 'tenant'
    }
  }

  const user = users[userType]
  
  cy.visit(`/${user.portal}/auth`)
  cy.get('[data-testid="email-input"]').type(user.email)
  cy.get('[data-testid="password-input"]').type(user.password)
  cy.get('[data-testid="login-button"]').click()
  
  // Wait for successful login
  cy.url().should('not.include', '/auth')
})

// Navigation commands
Cypress.Commands.add('visitSaaSPortal', (path) => {
  cy.visit(`/${path}`)
})

Cypress.Commands.add('visitTenantPortal', (path, tenantId = 'default') => {
  cy.visit(`/tenant${path}`)
})

// API mocking commands
Cypress.Commands.add('mockApiCall', (method, url, response) => {
  cy.intercept(method as any, url, response).as('mockApiCall')
})

Cypress.Commands.add('waitForApi', (alias) => {
  cy.wait(alias)
})

// Test data seeding
Cypress.Commands.add('seedDatabase', () => {
  // This would typically make API calls to seed test data
  cy.task('db:seed')
})

// Accessibility testing
Cypress.Commands.add('checkA11y', () => {
  // This would use cypress-axe for accessibility testing
  cy.injectAxe()
  cy.checkA11y()
})

// Additional utility commands
Cypress.Commands.add('getByDataTestId', (selector) => {
  return cy.get(`[data-testid="${selector}"]`)
})

// Wait for loading states
Cypress.Commands.add('waitForLoadingToFinish', () => {
  cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.exist')
})

// Form helpers
Cypress.Commands.add('fillForm', (formData: Record<string, string>) => {
  Object.entries(formData).forEach(([field, value]) => {
    cy.get(`[data-testid="${field}-input"]`).clear().type(value)
  })
})

// Screenshot and video helpers
Cypress.Commands.add('takeScreenshotOnFailure', (testName) => {
  cy.screenshot(`failed-${testName}`)
})
