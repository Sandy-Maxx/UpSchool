// Input sanitization utilities
export function sanitizeString(input: string): string {
  return input.trim()
}

export function sanitizeEmail(input: string): string {
  return sanitizeString(input).toLowerCase()
}

