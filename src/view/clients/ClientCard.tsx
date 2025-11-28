import type { FC } from 'react'
import type { TClient } from '@/types/client'

import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Flex,
  HStack,
  IconButton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { TbCheckupList } from 'react-icons/tb'
import { IoMdEye } from 'react-icons/io'
import DeletePopover from '@/components/DeletePopover'
import { deleteClient } from '@/store/client'

interface IProps {
  client: TClient
}

const ClientCard: FC<IProps> = ({ client }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardBody>
        <VStack align='stretch' spacing={2}>
          <Text fontSize='lg' fontWeight='bold'>
            {client.name || '-'}
          </Text>
          <Flex justify='space-between'>
            <Text fontSize='sm' color='gray.500'>
              {t('phone')}:
            </Text>
            <Text fontSize='sm'>{client.phone || '-'}</Text>
          </Flex>
          <Flex justify='space-between'>
            <Text fontSize='sm' color='gray.500'>
              {t('birthyear')}:
            </Text>
            <Text fontSize='sm'>{client.year || '-'}</Text>
          </Flex>
          <Flex justify='space-between'>
            <Text fontSize='sm' color='gray.500'>
              {t('address')}:
            </Text>
            <Text fontSize='sm' noOfLines={1}>
              {client.address || '-'}
            </Text>
          </Flex>
        </VStack>
      </CardBody>
      <CardFooter pt={0}>
        <HStack w='full' justify='flex-end' gap={2}>
          <Tooltip label={t('view_client')}>
            <IconButton
              icon={<IoMdEye />}
              aria-label={t('view_client')}
              as={Link}
              href={`/clients/view/${client._id}`}
              size='sm'
            />
          </Tooltip>
          <Tooltip label={t('checkup')}>
            <IconButton
              icon={<TbCheckupList />}
              aria-label={t('checkup')}
              as={Link}
              href={`/checkup/list/${client._id}`}
              size='sm'
            />
          </Tooltip>
          <Tooltip label={t('edit_client')}>
            <IconButton
              icon={<EditIcon />}
              aria-label={t('edit_client')}
              as={Link}
              href={`/clients/${client._id}`}
              size='sm'
            />
          </Tooltip>
          <DeletePopover
            data={client}
            selector='client'
            deleteAction={deleteClient}
            label='delete_client'
          />
        </HStack>
      </CardFooter>
    </Card>
  )
}

export default ClientCard
