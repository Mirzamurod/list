import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useDispatch } from 'react-redux'
import {
  Box,
  Button,
  Card,
  CardBody,
  Collapse,
  Divider,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useAppSelector } from '@/store'
import { getClient } from '@/store/client'

const ViewClient = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const router = useRouter()
  const [show, setShow] = useState(false)

  const { client, isLoading } = useAppSelector(state => state.client)

  useEffect(() => {
    if (router.query.id) dispatch(getClient(router.query.id as string))
  }, [])

  return (
    <Box>
      <Stack mb={4} justifyContent='space-between' flexDirection={{ base: 'column', md: 'row' }}>
        <Heading>{t('customer_information')}</Heading>
        <Button as={Link} href='/clients/list?page=1&limit=10'>
          {t('go_to_clients')}
        </Button>
      </Stack>
      <Divider mt={5} />
      <Box mt={5}>
        {isLoading ? (
          <>
            <Skeleton height='25px' width='250px' />
            <Skeleton height='25px' width='250px' mt={3} />
          </>
        ) : (
          <Box>
            <VStack align='stretch'>
              <Flex>
                <Text fontSize='xl'>{t('name')}: &nbsp;</Text>
                <Text fontSize='xl'>{client?.name}</Text>
              </Flex>
              <Flex>
                <Text fontSize='xl'>{t('phone')}: &nbsp;</Text>
                <Text fontSize='xl' as={Link} href={`tel:+998${client?.phone}`}>
                  {client?.phone}
                </Text>
              </Flex>
              <Flex>
                <Text fontSize='xl'>{t('birthyear')}: &nbsp;</Text>
                <Text fontSize='xl'>{client?.year}</Text>
              </Flex>
              <Flex>
                <Text fontSize='xl'>{t('address')}: &nbsp;</Text>
                <Text fontSize='xl'>{client?.address}</Text>
              </Flex>
            </VStack>
            <Card mt={3}>
              <CardBody>
                <Text fontSize='xl' mb={3}>
                  {t('info')}: &nbsp;
                </Text>
                <Collapse startingHeight={20} in={show}>
                  <Text dangerouslySetInnerHTML={{ __html: client?.comment! }} />
                </Collapse>
                <Button size='sm' onClick={() => setShow(!show)} mt='1rem'>
                  {t(`show_${show ? 'less' : 'more'}`)}
                </Button>
              </CardBody>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ViewClient
