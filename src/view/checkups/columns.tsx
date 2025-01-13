import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { IconButton, Tooltip, Text, HStack } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { TbCheckupList } from 'react-icons/tb'
import { IoMdEye } from 'react-icons/io'
import { TClient } from '@/types/client'
import DeletePopover from '@/components/DeletePopover'
import { deleteClient } from '@/store/client'
import { TColumns } from '@/types/table'

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
        <HStack justifyContent='end' gap={3}>
          <Tooltip label={t('view_client')}>
            <IconButton
              icon={<IoMdEye />}
              aria-label={t('view_client')}
              as={Link}
              href={`/clients/view/${row._id}`}
            />
          </Tooltip>
          <Tooltip label={t('checkup_client')}>
            <IconButton
              icon={<TbCheckupList />}
              aria-label={t('checkup_client')}
              as={Link}
              href={`/clients/checkup/${row._id}`}
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
