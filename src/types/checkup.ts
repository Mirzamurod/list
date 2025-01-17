import { TError } from './error'

export type TCheckupState = {
  isLoading: boolean
  checkups: TCheckup[]
  checkup: TCheckup | null
  success: boolean
  errors: null | TError[]
  pageCount: number
}

export type Coordinate = {
  x: number
  y: number
}

export type TCheckup = {
  _id: string
  device?: string
  drugs?: string
  xijoma?: {
    head?: Coordinate[]
    backOfBody?: Coordinate[]
    frontOfBody?: Coordinate[]
    other?: Coordinate[]
  }
  comment?: string
  createdOn?: Date
  userId: string
}

export type TCheckupForm = {
  device?: string
  drugs?: string
  xijoma?: {
    head?: Coordinate[]
    backOfBody?: Coordinate[]
    frontOfBody?: Coordinate[]
    other?: Coordinate[]
  }
  comment?: string
  createdOn?: Date
}

export type TCheckupEditForm = {
  device?: string
  drugs?: string
  xijoma?: {
    head?: Coordinate[]
    backOfBody?: Coordinate[]
    frontOfBody?: Coordinate[]
    other?: Coordinate[]
  }
  comment?: string
  createdOn?: Date
}
