// React Imports
import { FC, ReactNode, createContext, useEffect, useState } from 'react'

// Next Import
import { useRouter } from 'next/router'
import { UserDataType } from '@/types/user'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'next-i18next'
import { AppDispatch, RootState } from '@/store'
import { getUserData } from '@/store/user/login'
import { UseToastOptions, useToast } from '@chakra-ui/react'

interface IAuthValuesType {
  loading: boolean
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType) => void
}

const defaultProvider: IAuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider: FC<Props> = ({ children }) => {
  // Dispatch
  const dispatch = useDispatch<AppDispatch>()
  const toast = useToast()
  const { t } = useTranslation()

  // Selector
  const { token } = useSelector((state: RootState) => state.login)

  // States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // Hooks
  const router = useRouter()

  const config: UseToastOptions = {
    status: 'success',
    position: 'top-right',
    isClosable: true,
    variant: 'left-accent',
  }

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      let tokenLocal = window.localStorage.getItem('list')!
      if (token || tokenLocal) {
        setLoading(true)
        await axios({
          baseURL: `/api/users`,
          headers: { Authorization: 'Bearer ' + tokenLocal },
        })
          .then(res => {
            setLoading(false)
            dispatch(getUserData(res.data.data))
            if (res.data.message) toast({ ...config, title: t(res.data?.message) })
          })
          .catch(error => {
            const data = error?.response?.data
            if (data?.message && typeof data?.message === 'string')
              toast({ ...config, title: t(data?.message) })
            localStorage.removeItem('list')
            setLoading(false)
            if (!router.pathname.includes('login')) router.replace('/login')
          })
      } else setLoading(false)
    }

    initAuth()
  }, [token])

  const values = { user, loading, setUser, setLoading }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
