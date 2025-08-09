import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { TenantLoginForm } from '../../../../src/tenant/features/auth/components/LoginForm'

describe('TenantLoginForm', () => {
  it('renders and submits with entered values', async () => {
    const onSubmit = vi.fn()
    render(<TenantLoginForm onSubmit={onSubmit} />)

    const email = screen.getByLabelText(/email/i)
    const password = screen.getByLabelText(/password/i, { selector: 'input' })
    const role = screen.getByLabelText(/role/i)
    const submit = screen.getByRole('button', { name: /sign in/i })

    await userEvent.type(email, 'admin@school.edu')
    await userEvent.type(password, 'secret123')
    await userEvent.click(role)
    const adminOption = await screen.findByRole('option', { name: /administrator/i })
    await userEvent.click(adminOption)
    await userEvent.click(submit)

    expect(onSubmit).toHaveBeenCalled()
    const args = onSubmit.mock.calls[0][0]
    expect(args.email).toBe('admin@school.edu')
    expect(args.password).toBe('secret123')
    expect(args.role).toBe('admin')
  })
})
