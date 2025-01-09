import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'next-i18next'
import i18next from 'i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FormProvider, useForm } from 'react-hook-form'
import BlankLayout from '@/components/layout/BlankLayout'
import { getPurchasedProductOrder } from '@/store/purchased_product'
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Stack,
  Text,
  useColorMode,
} from '@chakra-ui/react'
import { MdOutlineDarkMode, MdSunny } from 'react-icons/md'
import { useAppSelector } from '@/store'
import { Language } from '@/types/language'
import { useLanguage } from '@/context/LanguageContext'
import Input from '@/components/Input'
import { TOrderFormLink, TPaymentMethod } from '@/types/order'
import { TInputType } from '@/types/input'
import { addOrderLink } from '@/store/order'

const AddOrder = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { colorMode, toggleColorMode } = useColorMode()
  const { language, setLanguage } = useLanguage()
  const formSchema = yup.object().shape({
    name: yup.string(),
    phone: yup.string().required(t('phone_required')),
    payment_method: yup
      .mixed<TPaymentMethod>()
      .oneOf(['cash', 'card'], 'no_payment_method')
      .required(t('payment_method_required')),
    delivery_date: yup.string(),
    count: yup.number().min(1, t('min_1')),
  })
  const methods = useForm<TOrderFormLink>({
    mode: 'onTouched',
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      payment_method: 'cash',
      count: 1,
    },
  })
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods

  const { isLoading, success } = useAppSelector(state => state.order)
  const { purchased_product, isLoading: loading } = useAppSelector(state => state.purchased_product)

  const selectLang = ({ lang, name }: Language) => {
    i18next.changeLanguage(lang)
    setLanguage({ lang, name })
  }

  const inputs: TInputType[] = [
    { name: 'phone', isRequired: true },
    { name: 'name' },
    { name: 'count', type: 'number', max: purchased_product?.count },
    { name: 'delivery_date', type: 'date' },
  ]

  useEffect(() => {
    if (success) router.replace('/success')
  }, [success])

  useEffect(() => {
    if (Object.keys(router.query).length)
      dispatch(getPurchasedProductOrder(router.query as { user: string; product: string }))
  }, [router.query])

  const onSubmit = (values: TOrderFormLink) =>
    dispatch(
      addOrderLink({
        ...values,
        user: router.query.user as string,
        product: purchased_product?.product._id!,
      })
    )

  return (
    <FormProvider {...methods}>
      <Flex height='100vh' alignItems='center'>
        <Container>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Box textAlign='end'>
                <IconButton
                  mr={3}
                  aria-label='Change Theme'
                  icon={colorMode === 'dark' ? <MdSunny /> : <MdOutlineDarkMode />}
                  onClick={() => toggleColorMode()}
                />
                <Menu>
                  <MenuButton as={Button}>{language.name}</MenuButton>
                  <MenuList>
                    {[
                      { lang: 'uz', name: 'Uz' },
                      { lang: 'ru', name: 'Ru' },
                      { lang: 'eng', name: 'Eng' },
                    ].map(item => (
                      <MenuItem onClick={() => selectLang(item as Language)} key={item.lang}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Box>
              <HStack alignItems='start'>
                <Image
                  src='https://atlas-content-cdn.pixelsquid.com/stock-images/perfume-bottle-dox7ee1-600.jpg'
                  alt='Perfume image'
                  objectFit='cover'
                  // borderRadius='full'
                  width='120px'
                  height='120px'
                />
                <Text>{purchased_product?.product.name}</Text>
              </HStack>
              {inputs.map((input, index) => (
                <Box key={index}>
                  <Input {...input} />
                </Box>
              ))}
              <FormControl isInvalid={!!errors.payment_method?.message}>
                <FormLabel>{t('choose_payment_method')}</FormLabel>
                <Select {...register('payment_method')}>
                  <option value='cash'>{t('cash')}</option>
                  <option value='card'>{t('card')}</option>
                </Select>
                {errors.payment_method?.message ? (
                  <FormErrorMessage>{errors.payment_method.message}</FormErrorMessage>
                ) : null}
              </FormControl>
              <Button
                type='submit'
                variant='outline'
                colorScheme='teal'
                isLoading={isLoading || loading}
                loadingText={t('login')}
              >
                {t('submit')}
              </Button>
            </Stack>
          </form>
        </Container>
      </Flex>
    </FormProvider>
  )
}

AddOrder.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

AddOrder.guestGuard = true

export default AddOrder
