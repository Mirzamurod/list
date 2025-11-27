// React Imports
import type { FC, ReactNode } from 'react'

import { Fragment, useEffect, useState } from 'react'

interface Props {
  children: ReactNode
}

const WindowWrapper: FC<Props> = ({ children }) => {
  const [windowReadyFlag, setWindowReadyFlag] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowReadyFlag(true)
    }
  }, [])

  if (!windowReadyFlag) return null
  return <Fragment>{children}</Fragment>
}

export default WindowWrapper
