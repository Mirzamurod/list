import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { IconButton, Tooltip, Text, HStack, Box, Link as ChLink } from '@chakra-ui/react'
import { EditIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { IoMdEye } from 'react-icons/io'
import DeletePopover from '@/components/DeletePopover'
import { TColumns } from '@/types/table'
import { TCheckup } from '@/types/checkup'
import { deleteCheckup } from '@/store/checkup'

const columns: TColumns[] = [
  {
    field: 'device',
    headerName: 'device',
    maxWidth: 170,
    renderCell: ({ row }: { row: TCheckup }) => {
      const { t } = useTranslation()

      return row.device ? (
        <ChLink href={row.device} isExternal>
          {t('link')} <ExternalLinkIcon mx='2px' />
        </ChLink>
      ) : (
        '-'
      )
    },
  },
  {
    field: 'drugs',
    headerName: 'drugs',
    maxWidth: 170,
    renderCell: ({ row }: { row: TCheckup }) => <Text noOfLines={1}>{row.drugs || '-'}</Text>,
  },
  {
    field: 'xijoma',
    headerName: 'xijoma',
    renderCell: ({ row }: { row: TCheckup }) => {
      const { t } = useTranslation()

      return (
        <Box>
          <Text>{row.xijoma?.head?.length ? t('head') : null} </Text>
          <Text>{row.xijoma?.frontOfBody?.length ? t('frontOfBody') : null}</Text>
          <Text>{row.xijoma?.backOfBody?.length ? 'backOfBody' : null}</Text>
          <Text>{row.xijoma?.other?.length ? 'other' : null}</Text>
        </Box>
      )
    },
  },
  {
    field: 'createdOn',
    headerName: 'createdOn',
    renderCell: ({ row }: { row: TCheckup }) => (
      <Text>{row.createdOn?.toString().slice(0, 10)}</Text>
    ),
  },
  {
    field: 'action',
    headerName: 'action',
    isNumeric: true,
    renderCell: ({ row }: { row: TCheckup }) => {
      const { t } = useTranslation()

      return (
        <HStack justifyContent='end' gap={3}>
          <Tooltip label={t('view_checkup')}>
            <IconButton
              icon={<IoMdEye />}
              aria-label={t('view_checkup')}
              as={Link}
              href={`/checkup/view/${row._id}/${row.clientId}`}
            />
          </Tooltip>
          <Tooltip label={t('edit_checkup')}>
            <IconButton
              icon={<EditIcon />}
              aria-label={t('edit_checkup')}
              as={Link}
              href={`/checkup/${row._id}/${row.clientId}`}
            />
          </Tooltip>
          <DeletePopover
            data={row}
            selector='checkup'
            deleteAction={deleteCheckup}
            label='delete_checkup'
          />
        </HStack>
      )
    },
  },
]

export default columns
