import type { ReactElement, ReactNode } from 'react'
import type { NextComponentType, NextPageContext } from 'next/dist/shared/lib/utils'
import { UserDataType } from '@/types/user'

declare module 'next' {
  export declare type NextPage<P = {}, IP = P> = NextComponentType<NextPageContext, IP, P> & {
    authGuard?: boolean
    guestGuard?: boolean
    setConfig?: () => void
    contentHeightFixed?: boolean
    getLayout?: (page: ReactElement) => ReactNode
  }

  interface NextApiRequest {
    user?: UserDataType
  }
}
