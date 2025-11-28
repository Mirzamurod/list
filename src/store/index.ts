// Toolkit Imports
import { useDispatch, useSelector } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook } from 'react-redux'

// Middleware
import middleware from '@/store/middleware'

// Reducers
import login from '@/store/user/login'
import register from '@/store/user/register'
import client from '@/store/client'
import checkup from '@/store/checkup'
import statistics from '@/store/statistics'

export const store = configureStore({
  reducer: {
    login,
    register,
    client,
    checkup,
    statistics,
  },
  // @ts-ignore
  middleware: () => [middleware],
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
