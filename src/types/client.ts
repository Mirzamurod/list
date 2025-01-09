import { TError } from './error'

export type TClientState = {
  isLoading: boolean
  clients: TClient[]
  client: TClient | null
  success: boolean
  errors: null | TError[]
  pageCount: number
}

export type TClient = {
  _id: string
  name: string
  phone: string
  year: string
  address: string
  comment?: string
  userId: string
}

export type TClientForm = {
  name: string
  phone: string
  year: string
  address: string
  comment?: string
}

export type TClientEditForm = {
  name?: string
  phone?: string
  year?: string
  address?: string
  comment?: string
}
