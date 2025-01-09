import { FC, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Controller, useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  IconButton,
  Flex,
} from '@chakra-ui/react'
import { TInputType } from '@/types/input'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

const PasswordInput: FC<TInputType> = props => {
  const { name, label, placeholder, isRequired } = props
  const { t } = useTranslation()
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const [show, setShow] = useState<boolean>(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl isInvalid={!!errors?.[name]?.message} isRequired={isRequired}>
          <FormLabel htmlFor={name}>{t(label || name)}</FormLabel>
          <Flex>
            <ChakraInput
              {...field}
              {...props}
              id={name}
              borderRightRadius={0}
              placeholder={t(placeholder || label || name)}
              type={show ? 'text' : 'password'}
            />
            <IconButton
              borderLeftRadius={0}
              aria-label='change_type'
              onClick={() => setShow(!show)}
              icon={show ? <ViewOffIcon /> : <ViewIcon />}
            />
          </Flex>
          {errors?.[name]?.message ? (
            <FormErrorMessage>{t(errors?.[name]?.message as string)}</FormErrorMessage>
          ) : null}
        </FormControl>
      )}
    />
  )
}

export default PasswordInput
