import { InputProps } from '@chakra-ui/react'

export type TInput = {
  name: string
  label?: string
  ts?: any
  // placeholder?: string
}

export type TInputType = TInput & InputProps
