// React Imports
import { Fragment, ReactElement, ReactNode, useEffect } from 'react'

// Next Import
import { useRouter } from 'next/router'

// Hooks Import
import { useAuth } from '@/hooks/useAuth'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  const { user } = useSelector((state: RootState) => state.login)

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (typeof window !== 'undefined') {
      if (user === null && !window.localStorage.getItem('list')!) {
        if (router.asPath !== '/')
          router.replace({ pathname: '/login', query: { returnUrl: router.asPath } })
        else router.replace('/login')
      }
    }
  }, [router])

  if (auth.loading || user === null) {
    return fallback
  }

  if (user && user.block) router.replace('/payment')

  return <Fragment>{children}</Fragment>
}

export default AuthGuard
