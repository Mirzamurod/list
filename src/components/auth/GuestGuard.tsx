// React Import
import type { FC, ReactNode, ReactElement } from 'react'

import { Fragment, useMemo } from 'react'

// Next Import
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/useAuth'

interface GuestGuard {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard: FC<GuestGuard> = props => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  const shouldBlockGuest = useMemo(() => {
    if (auth.loading) return true
    return auth.user !== null
  }, [auth.loading, auth.user])

  if (!router.isReady || shouldBlockGuest) {
    return fallback
  }

  return <Fragment>{children}</Fragment>
}

export default GuestGuard
