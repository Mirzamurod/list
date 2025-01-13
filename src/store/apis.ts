import { createAction } from '@reduxjs/toolkit'
import { TList } from '@/types/middleware'

export const list = createAction<TList>('list')

// users
export const users = 'users'
export const loginapi = 'login'
export const registerapi = 'register'

// client
export const clients = 'clients'

// checkup
export const checkupapi = 'checkup'
