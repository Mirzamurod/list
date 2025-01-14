import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { useDispatch } from 'react-redux'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { Box, Button, Heading, Stack } from '@chakra-ui/react'
import { useAppSelector } from '@/store'
import AddEditCard from '@/view/checkup/AddEditCard'
import AddEditAction from '@/view/checkup/AddEditAction'
import { addCheckup, editCheckup, getCheckup } from '@/store/checkup'
import { TCheckupForm } from '@/types/checkup'

const AddEditCheckup = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()
  const formSchema = yup.object().shape({
    device: yup.string(),
    drugs: yup.string(),
    xijoma: yup.object().shape({
      head: yup.array(yup.number()),
      backOfBody: yup.array(yup.number()),
      headfrontOfBody: yup.array(yup.number()),
      other: yup.array(yup.number()),
    }),
    createdOn: yup.date().default(function () {
      return new Date()
    }),
  })
  const methods = useForm<TCheckupForm>({
    mode: 'onTouched',
    // @ts-ignore
    resolver: yupResolver(formSchema),
    defaultValues: {
      device: '',
      drugs: '',
      xijoma: { head: [], backOfBody: [], frontOfBody: [], other: [] },
      createdOn: new Date(),
    },
  })
  const [desc, setDesc] = useState(EditorState.createEmpty())
  const { handleSubmit, setValue, setError, reset } = methods

  const { success, errors: clientErrors, client } = useAppSelector(state => state.client)

  const onSubmit = (values: TCheckupForm) => {
    if (router.query.addEdit === 'add')
      dispatch(
        addCheckup({ ...values, comment: draftToHtml(convertToRaw(desc.getCurrentContent())) })
      )
    else
      dispatch(
        editCheckup(router.query.addEdit as string, {
          ...values,
          comment: draftToHtml(convertToRaw(desc.getCurrentContent())),
        })
      )
  }

  useEffect(() => {
    if (router.query.addEdit && router.query.addEdit !== 'add')
      dispatch(getCheckup(router.query.addEdit as string))
    else reset()
  }, [router.query.addEdit])

  useEffect(() => {
    if (client) {
      Object.keys(client).map(key => setValue(key as keyof TCheckupForm, client[key as 'phone']))
      setDesc(
        EditorState.createWithContent(
          // @ts-ignore
          ContentState.createFromBlockArray(convertFromHTML(client!?.comment))
        )
      )
    }
  }, [client])

  useEffect(() => {
    if (success) {
      reset()
      setDesc(EditorState.createEmpty())
      router.push({ pathname: '/clients/list', query: { page: 1, limit: 10 } })
    }
  }, [success])

  useEffect(() => {
    if (clientErrors?.length)
      clientErrors.map(item =>
        setError(item.param as keyof TCheckupForm, { type: 'custom', message: item.msg })
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <AddEditCard desc={desc} setDesc={setDesc} />
          <AddEditAction />
        </form>
      </Box>
    </FormProvider>
  )
}

export default AddEditCheckup
