'use client'

import { useState, useEffect } from 'react'
import { getClientSession } from '@/lib/session-client'
import { Session } from '@/lib/session-client'

export function useSession(): [Session | null, boolean] {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClientSession().then(setSession).finally(() => setLoading(false))
  }, [])

  return [session, loading]
}

