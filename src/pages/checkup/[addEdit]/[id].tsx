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
import { Box, Button, Heading, Stack, Text, useToast } from '@chakra-ui/react'
import { useAppSelector } from '@/store'
import AddEditCard from '@/view/checkup/AddEditCard'
import AddEditAction from '@/view/checkup/AddEditAction'
import { addCheckup, editCheckup, getCheckup } from '@/store/checkup'
import { TCheckupForm } from '@/types/checkup'
import { getClient } from '@/store/client'

const AddEditCheckup = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()
  const toast = useToast()
  const formSchema = yup.object().shape({
    device: yup.string(),
    drugs: yup.string(),
    xijoma: yup.object().shape({
      head: yup.array(yup.object().shape({ x: yup.number(), y: yup.number() })),
      backOfBody: yup.array(yup.object().shape({ x: yup.number(), y: yup.number() })),
      headfrontOfBody: yup.array(yup.object().shape({ x: yup.number(), y: yup.number() })),
      other: yup.array(yup.object().shape({ x: yup.number(), y: yup.number() })),
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

  const { success, errors: checkupErrors, checkup } = useAppSelector(state => state.checkup)
  const { client } = useAppSelector(state => state.client)

  const onSubmit = (values: TCheckupForm) => {
    if (
      values?.device?.length ||
      values?.drugs?.length ||
      values?.xijoma?.head?.length ||
      values?.xijoma?.frontOfBody?.length ||
      values?.xijoma?.backOfBody?.length ||
      values?.xijoma?.other?.length
    ) {
      if (router.query.addEdit === 'add')
        dispatch(
          addCheckup({
            ...values,
            clientId: router.query.id as string,
            comment: draftToHtml(convertToRaw(desc.getCurrentContent())),
          })
        )
      else
        dispatch(
          editCheckup(router.query.addEdit as string, {
            ...values,
            clientId: router.query.id as string,
            comment: draftToHtml(convertToRaw(desc.getCurrentContent())),
          })
        )
    } else
      toast({
        title: t('must_one_item'),
        status: 'warning',
        position: 'top-right',
        isClosable: true,
        variant: 'left-accent',
      })
  }

  useEffect(() => {
    if (router.query.addEdit && router.query.addEdit !== 'add')
      dispatch(getCheckup(router.query.addEdit as string))
    else reset()
  }, [router.query.addEdit])

  useEffect(() => {
    if (checkup) {
      Object.keys(checkup).map(key => setValue(key as keyof TCheckupForm, checkup[key as 'device']))
      setDesc(
        EditorState.createWithContent(
          // @ts-ignore
          ContentState.createFromBlockArray(convertFromHTML(checkup!?.comment))
        )
      )
    }
  }, [checkup])

  useEffect(() => {
    if (success) {
      reset()
      setDesc(EditorState.createEmpty())
      router.push({ pathname: `/checkup/list/${router.query.id}`, query: { page: 1, limit: 10 } })
    }
  }, [success])

  useEffect(() => {
    if (checkupErrors?.length)
      checkupErrors.map(item =>
        setError(item.param as keyof TCheckupForm, { type: 'custom', message: item.msg })
      )
  }, [checkupErrors])

  useEffect(() => {
    dispatch(getClient(router.query.id as string))
  }, [])

  return (
    <FormProvider {...methods}>
      <Box>
        <Stack mb={4} justifyContent='space-between' flexDirection={{ base: 'column', md: 'row' }}>
          <Box>
            <Heading>{t(router.query.addEdit === 'add' ? 'add_checkup' : 'edit_checkup')}</Heading>
            <Text fontSize='xl'>{client?.name}</Text>
          </Box>
          <Button as={Link} href={`/checkup/list/${router.query.id}?page=1&limit=10`}>
            {t('go_to_checkup')}
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
