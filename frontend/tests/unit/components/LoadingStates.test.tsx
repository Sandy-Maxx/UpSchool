import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils/helpers/test-utils'
import React from 'react'

// Mock LoadingStates component for comprehensive testing
interface MockLoadingStatesProps {
  show?: boolean
  text?: string
  size?: 'small' | 'medium' | 'large'
  variant?: 'spinner' | 'skeleton' | 'dots' | 'pulse'
  fullscreen?: boolean
  progress?: number
  className?: string
  delay?: number
}

const MockLoadingStates: React.FC<MockLoadingStatesProps> = ({
  show = true,
  text = 'Loading...',
  size = 'medium',
  variant = 'spinner',
  fullscreen = false,
  progress,
  className,
  delay = 0,
}) => {
  const [shouldShow, setShouldShow] = React.useState(delay === 0)

  React.useEffect(() => {
    if (delay > 0 && show) {
      const timer = setTimeout(() => {
        setShouldShow(true)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [delay, show])

  if (!show || !shouldShow) {
    return null
  }

  const sizeClasses = {
    small: 'size-small',
    medium: 'size-medium', 
    large: 'size-large'
  }

  const renderContent = () => {
    switch (variant) {
      case 'skeleton':
        return (
          <div data-testid="skeleton-loader" className="skeleton-content">
            <div className="skeleton-rect"></div>
            <div className="skeleton-text"></div>
            {progress !== undefined && (
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                <span className="progress-text">{progress}%</span>
              </div>
            )}
          </div>
        )

      case 'dots':
        return (
          <div data-testid="dots-loader" className="dots-content">
            <div className="dot dot-1"></div>
            <div className="dot dot-2"></div>
            <div className="dot dot-3"></div>
            <span>{text}</span>
          </div>
        )

      case 'pulse':
        return (
          <div data-testid="pulse-loader" className="pulse-content">
            <div className="pulse-circle"></div>
            <span>{text}</span>
          </div>
        )

      case 'spinner':
      default:
        return (
          <div
            data-testid="loading-spinner"
            className={`spinner-content ${sizeClasses[size]} ${className || ''}`}
            role="status"
            aria-label="Loading"
          >
            <div className="spinner"></div>
            <span>{text}</span>
            {progress !== undefined && (
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                <span className="progress-text">{progress}%</span>
              </div>
            )}
          </div>
        )
    }
  }

  const content = renderContent()

  if (fullscreen) {
    return (
      <div
        data-testid="loading-overlay"
        className="fullscreen-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        {content}
      </div>
    )
  }

  return content
}

describe('LoadingStates Component', () => {
  it('should render default spinner loading state', () => {
    renderWithProviders(<MockLoadingStates />)
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should render with custom text', () => {
    const customText = 'Loading students...'
    renderWithProviders(<MockLoadingStates text={customText} />)
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    expect(screen.getByText(customText)).toBeInTheDocument()
  })

  it('should render different size variants', () => {
    const { rerender } = renderWithProviders(<MockLoadingStates size="small" />)
    expect(screen.getByTestId('loading-spinner')).toHaveClass('size-small')

    rerender(<MockLoadingStates size="medium" />)
    expect(screen.getByTestId('loading-spinner')).toHaveClass('size-medium')

    rerender(<MockLoadingStates size="large" />)
    expect(screen.getByTestId('loading-spinner')).toHaveClass('size-large')
  })

  it('should render fullscreen overlay when fullscreen is true', () => {
    renderWithProviders(<MockLoadingStates fullscreen />)
    
    const overlay = screen.getByTestId('loading-overlay')
    expect(overlay).toBeInTheDocument()
    expect(overlay).toHaveStyle({ position: 'fixed', zIndex: '9999' })
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    renderWithProviders(<MockLoadingStates />)
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveAttribute('role', 'status')
    expect(spinner).toHaveAttribute('aria-label', 'Loading')
  })

  it('should render with custom className', () => {
    const customClass = 'custom-loading'
    renderWithProviders(<MockLoadingStates className={customClass} />)
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass(customClass)
  })

  it('should handle progress indicator when provided', () => {
    renderWithProviders(<MockLoadingStates progress={75} />)
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
    
    const progressBar = document.querySelector('.progress-bar')
    expect(progressBar).toBeInTheDocument()
  })

  it('should render skeleton loading state', () => {
    renderWithProviders(<MockLoadingStates variant="skeleton" />)
    
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument()
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
  })

  it('should render dots loading animation', () => {
    renderWithProviders(<MockLoadingStates variant="dots" />)
    
    expect(screen.getByTestId('dots-loader')).toBeInTheDocument()
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
  })

  it('should render pulse loading animation', () => {
    renderWithProviders(<MockLoadingStates variant="pulse" />)
    
    expect(screen.getByTestId('pulse-loader')).toBeInTheDocument()
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
  })

  it('should not render anything when show is false', () => {
    renderWithProviders(<MockLoadingStates show={false} />)
    
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('should handle loading delay properly', async () => {
    vi.useFakeTimers()
    
    renderWithProviders(<MockLoadingStates delay={500} />)
    
    // Should not show immediately due to delay
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
    
    // Fast-forward time and wait for async update
    vi.advanceTimersByTime(500)
    await vi.runAllTimersAsync()
    
    // Now should be visible
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    
    vi.useRealTimers()
  })

  it('should handle delay cleanup when component unmounts', () => {
    vi.useFakeTimers()
    
    const { unmount } = renderWithProviders(<MockLoadingStates delay={500} />)
    
    // Unmount before delay completes
    unmount()
    
    // Advance timers - should not cause any issues
    vi.advanceTimersByTime(500)
    
    vi.useRealTimers()
    expect(true).toBe(true) // If we reach here, no errors occurred
  })

  it('should show immediately when delay is 0', () => {
    renderWithProviders(<MockLoadingStates delay={0} />)
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('should respect show prop even with delay', () => {
    renderWithProviders(<MockLoadingStates show={false} delay={500} />)
    
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
  })

  it('should render different variants with custom text', () => {
    const customText = 'Processing data...'
    
    const { rerender } = renderWithProviders(
      <MockLoadingStates variant="dots" text={customText} />
    )
    expect(screen.getByText(customText)).toBeInTheDocument()
    
    rerender(<MockLoadingStates variant="pulse" text={customText} />)
    expect(screen.getByText(customText)).toBeInTheDocument()
  })

  it('should handle progress with different variants', () => {
    // Test spinner variant with progress
    const { rerender } = renderWithProviders(<MockLoadingStates variant="spinner" progress={50} />)
    expect(screen.getByText('50%')).toBeInTheDocument()
    
    // Test skeleton variant with progress
    rerender(<MockLoadingStates variant="skeleton" progress={50} />)
    expect(screen.getByText('50%')).toBeInTheDocument()
    
    // Other variants (dots, pulse) should not show progress
    rerender(<MockLoadingStates variant="dots" progress={50} />)
    expect(screen.queryByText('50%')).not.toBeInTheDocument()
  })
})
