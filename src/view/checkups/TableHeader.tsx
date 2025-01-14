import { FC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Heading, Input, Stack, Text } from '@chakra-ui/react'
import { useAppSelector } from '@/store'

interface IProps {
  search: string
  setSearch: (value: string) => void
}

const TableHeader: FC<IProps> = props => {
  const { search, setSearch } = props
  const { t } = useTranslation()
  const router = useRouter()

  const { client } = useAppSelector(state => state.client)

  return (
    <Box>
      <Heading mb={2}>{t('checkup')}</Heading>
      <Text fontSize='xl' mb={2}>
        {client?.name}
      </Text>
      <Stack mb={4} justifyContent='space-between' flexDirection={{ base: 'column', md: 'row' }}>
        <Input
          width='auto'
          value={search}
          placeholder={t('search')}
          onChange={({ target }) => setSearch(target.value)}
        />
        <Stack gap={2} flexDirection={{ base: 'column', md: 'row' }}>
          <Button
            as={Link}
            variant='outline'
            colorScheme='teal'
            leftIcon={<AddIcon />}
            href={`/checkup/add/${router.query.id}`}
          >
            {t('add_checkup')}
          </Button>
          <Button as={Link} href='/clients/list?page=1&limit=10'>
            {t('go_to_clients')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default TableHeader
