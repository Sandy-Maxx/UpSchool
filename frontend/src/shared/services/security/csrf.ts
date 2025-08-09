// CSRF protection utilities
export function getCSRFToken(): string | null {
  const match = document.cookie.split('; ').find((c) => c.startsWith('csrftoken='))
  return match ? match.split('=')[1] : null
}

export function attachCSRF(headers: Record<string, string>): Record<string, string> {
  const token = getCSRFToken()
  if (token) headers['X-CSRFToken'] = token
  return headers
}
