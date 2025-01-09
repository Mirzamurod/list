import axios from 'axios'
import { createStandaloneToast } from '@chakra-ui/react'
import { TList } from '@/types/middleware'
import i18n from '@/languages/i18n'
import { deleteUser } from './user/login'

const { toast } = createStandaloneToast()

const middleware =
  ({ dispatch }: { dispatch: any }) =>
  (next: any) =>
  (action: { type: string; payload: TList }) => {
    if (action.type !== 'list') {
      next(action)
      return
    }

    next(action)

    const { url, method, params, data, onStart, onSuccess, onFail } = action.payload

    const token = localStorage.getItem('list')

    const headers = token ? { Authorization: `Bearer ${token}` } : null

    dispatch({ type: onStart })

    // @ts-ignore
    axios({
      baseURL: '/api/',
      method,
      data,
      url,
      params,
      headers,
    })
      .then(res => {
        if (res.status === 200 || res.status === 201) {
          dispatch({ type: onSuccess, payload: res.data })
          if (res?.data?.message && typeof res?.data?.message === 'string')
            toast({
              status: 'success',
              position: 'top-right',
              isClosable: true,
              variant: 'left-accent',
              title: i18n?.t(res.data?.message),
            })
        } else dispatch({ type: onFail, payload: res })
      })
      .catch(error => {
        if (error?.response?.statusCode === 401) dispatch(deleteUser())
        else {
          const data = error?.response?.data
          if (data?.message && typeof data?.message === 'string')
            toast({
              status: 'warning',
              position: 'top-right',
              isClosable: true,
              variant: 'left-accent',
              title: i18n?.t(data?.message),
            })

          dispatch({ type: onFail, payload: error?.response?.data })
        }
      })
  }

export default middleware
