describe('SaaS Landing Page', () => {
  beforeEach(() => {
    cy.visitSaaSPortal('/')
  })

  it('should display the hero section correctly', () => {
    cy.get('[data-testid="hero-title"]')
      .should('be.visible')
      .and('contain.text', 'Welcome to UpSchool')
    
    cy.get('[data-testid="hero-subtitle"]')
      .should('be.visible')
      .and('contain.text', 'Complete School Management Solution')
    
    cy.get('[data-testid="cta-button"]')
      .should('be.visible')
      .and('contain.text', 'Get Started')
  })

  it('should navigate to registration when CTA is clicked', () => {
    cy.get('[data-testid="cta-button"]').click()
    cy.url().should('include', '/register')
  })

  it('should display pricing section', () => {
    cy.get('[data-testid="pricing-section"]')
      .should('be.visible')
    
    cy.get('[data-testid="pricing-card"]')
      .should('have.length.gte', 2) // At least 2 pricing tiers
    
    cy.get('[data-testid="pricing-card"]').first()
      .should('contain.text', 'Basic')
  })

  it('should display features section', () => {
    cy.get('[data-testid="features-section"]')
      .should('be.visible')
    
    cy.get('[data-testid="feature-item"]')
      .should('have.length.gte', 3) // At least 3 features
    
    cy.get('[data-testid="feature-item"]').first()
      .find('[data-testid="feature-title"]')
      .should('be.visible')
  })

  it('should have working navigation menu', () => {
    cy.get('[data-testid="nav-features"]').click()
    cy.url().should('include', '#features')
    
    cy.get('[data-testid="nav-pricing"]').click()
    cy.url().should('include', '#pricing')
    
    cy.get('[data-testid="nav-login"]').click()
    cy.url().should('include', '/auth')
  })

  it('should display testimonials section', () => {
    cy.get('[data-testid="testimonials-section"]')
      .should('be.visible')
    
    cy.get('[data-testid="testimonial-card"]')
      .should('have.length.gte', 1)
  })

  it('should have responsive design', () => {
    // Test mobile view
    cy.viewport('iphone-x')
    cy.get('[data-testid="mobile-menu-button"]')
      .should('be.visible')
    
    // Test tablet view
    cy.viewport('ipad-2')
    cy.get('[data-testid="hero-title"]')
      .should('be.visible')
    
    // Test desktop view
    cy.viewport(1280, 720)
    cy.get('[data-testid="desktop-nav"]')
      .should('be.visible')
  })

  it('should pass accessibility checks', () => {
    cy.checkA11y()
  })

  it('should load within performance thresholds', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.performance.mark('start')
      },
      onLoad: (win) => {
        win.performance.mark('end')
        win.performance.measure('pageLoad', 'start', 'end')
        const measure = win.performance.getEntriesByName('pageLoad')[0]
        expect(measure.duration).to.be.lessThan(3000) // 3 seconds
      }
    })
  })
})
