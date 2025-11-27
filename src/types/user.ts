import type { TError } from './error'

export type UserDataType = {
  _id: string
  phone: string
  name?: string
  role: TUserRole
  block: boolean
}

export interface IUserStore {
  isLoading: boolean
  user: UserDataType | null
  errors: TError[] | null
  token: boolean
  success: boolean
}

export interface IRegister {
  isLoading: boolean
  success: boolean
  error: any
}

export type TUserRole = 'admin' | 'client' | 'supplier'
