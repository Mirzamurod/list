import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { IconButton, Tooltip, Text, HStack } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { IoMdEye } from 'react-icons/io'
import DeletePopover from '@/components/DeletePopover'
import { deleteClient } from '@/store/client'
import { TColumns } from '@/types/table'
import { TCheckup } from '@/types/checkup'

const columns: TColumns[] = [
  {
    field: 'device',
    headerName: 'device',
    renderCell: ({ row }: { row: TCheckup }) => <Text>{row.device || '-'}</Text>,
  },
  {
    field: 'drugs',
    headerName: 'drugs',
    renderCell: ({ row }: { row: TCheckup }) => <Text>{row.drugs || '-'}</Text>,
  },
  {
    field: 'xijoma',
    headerName: 'xijoma',
    renderCell: ({ row }: { row: TCheckup }) => <Text>Qo'l</Text>,
  },
  {
    field: 'action',
    headerName: 'action',
    isNumeric: true,
    renderCell: ({ row }: { row: TCheckup }) => {
      const { t } = useTranslation()

      return (
        <HStack justifyContent='end' gap={3}>
          <Tooltip label={t('view_client')}>
            <IconButton
              icon={<IoMdEye />}
              aria-label={t('view_client')}
              as={Link}
              href={`/clients/view/${row._id}`}
            />
          </Tooltip>
          <Tooltip label={t('edit_client')}>
            <IconButton
              icon={<EditIcon />}
              aria-label={t('edit_client')}
              as={Link}
              href={`/clients/${row._id}`}
            />
          </Tooltip>
          <DeletePopover
            data={row}
            selector='client'
            deleteAction={deleteClient}
            label='delete_client'
          />
        </HStack>
      )
    },
  },
]

export default columns
