import { TError } from './error'

export type TCheckupState = {
  isLoading: boolean
  checkups: TCheckup[]
  checkup: TCheckup | null
  success: boolean
  errors: null | TError[]
  pageCount: number
}

export type TCheckup = {
  _id: string
  name: string
  phone: string
  year: string
  address: string
  comment?: string
  userId: string
}

export type TCheckupForm = {
  name: string
  phone: string
  year: string
  address: string
  comment?: string
}

export type TCheckupEditForm = {
  name?: string
  phone?: string
  year?: string
  address?: string
  comment?: string
}
