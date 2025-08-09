import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// This configures a Service Worker with the given request handlers.
export const server = setupServer(...handlers)

// Enable API mocking before tests.
server.listen({
  onUnhandledRequest: 'bypass',
})
