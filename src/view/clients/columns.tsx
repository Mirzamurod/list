import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import {
  IconButton,
  Tooltip,
  Text,
  FormControl,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  ButtonGroup,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import { TColumns } from '@/types/table'
import { EditIcon } from '@chakra-ui/icons'
import { useAppSelector } from '@/store'
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
  {
    field: 'block',
    headerName: 'block',
    isNumeric: true,
    renderCell: ({ row }: { row: TClient }) => {
      const { t } = useTranslation()
      const dispatch = useDispatch()
      const { onOpen, onClose, isOpen } = useDisclosure()

      const { success } = useAppSelector(state => state.client)

      const confirm = () => dispatch(editClient(row._id, { block: !row.block }))

      useEffect(() => {
        if (success) onClose()
      }, [success])

      return (
        <Popover placement='left' isOpen={isOpen} onClose={onClose}>
          <PopoverTrigger>
            <FormControl>
              <Switch id='email-alerts' isChecked={row.block} onChange={onOpen} />
            </FormControl>
          </PopoverTrigger>
          <PopoverContent textAlign='start'>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader fontWeight='semibold'>{t('confirmation')}</PopoverHeader>
            <PopoverBody>{t('want_to_change')}</PopoverBody>
            <PopoverFooter display='flex' justifyContent='flex-end'>
              <ButtonGroup size='sm'>
                <Button colorScheme='red' variant='outline' onClick={confirm}>
                  {t('yes')}
                </Button>
                <Button variant='outline' onClick={onClose}>
                  {t('no')}
                </Button>
              </ButtonGroup>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      )
    },
  },
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
