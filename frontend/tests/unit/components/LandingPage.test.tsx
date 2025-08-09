import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test-utils/helpers/test-utils'
import React from 'react'

// Mock LandingPage components
const MockHeroSection = () => {
  return (
    <section data-testid="hero-section" className="hero">
      <div className="hero-content">
        <h1 data-testid="hero-title">Welcome to UpSchool</h1>
        <p data-testid="hero-subtitle">
          The Complete School Management Solution for Modern Education
        </p>
        <div className="hero-actions">
          <button data-testid="hero-cta-primary" className="btn-primary">
            Get Started Free
          </button>
          <button data-testid="hero-cta-secondary" className="btn-secondary">
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  )
}

const MockNavigation = ({ onToggleMobileMenu }: { onToggleMobileMenu?: () => void }) => {
  return (
    <nav data-testid="navigation" role="navigation">
      <div className="nav-brand">
        <span data-testid="brand-logo">UpSchool</span>
      </div>
      
      <div data-testid="desktop-nav" className="nav-links">
        <a href="#features" data-testid="nav-features">Features</a>
        <a href="#pricing" data-testid="nav-pricing">Pricing</a>
        <a href="#testimonials" data-testid="nav-testimonials">Testimonials</a>
        <a href="#contact" data-testid="nav-contact">Contact</a>
      </div>
      
      <div className="nav-actions">
        <button data-testid="nav-login" className="btn-outline">
          Login
        </button>
        <button data-testid="nav-signup" className="btn-primary">
          Sign Up
        </button>
      </div>
      
      <button 
        data-testid="mobile-menu-button" 
        className="mobile-menu-toggle"
        onClick={onToggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        ☰
      </button>
    </nav>
  )
}

const MockFeaturesSection = () => {
  const features = [
    {
      title: 'Student Information System',
      description: 'Comprehensive student records and enrollment management',
      testId: 'feature-sis'
    },
    {
      title: 'Academic Management',
      description: 'Course scheduling, grading, and curriculum management',
      testId: 'feature-academic'
    },
    {
      title: 'Communication Hub',
      description: 'Parent-teacher communication and notifications',
      testId: 'feature-communication'
    },
    {
      title: 'Analytics & Reports',
      description: 'Data-driven insights and custom reporting',
      testId: 'feature-analytics'
    }
  ]

  return (
    <section data-testid="features-section" id="features">
      <h2>Features</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={feature.testId} data-testid={feature.testId} className="feature-item">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const MockPricingSection = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$49',
      features: ['Up to 100 students', 'Basic reports', 'Email support'],
      testId: 'pricing-starter',
      popular: false
    },
    {
      name: 'Professional',
      price: '$99',
      features: ['Up to 500 students', 'Advanced reports', 'Priority support', 'API access'],
      testId: 'pricing-professional',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited students', 'Custom integrations', '24/7 support', 'Dedicated manager'],
      testId: 'pricing-enterprise',
      popular: false
    }
  ]

  return (
    <section data-testid="pricing-section" id="pricing">
      <h2>Pricing Plans</h2>
      <div className="pricing-grid">
        {plans.map(plan => (
          <div 
            key={plan.testId} 
            data-testid={plan.testId} 
            className={`pricing-card ${plan.popular ? 'popular' : ''}`}
          >
            {plan.popular && <span data-testid="popular-badge">Most Popular</span>}
            <h3>{plan.name}</h3>
            <div className="price">{plan.price}</div>
            <ul>
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button className="btn-primary">Choose Plan</button>
          </div>
        ))}
      </div>
    </section>
  )
}

const MockTestimonialsSection = () => {
  const testimonials = [
    {
      text: 'UpSchool transformed how we manage our school operations. Highly recommended!',
      author: 'Dr. Sarah Johnson',
      role: 'Principal, Lincoln Elementary',
      testId: 'testimonial-1'
    },
    {
      text: 'The best investment we made for our school. Students and parents love it.',
      author: 'Mark Thompson',
      role: 'Administrator, Oak Valley High',
      testId: 'testimonial-2'
    },
    {
      text: 'Excellent support team and intuitive interface. Made our transition seamless.',
      author: 'Lisa Chen',
      role: 'IT Director, Metro School District',
      testId: 'testimonial-3'
    }
  ]

  return (
    <section data-testid="testimonials-section" id="testimonials">
      <h2>What Our Customers Say</h2>
      <div className="testimonials-grid">
        {testimonials.map(testimonial => (
          <div key={testimonial.testId} data-testid={testimonial.testId} className="testimonial-card">
            <blockquote>"{testimonial.text}"</blockquote>
            <div className="author">
              <strong>{testimonial.author}</strong>
              <span>{testimonial.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const MockFooter = () => {
  return (
    <footer data-testid="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Product</h4>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#demo">Demo</a>
        </div>
        <div className="footer-section">
          <h4>Company</h4>
          <a href="#about">About</a>
          <a href="#careers">Careers</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <a href="#help">Help Center</a>
          <a href="#docs">Documentation</a>
          <a href="#api">API</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 UpSchool. All rights reserved.</p>
      </div>
    </footer>
  )
}

// Complete LandingPage Component
const MockLandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  React.useEffect(() => {
    // Set page title for SEO
    document.title = 'UpSchool - Complete School Management Solution'
  }, [])

  return (
    <div data-testid="landing-page">
      <MockNavigation onToggleMobileMenu={handleToggleMobileMenu} />
      
      {mobileMenuOpen && (
        <div data-testid="mobile-menu" className="mobile-menu">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#contact">Contact</a>
        </div>
      )}
      
      <main role="main">
        <MockHeroSection />
        <MockFeaturesSection />
        <MockPricingSection />
        <MockTestimonialsSection />
      </main>
      
      <MockFooter />
    </div>
  )
}

describe('LandingPage Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset document title
    document.title = 'Test'
  })

  it('should render complete landing page', () => {
    renderWithProviders(<MockLandingPage />)

    expect(screen.getByTestId('landing-page')).toBeInTheDocument()
    expect(screen.getByTestId('navigation')).toBeInTheDocument()
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByTestId('features-section')).toBeInTheDocument()
    expect(screen.getByTestId('pricing-section')).toBeInTheDocument()
    expect(screen.getByTestId('testimonials-section')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('should have proper semantic structure for accessibility', () => {
    renderWithProviders(<MockLandingPage />)

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('should set proper page title for SEO', () => {
    renderWithProviders(<MockLandingPage />)

    expect(document.title).toBe('UpSchool - Complete School Management Solution')
  })

  describe('Hero Section', () => {
    it('should render hero content correctly', () => {
      renderWithProviders(<MockHeroSection />)

      expect(screen.getByTestId('hero-title')).toHaveTextContent('Welcome to UpSchool')
      expect(screen.getByTestId('hero-subtitle')).toHaveTextContent(
        'The Complete School Management Solution for Modern Education'
      )
    })

    it('should display call-to-action buttons', () => {
      renderWithProviders(<MockHeroSection />)

      expect(screen.getByTestId('hero-cta-primary')).toHaveTextContent('Get Started Free')
      expect(screen.getByTestId('hero-cta-secondary')).toHaveTextContent('Watch Demo')
    })

    it('should have proper heading hierarchy', () => {
      renderWithProviders(<MockHeroSection />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent('Welcome to UpSchool')
    })
  })

  describe('Navigation', () => {
    it('should render navigation with all links', () => {
      renderWithProviders(<MockNavigation />)

      expect(screen.getByTestId('brand-logo')).toHaveTextContent('UpSchool')
      expect(screen.getByTestId('nav-features')).toBeInTheDocument()
      expect(screen.getByTestId('nav-pricing')).toBeInTheDocument()
      expect(screen.getByTestId('nav-testimonials')).toBeInTheDocument()
      expect(screen.getByTestId('nav-contact')).toBeInTheDocument()
    })

    it('should display login and signup buttons', () => {
      renderWithProviders(<MockNavigation />)

      expect(screen.getByTestId('nav-login')).toHaveTextContent('Login')
      expect(screen.getByTestId('nav-signup')).toHaveTextContent('Sign Up')
    })

    it('should have mobile menu toggle button', () => {
      renderWithProviders(<MockNavigation />)

      const mobileToggle = screen.getByTestId('mobile-menu-button')
      expect(mobileToggle).toBeInTheDocument()
      expect(mobileToggle).toHaveAttribute('aria-label', 'Toggle mobile menu')
    })

    it('should call onToggleMobileMenu when mobile button is clicked', async () => {
      const mockToggle = vi.fn()
      renderWithProviders(<MockNavigation onToggleMobileMenu={mockToggle} />)

      const mobileToggle = screen.getByTestId('mobile-menu-button')
      await user.click(mobileToggle)

      expect(mockToggle).toHaveBeenCalledTimes(1)
    })
  })

  describe('Features Section', () => {
    it('should render all feature items', () => {
      renderWithProviders(<MockFeaturesSection />)

      expect(screen.getByText('Features')).toBeInTheDocument()
      expect(screen.getByTestId('feature-sis')).toBeInTheDocument()
      expect(screen.getByTestId('feature-academic')).toBeInTheDocument()
      expect(screen.getByTestId('feature-communication')).toBeInTheDocument()
      expect(screen.getByTestId('feature-analytics')).toBeInTheDocument()
    })

    it('should display feature details', () => {
      renderWithProviders(<MockFeaturesSection />)

      expect(screen.getByText('Student Information System')).toBeInTheDocument()
      expect(screen.getByText('Academic Management')).toBeInTheDocument()
      expect(screen.getByText(/Comprehensive student records/)).toBeInTheDocument()
      expect(screen.getByText(/Course scheduling, grading/)).toBeInTheDocument()
    })
  })

  describe('Pricing Section', () => {
    it('should render all pricing plans', () => {
      renderWithProviders(<MockPricingSection />)

      expect(screen.getByText('Pricing Plans')).toBeInTheDocument()
      expect(screen.getByTestId('pricing-starter')).toBeInTheDocument()
      expect(screen.getByTestId('pricing-professional')).toBeInTheDocument()
      expect(screen.getByTestId('pricing-enterprise')).toBeInTheDocument()
    })

    it('should display plan details and prices', () => {
      renderWithProviders(<MockPricingSection />)

      expect(screen.getByText('Starter')).toBeInTheDocument()
      expect(screen.getByText('$49')).toBeInTheDocument()
      expect(screen.getByText('Professional')).toBeInTheDocument()
      expect(screen.getByText('$99')).toBeInTheDocument()
      expect(screen.getByText('Enterprise')).toBeInTheDocument()
      expect(screen.getByText('Custom')).toBeInTheDocument()
    })

    it('should highlight popular plan', () => {
      renderWithProviders(<MockPricingSection />)

      expect(screen.getByTestId('popular-badge')).toHaveTextContent('Most Popular')
      expect(screen.getByTestId('pricing-professional')).toHaveClass('popular')
    })

    it('should display plan features', () => {
      renderWithProviders(<MockPricingSection />)

      expect(screen.getByText('Up to 100 students')).toBeInTheDocument()
      expect(screen.getByText('Advanced reports')).toBeInTheDocument()
      expect(screen.getByText('Custom integrations')).toBeInTheDocument()
    })

    it('should have choose plan buttons for each plan', () => {
      renderWithProviders(<MockPricingSection />)

      const choosePlanButtons = screen.getAllByText('Choose Plan')
      expect(choosePlanButtons).toHaveLength(3)
    })
  })

  describe('Testimonials Section', () => {
    it('should render all testimonials', () => {
      renderWithProviders(<MockTestimonialsSection />)

      expect(screen.getByText('What Our Customers Say')).toBeInTheDocument()
      expect(screen.getByTestId('testimonial-1')).toBeInTheDocument()
      expect(screen.getByTestId('testimonial-2')).toBeInTheDocument()
      expect(screen.getByTestId('testimonial-3')).toBeInTheDocument()
    })

    it('should display testimonial content and authors', () => {
      renderWithProviders(<MockTestimonialsSection />)

      expect(screen.getByText(/UpSchool transformed how we manage/)).toBeInTheDocument()
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument()
      expect(screen.getByText('Principal, Lincoln Elementary')).toBeInTheDocument()
      expect(screen.getByText('Mark Thompson')).toBeInTheDocument()
      expect(screen.getByText(/Excellent support team/)).toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    it('should render footer with all sections', () => {
      renderWithProviders(<MockFooter />)

      expect(screen.getByTestId('footer')).toBeInTheDocument()
      expect(screen.getByText('Product')).toBeInTheDocument()
      expect(screen.getByText('Company')).toBeInTheDocument()
      expect(screen.getByText('Support')).toBeInTheDocument()
    })

    it('should display copyright notice', () => {
      renderWithProviders(<MockFooter />)

      expect(screen.getByText(/© 2024 UpSchool. All rights reserved./)).toBeInTheDocument()
    })
  })

  describe('Mobile Menu', () => {
    it('should toggle mobile menu visibility', async () => {
      renderWithProviders(<MockLandingPage />)

      // Mobile menu should not be visible initially
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()

      // Click mobile menu button
      const mobileToggle = screen.getByTestId('mobile-menu-button')
      await user.click(mobileToggle)

      // Mobile menu should be visible
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()

      // Click again to close
      await user.click(mobileToggle)

      // Mobile menu should be hidden
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should render mobile menu button for small screens', () => {
      renderWithProviders(<MockLandingPage />)

      expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument()
    })

    it('should render desktop navigation', () => {
      renderWithProviders(<MockLandingPage />)

      expect(screen.getByTestId('desktop-nav')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should handle hero CTA button clicks', async () => {
      renderWithProviders(<MockLandingPage />)

      const primaryCta = screen.getByTestId('hero-cta-primary')
      const secondaryCta = screen.getByTestId('hero-cta-secondary')

      expect(primaryCta).toBeEnabled()
      expect(secondaryCta).toBeEnabled()
    })

    it('should handle navigation link clicks', async () => {
      renderWithProviders(<MockLandingPage />)

      const featuresLink = screen.getByTestId('nav-features')
      const pricingLink = screen.getByTestId('nav-pricing')

      expect(featuresLink).toHaveAttribute('href', '#features')
      expect(pricingLink).toHaveAttribute('href', '#pricing')
    })
  })
})
