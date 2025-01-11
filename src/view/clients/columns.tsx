import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { IconButton, Tooltip, Text } from '@chakra-ui/react'
import { TColumns } from '@/types/table'
import { EditIcon } from '@chakra-ui/icons'
import { TClient } from '@/types/client'
import DeletePopover from '@/components/DeletePopover'
import { deleteClient, editClient } from '@/store/client'

const columns: TColumns[] = [
  {
    field: 'name',
    headerName: 'name',
    renderCell: ({ row }: { row: TClient }) => <Text>{row.name || '-'}</Text>,
  },
  { field: 'phone', headerName: 'phone' },
  { field: 'year', headerName: 'birthyear' },
  {
    field: 'action',
    headerName: 'action',
    isNumeric: true,
    renderCell: ({ row }: { row: TClient }) => {
      const { t } = useTranslation()

      return (
        <>
          <Tooltip label={t('edit_client')}>
            <IconButton
              mr={3}
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
        </>
      )
    },
  },
]

export default columns
