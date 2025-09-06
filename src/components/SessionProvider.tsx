import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react'

type SessionContextValue = {
  sessionId: string | null
}

const SessionContext = createContext<SessionContextValue>({ sessionId: null })

export function useSession() {
  return useContext(SessionContext)
}

function SessionProvider({ children }: PropsWithChildren) {
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const existing = localStorage.getItem('watchit_session_id')
    if (existing) {
      setSessionId(existing)
      return
    }
    const newId = crypto.randomUUID()
    localStorage.setItem('watchit_session_id', newId)
    setSessionId(newId)
  }, [])

  const value = useMemo(() => ({ sessionId }), [sessionId])

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}

export default SessionProvider


