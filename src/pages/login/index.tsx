import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { FormProvider, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  Stack,
  Input as ChInput,
} from '@chakra-ui/react'
import { TRegister } from '@/types/register'
import { userLogin } from '@/store/user/login'
import { useAppSelector } from '@/store'
import BlankLayout from '@/components/layout/BlankLayout'
import Input from '@/components/Input'
import PasswordInput from '@/components/PasswordInput'
import navbar from '@/navigation/vertical'

const Login = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { t } = useTranslation()
  const formSchema = yup.object().shape({
    phone: yup.string().required(t('phone_required')),
    password: yup.string().required(t('password_required')),
  })
  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(formSchema),
    defaultValues: { phone: '', password: '' },
  })

  const {
    handleSubmit,
    setError,
    register,
    formState: { errors },
  } = methods

  const { errors: loginErrors, success, isLoading, user } = useAppSelector(state => state.login)

  useEffect(() => {
    if (loginErrors?.length)
      loginErrors?.map(item =>
        setError(item.param as 'phone', { type: 'value', message: t(item.msg) })
      )
  }, [loginErrors])

  useEffect(() => {
    if (success && user) router.replace(navbar[user.role!][1].link!)
  }, [success, user])

  const onSubmit = (values: TRegister) => dispatch(userLogin(values))

  return (
    <FormProvider {...methods}>
      <Box __css={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
        <Container>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {/* <Input name='phone' /> */}
              <FormControl isInvalid={!!errors?.phone?.message} isRequired>
                <FormLabel htmlFor='phone'>{t('phone')}</FormLabel>
                <InputGroup>
                  <InputLeftAddon>+998</InputLeftAddon>
                  <ChInput {...register('phone')} type='number' placeholder={t('phone')} />
                </InputGroup>
                {errors?.phone?.message ? (
                  <FormErrorMessage>{t(errors?.phone?.message as string)}</FormErrorMessage>
                ) : null}
              </FormControl>
              <PasswordInput name='password' isRequired />
              <Button
                variant='outline'
                type='submit'
                isLoading={isLoading}
                loadingText={t('login')}
              >
                {t('login')}
              </Button>
            </Stack>
          </form>
        </Container>
      </Box>
    </FormProvider>
  )
}

Login.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Login.guestGuard = true

export default Login
