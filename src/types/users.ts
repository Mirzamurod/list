import type { TError } from "./error"

export type TUsersState = {
  isLoading: boolean
  users: TUser[] | []
  user: TUser | null
  success: boolean
  pageCount: number
  errors: null | TError[]
}

export type TUser = { _id: string; phone: string; role: string; name?: string; block: boolean }
