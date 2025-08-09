import { useCallback, useEffect, useRef, useState } from 'react'
import { SessionInfo } from '../types/auth'

export const useSession = () => {
  const [session, setSession] = useState<SessionInfo | null>(null)
  const timerRef = useRef<number | null>(null)

  const start = useCallback((expiresInMs: number, idleTimeoutMs = 15 * 60 * 1000) => {
    const expiresAt = Date.now() + expiresInMs
    setSession({ expiresAt, idleTimeoutMs })
  }, [])

  const clear = useCallback(() => {
    setSession(null)
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!session) return
    const remaining = session.expiresAt - Date.now()
    if (remaining <= 0) {
      setSession(null)
      return
    }
    timerRef.current = window.setTimeout(() => setSession(null), remaining)
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [session])

  const isExpired = session ? Date.now() >= session.expiresAt : true
  const remainingMs = session ? Math.max(0, session.expiresAt - Date.now()) : 0

  return { session, start, clear, isExpired, remainingMs }
}
