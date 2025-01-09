import { FC } from 'react'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Heading, Input, Stack } from '@chakra-ui/react'

interface IProps {
  search: string
  setSearch: (value: string) => void
}

const TableHeader: FC<IProps> = props => {
  const { search, setSearch } = props
  const { t } = useTranslation()

  return (
    <Box>
      <Heading mb={2}>{t('clients')}</Heading>
      <Stack mb={4} justifyContent='space-between' flexDirection={{ base: 'column', md: 'row' }}>
        <Input
          width='auto'
          value={search}
          placeholder={t('search')}
          onChange={({ target }) => setSearch(target.value)}
        />
        <Button
          as={Link}
          variant='outline'
          colorScheme='teal'
          leftIcon={<AddIcon />}
          href='/clients/add'
        >
          {t('add_client')}
        </Button>
      </Stack>
    </Box>
  )
}

export default TableHeader
