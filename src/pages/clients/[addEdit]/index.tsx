import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { useDispatch } from 'react-redux'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { Alert, AlertIcon, Box, Button, Heading, Stack } from '@chakra-ui/react'
import { useAppSelector } from '@/store'
import AddEditCard from '@/view/client/AddEditCard'
import AddEditAction from '@/view/client/AddEditAction'
import { addClient, editClient, getClient } from '@/store/client'
import { TClientForm } from '@/types/client'

const AddEditClient = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()
  const formSchema = yup.object().shape({
    name: yup.string().required(t('name_required')),
    phone: yup.string().required(t('phone_required')),
    year: yup.string().required(t('birthyear_required')),
    address: yup.string().required(t('address_required')),
  })
  const methods = useForm<TClientForm>({
    mode: 'onTouched',
    resolver: yupResolver(formSchema),
    defaultValues: { name: '', phone: '', year: '', address: '' },
  })
  const [desc, setDesc] = useState(EditorState.createEmpty())
  const { handleSubmit, setValue, setError, reset } = methods

  const { success, errors: clientErrors, client } = useAppSelector(state => state.client)

  const onSubmit = (values: TClientForm) => {
    if (router.query.addEdit === 'add')
      dispatch(
        addClient({ ...values, comment: draftToHtml(convertToRaw(desc.getCurrentContent())) })
      )
    else
      dispatch(
        editClient(router.query.addEdit as string, {
          ...values,
          comment: draftToHtml(convertToRaw(desc.getCurrentContent())),
        })
      )
  }

  useEffect(() => {
    if (router.query.addEdit && router.query.addEdit !== 'add')
      dispatch(getClient(router.query.addEdit as string))
    else reset()
  }, [router.query.addEdit])

  useEffect(() => {
    if (client)
      Object.keys(client).map(key => setValue(key as keyof TClientForm, client[key as 'phone']))
  }, [client])

  useEffect(() => {
    if (success) {
      reset()
      router.push({ pathname: '/clients/list', query: { page: 1, limit: 10 } })
    }
  }, [success])

  useEffect(() => {
    if (clientErrors?.length)
      clientErrors.map(item =>
        setError(item.path as keyof TClientForm, { type: 'custom', message: item.msg })
      )
  }, [clientErrors])

  return (
    <FormProvider {...methods}>
      <Box>
        <Stack mb={4} justifyContent='space-between' flexDirection={{ base: 'column', md: 'row' }}>
          <Heading>{t(router.query.addEdit === 'add' ? 'add_client' : 'edit_client')}</Heading>
          <Button as={Link} href='/clients/list?page=1&limit=10'>
            {t('go_to_clients')}
          </Button>
        </Stack>
        {router.query.addEdit !== 'add' ? (
          <Alert status='warning' borderRadius={6} mb={3}>
            <AlertIcon />
            {t('alert_autocomplete')}
          </Alert>
        ) : null}
        <form onSubmit={handleSubmit(onSubmit)}>
          <AddEditCard desc={desc} setDesc={setDesc} />
          <AddEditAction />
        </form>
      </Box>
    </FormProvider>
  )
}

export default AddEditClient
