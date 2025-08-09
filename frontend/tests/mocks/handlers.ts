import { http, HttpResponse } from 'msw'

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string }
    
    if (email === 'test@upschool.com' && password === 'TestPassword123!') {
      return HttpResponse.json({
        user: {
          id: '1',
          email: 'test@upschool.com',
          name: 'Test User',
          role: 'admin',
        },
        token: 'mock-jwt-token',
      })
    }
    
    return new HttpResponse(null, { status: 401 })
  }),

  http.post('/api/auth/logout', () => {
    return new HttpResponse(null, { status: 200 })
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json({
      id: '1',
      email: 'test@upschool.com',
      name: 'Test User',
      role: 'admin',
    })
  }),

  // SaaS endpoints
  http.get('/api/saas/tenants', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Test School',
        domain: 'testschool.upschool.com',
        status: 'active',
        plan: 'professional',
        createdAt: '2024-01-01T00:00:00Z',
      },
    ])
  }),

  http.post('/api/saas/tenants', async ({ request }) => {
    const tenantData = await request.json() as Record<string, any>
    return HttpResponse.json({
      id: '2',
      ...tenantData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })
  }),

  // Tenant endpoints
  http.get('/api/tenant/dashboard/metrics', () => {
    return HttpResponse.json({
      totalStudents: 150,
      totalTeachers: 25,
      totalClasses: 10,
      activeUsers: 89,
    })
  }),

  http.get('/api/tenant/students', () => {
    return HttpResponse.json([
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@student.com',
        class: '10A',
        enrollmentDate: '2024-01-01',
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@student.com',
        class: '10B',
        enrollmentDate: '2024-01-01',
      },
    ])
  }),

  // Error scenarios
  http.get('/api/error/500', () => {
    return new HttpResponse(null, { status: 500 })
  }),

  http.get('/api/error/404', () => {
    return new HttpResponse(null, { status: 404 })
  }),

  // Slow response for testing loading states
  http.get('/api/slow', async () => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    return HttpResponse.json({ message: 'Slow response' })
  }),
]
