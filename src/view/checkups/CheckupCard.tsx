import type { FC } from 'react'
import type { TCheckup } from '@/types/checkup'

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
  Link as ChLink,
  Badge,
} from '@chakra-ui/react'
import { EditIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { IoMdEye } from 'react-icons/io'
import DeletePopover from '@/components/DeletePopover'
import { deleteCheckup } from '@/store/checkup'

interface IProps {
  checkup: TCheckup
}

const CheckupCard: FC<IProps> = ({ checkup }) => {
  const { t } = useTranslation()

  const xijomaItems = []
  if (checkup.xijoma?.head?.length) xijomaItems.push(t('head'))
  if (checkup.xijoma?.frontOfBody?.length) xijomaItems.push(t('frontOfBody'))
  if (checkup.xijoma?.backOfBody?.length) xijomaItems.push(t('backOfBody'))
  if (checkup.xijoma?.other?.length) xijomaItems.push(t('other'))

  return (
    <Card>
      <CardBody>
        <VStack align='stretch' spacing={2}>
          {checkup.device && (
            <Flex justify='space-between' align='center'>
              <Text fontSize='sm' color='gray.500'>
                {t('device')}:
              </Text>
              <ChLink href={checkup.device} isExternal fontSize='sm'>
                {t('link')} <ExternalLinkIcon mx='2px' />
              </ChLink>
            </Flex>
          )}
          {checkup.drugs && (
            <Flex justify='space-between'>
              <Text fontSize='sm' color='gray.500'>
                {t('drugs')}:
              </Text>
              <Text fontSize='sm' noOfLines={2} textAlign='right' flex={1} ml={2}>
                {checkup.drugs}
              </Text>
            </Flex>
          )}
          {xijomaItems.length > 0 && (
            <Flex justify='space-between' align='center' flexWrap='wrap' gap={1}>
              <Text fontSize='sm' color='gray.500'>
                {t('xijoma')}:
              </Text>
              <HStack spacing={1} flexWrap='wrap'>
                {xijomaItems.map((item, index) => (
                  <Badge key={index} colorScheme='teal' fontSize='xs'>
                    {item}
                  </Badge>
                ))}
              </HStack>
            </Flex>
          )}
          {checkup.createdOn && (
            <Flex justify='space-between'>
              <Text fontSize='sm' color='gray.500'>
                {t('createdOn')}:
              </Text>
              <Text fontSize='sm'>
                {new Date(checkup.createdOn).toLocaleDateString()}
              </Text>
            </Flex>
          )}
        </VStack>
      </CardBody>
      <CardFooter pt={0}>
        <HStack w='full' justify='flex-end' gap={2}>
          <Tooltip label={t('view_checkup')}>
            <IconButton
              icon={<IoMdEye />}
              aria-label={t('view_checkup')}
              as={Link}
              href={`/checkup/view/${checkup._id}/${checkup.clientId}`}
              size='sm'
            />
          </Tooltip>
          <Tooltip label={t('edit_checkup')}>
            <IconButton
              icon={<EditIcon />}
              aria-label={t('edit_checkup')}
              as={Link}
              href={`/checkup/${checkup._id}/${checkup.clientId}`}
              size='sm'
            />
          </Tooltip>
          <DeletePopover
            data={checkup}
            selector='checkup'
            deleteAction={deleteCheckup}
            label='delete_checkup'
          />
        </HStack>
      </CardFooter>
    </Card>
  )
}

export default CheckupCard

