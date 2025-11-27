import type { IconType } from 'react-icons/lib'

export type TNavbar = {
  type: 'link' | 'heading'
  label: string
  icon?: IconType
  pathname?: string
  query?: { [x: string]: any }
  link?: string
  notifications?: number
}
