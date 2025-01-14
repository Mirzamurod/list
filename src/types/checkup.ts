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
  device?: string
  drugs?: string
  xijoma?: {
    head?: number[]
    backOfBody?: number[]
    frontOfBody?: number[]
    other?: number[]
  }
  userId: string
}

export type TCheckupForm = {
  device?: string
  drugs?: string
  xijoma?: {
    head?: number[]
    backOfBody?: number[]
    frontOfBody?: number[]
    other?: number[]
  }
}

export type TCheckupEditForm = {
  device?: string
  drugs?: string
  xijoma?: {
    head?: number[]
    backOfBody?: number[]
    frontOfBody?: number[]
    other?: number[]
  }
}
