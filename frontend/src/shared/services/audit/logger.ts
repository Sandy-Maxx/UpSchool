// Minimal audit logging service
export type AuditEvent = {
  type: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
  details?: Record<string, unknown>
}

export const auditLogger = {
  log: (event: AuditEvent) => {
    // In real app, send to backend endpoint; here, no-op
    if (process.env.NODE_ENV !== 'test') {
      console.debug('[AUDIT]', event)
    }
  },
}

