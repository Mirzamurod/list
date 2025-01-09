import { FC } from 'react'
import { useTranslation } from 'next-i18next'
import { Controller, useFormContext } from 'react-hook-form'
import { FormControl, FormErrorMessage, FormLabel, Input as ChakraInput } from '@chakra-ui/react'
import { TInputType } from '@/types/input'

const Input: FC<TInputType> = props => {
  const { name, label, placeholder, type, isRequired, ts } = props
  const { t } = useTranslation()
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl isInvalid={!!errors?.[name]?.message} isRequired={isRequired}>
          <FormLabel htmlFor={name}>{t(label || name)}</FormLabel>
          <ChakraInput
            {...field}
            {...props}
            id={name}
            placeholder={t(placeholder || label || name)}
            type={type || 'text'}
          />
          {errors?.[name]?.message ? (
            <FormErrorMessage>{t(errors?.[name]?.message as string)}</FormErrorMessage>
          ) : null}
        </FormControl>
      )}
    />
  )
}

export default Input
