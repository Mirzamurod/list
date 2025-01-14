import { InputProps, TextareaProps } from '@chakra-ui/react'

export type TInput = {
  name: string
  label?: string
  ts?: any
  // placeholder?: string
}

export type TInputType = TInput & InputProps

export type TTextareaType = TInput & TextareaProps
