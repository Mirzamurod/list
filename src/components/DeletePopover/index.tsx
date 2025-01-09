import { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'next-i18next'
import {
  Button,
  ButtonGroup,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  StyleProps,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { RootState, useAppSelector } from '@/store'

interface IProps {
  data: any
  label: string
  deleteAction: any
  selector: keyof RootState
}

const DeletePopover: FC<IProps & StyleProps> = props => {
  const { data, deleteAction, selector, label } = props
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { onOpen, onClose, isOpen } = useDisclosure()

  const { success } = useAppSelector(state => state[selector])

  const confirm = (id: string) => dispatch(deleteAction(id))

  useEffect(() => {
    if (success) onClose()
  }, [success])

  return (
    <Popover placement='left' isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <Tooltip label={t(label)} placement='bottom-start'>
          <IconButton icon={<DeleteIcon />} aria-label={t(label)} onClick={onOpen} />
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent textAlign='start'>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight='semibold'>{t('confirmation')}</PopoverHeader>
        <PopoverBody>{t('are_you_sure')}</PopoverBody>
        <PopoverFooter display='flex' justifyContent='flex-end'>
          <ButtonGroup size='sm'>
            <Button colorScheme='red' variant='outline' onClick={() => confirm(data._id)}>
              {t('delete')}
            </Button>
            <Button variant='outline' onClick={onClose}>
              {t('close')}
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}

export default DeletePopover
