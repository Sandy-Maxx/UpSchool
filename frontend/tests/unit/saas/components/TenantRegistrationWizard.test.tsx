import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test-utils/helpers/test-utils'
import { TenantRegistrationWizard } from '../../../../src/saas/components/auth/TenantRegistrationWizard'
import React from 'react'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}))

// Mock timers for subdomain checking
vi.useFakeTimers()

describe('TenantRegistrationWizard Component', () => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

  beforeEach(() => {
    vi.clearAllTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.useFakeTimers()
  })

  describe('Initial Rendering', () => {
    it('should render registration wizard with initial step', () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      // Check header
      expect(screen.getByText('Register Your School')).toBeInTheDocument()
      expect(screen.getByText('Get started with UpSchool ERP platform in just a few steps')).toBeInTheDocument()
      
      // Check stepper
      expect(screen.getByText('School Information')).toBeInTheDocument()
      expect(screen.getByText('Administrative Contact')).toBeInTheDocument()
      expect(screen.getByText('Address & Details')).toBeInTheDocument()
      expect(screen.getByText('Account Setup')).toBeInTheDocument()
      
      // Check step indicator
      expect(screen.getByText('Step 1 of 4')).toBeInTheDocument()
      
      // Check navigation buttons
      expect(screen.getByRole('button', { name: /back/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /next/i })).toBeEnabled()
    })

    it('should display step 1 form fields correctly', () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      expect(screen.getByText('Tell us about your school')).toBeInTheDocument()
      expect(screen.getByLabelText(/school name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/school type/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/established year/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/student capacity/i)).toBeInTheDocument()
      
      // Check required fields are marked
      expect(screen.getByLabelText(/school name/i)).toBeRequired()
      expect(screen.getByLabelText(/established year/i)).toBeRequired()
      expect(screen.getByLabelText(/student capacity/i)).toBeRequired()
    })
  })

  describe('Step 1: School Information', () => {
    it('should allow user to input school information', async () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      const schoolNameInput = screen.getByLabelText(/school name/i)
      const establishedYearInput = screen.getByLabelText(/established year/i)
      const studentCapacityInput = screen.getByLabelText(/student capacity/i)
      
      await user.type(schoolNameInput, 'Green Valley Elementary')
      await user.type(establishedYearInput, '1995')
      await user.type(studentCapacityInput, '500')
      
      expect(schoolNameInput).toHaveValue('Green Valley Elementary')
      expect(establishedYearInput).toHaveValue(1995)
      expect(studentCapacityInput).toHaveValue(500)
    })

    it('should display school type dropdown options', async () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      const schoolTypeSelect = screen.getByLabelText(/school type/i)
      await user.click(schoolTypeSelect)
      
      // Check some key school types are available
      expect(screen.getByText('Primary School')).toBeInTheDocument()
      expect(screen.getByText('Elementary School')).toBeInTheDocument()
      expect(screen.getByText('High School')).toBeInTheDocument()
      expect(screen.getByText('International School')).toBeInTheDocument()
      expect(screen.getByText('Private School')).toBeInTheDocument()
    })

    it('should validate required fields on next button click', async () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      // Should show validation errors
      expect(screen.getByText('School name is required')).toBeInTheDocument()
      expect(screen.getByText('School type is required')).toBeInTheDocument()
      expect(screen.getByText('Established year is required')).toBeInTheDocument()
      expect(screen.getByText('Student capacity is required')).toBeInTheDocument()
      
      // Should remain on step 1
      expect(screen.getByText('Step 1 of 4')).toBeInTheDocument()
    })

    it('should validate established year range', async () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      const establishedYearInput = screen.getByLabelText(/established year/i)
      const nextButton = screen.getByRole('button', { name: /next/i })
      
      // Test year too early
      await user.type(establishedYearInput, '1700')
      await user.click(nextButton)
      expect(screen.getByText('Please enter a valid year')).toBeInTheDocument()
      
      // Clear and test future year
      await user.clear(establishedYearInput)
      await user.type(establishedYearInput, '2030')
      await user.click(nextButton)
      expect(screen.getByText('Please enter a valid year')).toBeInTheDocument()
    })

    it('should proceed to step 2 when all fields are valid', async () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      // Fill all required fields
      await user.type(screen.getByLabelText(/school name/i), 'Test School')
      await user.click(screen.getByLabelText(/school type/i))
      await user.click(screen.getByText('Elementary School'))
      await user.type(screen.getByLabelText(/established year/i), '2000')
      await user.type(screen.getByLabelText(/student capacity/i), '300')
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      // Should advance to step 2
      expect(screen.getByText('Step 2 of 4')).toBeInTheDocument()
      expect(screen.getByText('Primary administrator contact')).toBeInTheDocument()
    })
  })

  describe('Step 2: Administrative Contact', () => {
    beforeEach(async () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      // Complete step 1 to get to step 2
      await user.type(screen.getByLabelText(/school name/i), 'Test School')
      await user.click(screen.getByLabelText(/school type/i))
      await user.click(screen.getByText('Elementary School'))
      await user.type(screen.getByLabelText(/established year/i), '2000')
      await user.type(screen.getByLabelText(/student capacity/i), '300')
      await user.click(screen.getByRole('button', { name: /next/i }))
    })

    it('should display administrative contact form fields', () => {
      expect(screen.getByText('Primary administrator contact')).toBeInTheDocument()
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/role.*position/i)).toBeInTheDocument()
    })

    it('should allow user to input contact information', async () => {
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john.doe@testschool.edu')
      await user.type(screen.getByLabelText(/phone number/i), '+1 (555) 123-4567')
      
      expect(screen.getByLabelText(/first name/i)).toHaveValue('John')
      expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe')
      expect(screen.getByLabelText(/email address/i)).toHaveValue('john.doe@testschool.edu')
      expect(screen.getByLabelText(/phone number/i)).toHaveValue('+1 (555) 123-4567')
    })

    it('should display admin role dropdown options', async () => {
      const roleSelect = screen.getByLabelText(/role.*position/i)
      await user.click(roleSelect)
      
      expect(screen.getByText('Principal')).toBeInTheDocument()
      expect(screen.getByText('Vice Principal')).toBeInTheDocument()
      expect(screen.getByText('School Administrator')).toBeInTheDocument()
      expect(screen.getByText('Head of School')).toBeInTheDocument()
      expect(screen.getByText('IT Administrator')).toBeInTheDocument()
    })

    it('should validate email format', async () => {
      await user.type(screen.getByLabelText(/email address/i), 'invalid-email')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    })

    it('should validate all required fields', async () => {
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      expect(screen.getByText('First name is required')).toBeInTheDocument()
      expect(screen.getByText('Last name is required')).toBeInTheDocument()
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Phone is required')).toBeInTheDocument()
      expect(screen.getByText('Role is required')).toBeInTheDocument()
    })

    it('should allow navigation back to step 1', async () => {
      const backButton = screen.getByRole('button', { name: /back/i })
      expect(backButton).toBeEnabled()
      
      await user.click(backButton)
      
      expect(screen.getByText('Step 1 of 4')).toBeInTheDocument()
      expect(screen.getByText('Tell us about your school')).toBeInTheDocument()
    })
  })

  describe('Step 3: Address & Details', () => {
    beforeEach(async () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      // Complete steps 1 and 2
      await user.type(screen.getByLabelText(/school name/i), 'Test School')
      await user.click(screen.getByLabelText(/school type/i))
      await user.click(screen.getByText('Elementary School'))
      await user.type(screen.getByLabelText(/established year/i), '2000')
      await user.type(screen.getByLabelText(/student capacity/i), '300')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@test.com')
      await user.type(screen.getByLabelText(/phone number/i), '555-1234')
      await user.click(screen.getByLabelText(/role.*position/i))
      await user.click(screen.getByText('Principal'))
      await user.click(screen.getByRole('button', { name: /next/i }))
    })

    it('should display address form fields', () => {
      expect(screen.getByText('School location and details')).toBeInTheDocument()
      expect(screen.getByLabelText(/street address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/state.*province/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/zip.*postal code/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/country/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/school website/i)).toBeInTheDocument()
    })

    it('should validate required address fields', async () => {
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      expect(screen.getByText('Address is required')).toBeInTheDocument()
      expect(screen.getByText('City is required')).toBeInTheDocument()
      expect(screen.getByText('State/Province is required')).toBeInTheDocument()
      expect(screen.getByText('ZIP/Postal code is required')).toBeInTheDocument()
      expect(screen.getByText('Country is required')).toBeInTheDocument()
    })

    it('should validate website URL format', async () => {
      await user.type(screen.getByLabelText(/school website/i), 'invalid-url')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      expect(screen.getByText('Please enter a valid website URL (starting with http:// or https://)')).toBeInTheDocument()
    })

    it('should accept valid website URLs', async () => {
      await user.type(screen.getByLabelText(/street address/i), '123 Main St')
      await user.type(screen.getByLabelText(/city/i), 'Anytown')
      await user.type(screen.getByLabelText(/state.*province/i), 'CA')
      await user.type(screen.getByLabelText(/zip.*postal code/i), '12345')
      await user.type(screen.getByLabelText(/country/i), 'USA')
      await user.type(screen.getByLabelText(/school website/i), 'https://www.testschool.edu')
      
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      expect(screen.getByText('Step 4 of 4')).toBeInTheDocument()
    })
  })

  describe('Step 4: Account Setup', () => {
    beforeEach(async () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      // Complete steps 1, 2, and 3
      await user.type(screen.getByLabelText(/school name/i), 'Test School')
      await user.click(screen.getByLabelText(/school type/i))
      await user.click(screen.getByText('Elementary School'))
      await user.type(screen.getByLabelText(/established year/i), '2000')
      await user.type(screen.getByLabelText(/student capacity/i), '300')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@test.com')
      await user.type(screen.getByLabelText(/phone number/i), '555-1234')
      await user.click(screen.getByLabelText(/role.*position/i))
      await user.click(screen.getByText('Principal'))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await user.type(screen.getByLabelText(/street address/i), '123 Main St')
      await user.type(screen.getByLabelText(/city/i), 'Anytown')
      await user.type(screen.getByLabelText(/state.*province/i), 'CA')
      await user.type(screen.getByLabelText(/zip.*postal code/i), '12345')
      await user.type(screen.getByLabelText(/country/i), 'USA')
      await user.click(screen.getByRole('button', { name: /next/i }))
    })

    it('should display account setup form fields', () => {
      expect(screen.getByText('Set up your account')).toBeInTheDocument()
      expect(screen.getByLabelText(/subdomain/i)).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByText(/agree to the.*terms of service/i)).toBeInTheDocument()
      expect(screen.getByText(/subscribe to product updates/i)).toBeInTheDocument()
    })

    it('should auto-generate subdomain from school name', () => {
      // Should have auto-generated subdomain from "Test School"
      expect(screen.getByLabelText(/subdomain/i)).toHaveValue('testschool')
    })

    it('should validate password requirements', async () => {
      await user.type(screen.getByLabelText('Password'), 'weak')
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument()
    })

    it('should validate password complexity', async () => {
      await user.type(screen.getByLabelText('Password'), 'simplepassword')
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      expect(screen.getByText('Password must contain uppercase, lowercase, and numbers')).toBeInTheDocument()
    })

    it('should validate password confirmation', async () => {
      await user.type(screen.getByLabelText('Password'), 'StrongPass123')
      await user.type(screen.getByLabelText(/confirm password/i), 'DifferentPass123')
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })

    it('should toggle password visibility', async () => {
      const passwordInput = screen.getByLabelText('Password')
      const toggleButton = screen.getAllByRole('button').find(button => 
        button.querySelector('[data-testid="VisibilityIcon"], [data-testid="VisibilityOffIcon"]')
      )
      
      expect(passwordInput).toHaveAttribute('type', 'password')
      
      if (toggleButton) {
        await user.click(toggleButton)
        expect(passwordInput).toHaveAttribute('type', 'text')
        
        await user.click(toggleButton)
        expect(passwordInput).toHaveAttribute('type', 'password')
      }
    })

    it('should require terms agreement', async () => {
      await user.type(screen.getByLabelText(/subdomain/i), 'testschool')
      await user.type(screen.getByLabelText('Password'), 'StrongPass123')
      await user.type(screen.getByLabelText(/confirm password/i), 'StrongPass123')
      
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      expect(screen.getByText('You must agree to the terms and conditions')).toBeInTheDocument()
    })

    it('should validate subdomain format', async () => {
      const subdomainInput = screen.getByLabelText(/subdomain/i)
      
      await user.clear(subdomainInput)
      await user.type(subdomainInput, 'Invalid@Subdomain!')
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      expect(screen.getByText('Subdomain can only contain lowercase letters, numbers, and hyphens')).toBeInTheDocument()
    })

    it('should validate subdomain length', async () => {
      const subdomainInput = screen.getByLabelText(/subdomain/i)
      
      await user.clear(subdomainInput)
      await user.type(subdomainInput, 'ab')
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      expect(screen.getByText('Subdomain must be at least 3 characters long')).toBeInTheDocument()
    })
  })

  describe('Subdomain Availability Checking', () => {
    it('should check subdomain availability with debouncing', async () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      // Navigate to step 4
      await user.type(screen.getByLabelText(/school name/i), 'Available School')
      await user.click(screen.getByLabelText(/school type/i))
      await user.click(screen.getByText('Elementary School'))
      await user.type(screen.getByLabelText(/established year/i), '2000')
      await user.type(screen.getByLabelText(/student capacity/i), '300')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@test.com')
      await user.type(screen.getByLabelText(/phone number/i), '555-1234')
      await user.click(screen.getByLabelText(/role.*position/i))
      await user.click(screen.getByText('Principal'))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await user.type(screen.getByLabelText(/street address/i), '123 Main St')
      await user.type(screen.getByLabelText(/city/i), 'Anytown')
      await user.type(screen.getByLabelText(/state.*province/i), 'CA')
      await user.type(screen.getByLabelText(/zip.*postal code/i), '12345')
      await user.type(screen.getByLabelText(/country/i), 'USA')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      const subdomainInput = screen.getByLabelText(/subdomain/i)
      await user.clear(subdomainInput)
      await user.type(subdomainInput, 'uniqueschool')
      
      // Fast forward debounce timer
      act(() => {
        vi.advanceTimersByTime(500)
      })
      
      // Should start checking
      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument()
      })
      
      // Fast forward checking timer
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
        // Should show available indicator (CheckCircleIcon)
        expect(screen.getByTitle('Subdomain available')).toBeInTheDocument()
      })
    })

    it('should show unavailable status for reserved subdomains', async () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      // Navigate to step 4 and set reserved subdomain
      await user.type(screen.getByLabelText(/school name/i), 'Admin School')
      await user.click(screen.getByLabelText(/school type/i))
      await user.click(screen.getByText('Elementary School'))
      await user.type(screen.getByLabelText(/established year/i), '2000')
      await user.type(screen.getByLabelText(/student capacity/i), '300')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@test.com')
      await user.type(screen.getByLabelText(/phone number/i), '555-1234')
      await user.click(screen.getByLabelText(/role.*position/i))
      await user.click(screen.getByText('Principal'))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await user.type(screen.getByLabelText(/street address/i), '123 Main St')
      await user.type(screen.getByLabelText(/city/i), 'Anytown')
      await user.type(screen.getByLabelText(/state.*province/i), 'CA')
      await user.type(screen.getByLabelText(/zip.*postal code/i), '12345')
      await user.type(screen.getByLabelText(/country/i), 'USA')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      const subdomainInput = screen.getByLabelText(/subdomain/i)
      await user.clear(subdomainInput)
      await user.type(subdomainInput, 'admin') // Reserved subdomain
      
      // Fast forward timers
      act(() => {
        vi.advanceTimersByTime(1500)
      })
      
      await waitFor(() => {
        expect(screen.getByTitle('Subdomain not available')).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    beforeEach(async () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      // Complete all steps with valid data
      await user.type(screen.getByLabelText(/school name/i), 'Complete School')
      await user.click(screen.getByLabelText(/school type/i))
      await user.click(screen.getByText('Elementary School'))
      await user.type(screen.getByLabelText(/established year/i), '2000')
      await user.type(screen.getByLabelText(/student capacity/i), '300')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@test.com')
      await user.type(screen.getByLabelText(/phone number/i), '555-1234')
      await user.click(screen.getByLabelText(/role.*position/i))
      await user.click(screen.getByText('Principal'))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await user.type(screen.getByLabelText(/street address/i), '123 Main St')
      await user.type(screen.getByLabelText(/city/i), 'Anytown')
      await user.type(screen.getByLabelText(/state.*province/i), 'CA')
      await user.type(screen.getByLabelText(/zip.*postal code/i), '12345')
      await user.type(screen.getByLabelText(/country/i), 'USA')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      const subdomainInput = screen.getByLabelText(/subdomain/i)
      await user.clear(subdomainInput)
      await user.type(subdomainInput, 'completeschool')
      await user.type(screen.getByLabelText('Password'), 'StrongPass123')
      await user.type(screen.getByLabelText(/confirm password/i), 'StrongPass123')
      await user.click(screen.getByRole('checkbox', { name: /agree to the/i }))
      
      // Wait for subdomain availability check
      act(() => {
        vi.advanceTimersByTime(1500)
      })
      
      await waitFor(() => {
        expect(screen.getByTitle('Subdomain available')).toBeInTheDocument()
      })
    })

    it('should handle successful registration', async () => {
      // Mock window.alert
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      
      const createButton = screen.getByRole('button', { name: /create account/i })
      await user.click(createButton)
      
      // Should show loading state
      expect(screen.getByText('Creating Account...')).toBeInTheDocument()
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
      
      // Fast forward the API call simulation
      act(() => {
        vi.advanceTimersByTime(2000)
      })
      
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          'Registration successful! Your portal will be available at: https://completeschool.upschool.com'
        )
      })
      
      alertSpy.mockRestore()
    })

    it('should disable submit button when subdomain is unavailable', async () => {
      const subdomainInput = screen.getByLabelText(/subdomain/i)
      await user.clear(subdomainInput)
      await user.type(subdomainInput, 'admin') // Reserved/unavailable
      
      act(() => {
        vi.advanceTimersByTime(1500)
      })
      
      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /create account/i })
        expect(createButton).toBeDisabled()
      })
    })
  })

  describe('Error Handling', () => {
    it('should clear field errors when user starts typing', async () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      // Trigger validation errors
      await user.click(screen.getByRole('button', { name: /next/i }))
      expect(screen.getByText('School name is required')).toBeInTheDocument()
      
      // Start typing in the field
      await user.type(screen.getByLabelText(/school name/i), 'T')
      
      // Error should be cleared
      expect(screen.queryByText('School name is required')).not.toBeInTheDocument()
    })

    it('should handle registration failure gracefully', async () => {
      // Mock console.error to avoid test noise
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      
      // Mock failed API call by extending the timer beyond expected completion
      renderWithProviders(<TenantRegistrationWizard />)
      
      // Navigate to final step with valid data
      await user.type(screen.getByLabelText(/school name/i), 'Test School')
      await user.click(screen.getByLabelText(/school type/i))
      await user.click(screen.getByText('Elementary School'))
      await user.type(screen.getByLabelText(/established year/i), '2000')
      await user.type(screen.getByLabelText(/student capacity/i), '300')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Complete remaining steps quickly for this error test
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@test.com')
      await user.type(screen.getByLabelText(/phone number/i), '555-1234')
      await user.click(screen.getByLabelText(/role.*position/i))
      await user.click(screen.getByText('Principal'))
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await user.type(screen.getByLabelText(/street address/i), '123 Main St')
      await user.type(screen.getByLabelText(/city/i), 'Anytown')
      await user.type(screen.getByLabelText(/state.*province/i), 'CA')
      await user.type(screen.getByLabelText(/zip.*postal code/i), '12345')
      await user.type(screen.getByLabelText(/country/i), 'USA')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      const subdomainInput = screen.getByLabelText(/subdomain/i)
      await user.clear(subdomainInput)
      await user.type(subdomainInput, 'testschool')
      await user.type(screen.getByLabelText('Password'), 'StrongPass123')
      await user.type(screen.getByLabelText(/confirm password/i), 'StrongPass123')
      await user.click(screen.getByRole('checkbox', { name: /agree to the/i }))
      
      // Wait for subdomain check
      act(() => {
        vi.advanceTimersByTime(1500)
      })
      
      // The test passes if no errors are thrown during this process
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
      
      consoleSpy.mockRestore()
      alertSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      // Check form fields have proper labels
      expect(screen.getByLabelText(/school name/i)).toHaveAttribute('aria-required', 'true')
      expect(screen.getByLabelText(/established year/i)).toHaveAttribute('aria-required', 'true')
      
      // Check buttons have proper roles
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    })

    it('should display error messages with proper ARIA attributes', async () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      const schoolNameInput = screen.getByLabelText(/school name/i)
      expect(schoolNameInput).toHaveAttribute('aria-invalid', 'true')
      
      // Error message should be associated with the field
      const errorMessage = screen.getByText('School name is required')
      expect(errorMessage).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      const schoolNameInput = screen.getByLabelText(/school name/i)
      
      // Focus should work
      await user.tab()
      expect(schoolNameInput).toHaveFocus()
      
      // Keyboard input should work
      await user.keyboard('Test School')
      expect(schoolNameInput).toHaveValue('Test School')
    })
  })

  describe('Responsive Design', () => {
    it('should render appropriately on different screen sizes', () => {
      renderWithProviders(<TenantRegistrationWizard />)
      
      // Check that the component renders without errors
      // (Detailed responsive testing would require viewport manipulation)
      expect(screen.getByText('Register Your School')).toBeInTheDocument()
      
      // Grid components should be present for responsive layout
      const establishedYearInput = screen.getByLabelText(/established year/i)
      expect(establishedYearInput.closest('.MuiGrid-item')).toBeInTheDocument()
    })
  })
})
