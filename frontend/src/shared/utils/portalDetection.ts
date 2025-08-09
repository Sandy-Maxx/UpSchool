export const getSubdomain = (host: string): string | null => {
  const parts = host.split('.')
  if (host === 'localhost' || host === '127.0.0.1') return null
  return parts.length > 2 ? parts[0] : parts[0] // simplistic for demo
}

export const isSaasPortal = (): boolean => {
  const sub = getSubdomain(window.location.hostname)
  // In production, root domain without school subdomain might be SaaS
  return !sub
}
