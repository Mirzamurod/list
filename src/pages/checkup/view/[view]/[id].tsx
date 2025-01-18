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
  Link as ChLink,
} from '@chakra-ui/react'
import { useAppSelector } from '@/store'
import { getCheckup } from '@/store/checkup'
import ImagePointView from '@/components/ImagePointView'
import { getClient } from '@/store/client'
import { ExternalLinkIcon } from '@chakra-ui/icons'

const ViewCheckup = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const router = useRouter()
  const [show, setShow] = useState(false)

  const { checkup, isLoading } = useAppSelector(state => state.checkup)
  const { client } = useAppSelector(state => state.client)

  useEffect(() => {
    if (router.query.view) {
      dispatch(getCheckup(router.query.view as string))
      dispatch(getClient(router.query.id as string))
    }
  }, [])

  return (
    <Box>
      <Stack mb={4} justifyContent='space-between' flexDirection={{ base: 'column', md: 'row' }}>
        <Heading>{t('checkup_information')}</Heading>
        <Button as={Link} href={`/checkup/list/${router.query.id}?page=1&limit=10`}>
          {t('go_to_checkup')}
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
              {checkup?.device ? (
                <Flex>
                  <Text fontSize='xl'>{t('device')}: &nbsp;</Text>
                  <ChLink fontSize='xl' href={checkup?.device} isExternal>
                    {t('link')} <ExternalLinkIcon mx='2px' />
                  </ChLink>
                </Flex>
              ) : null}
              <Flex>
                <Text fontSize='xl'>{t('drugs')}: &nbsp;</Text>
                <Text fontSize='xl'>{checkup?.drugs}</Text>
              </Flex>
            </VStack>
            <Card mt={3}>
              <CardBody>
                <Text fontSize='xl' mb={3}>
                  {t('xijoma_points')}: &nbsp;
                </Text>
                {[
                  { image: '/images/xijoma_head_point.jpg', alt: 'head', name: 'head' },
                  { image: '/images/xijoma_front_point.jpg', alt: 'front', name: 'backOfBody' },
                  { image: '/images/xijoma_back_point.jpg', alt: 'back', name: 'frontOfBody' },
                  { image: '/images/xijoma_other_point.jpg', alt: 'hand_foot', name: 'other' },
                ].map(item => (
                  <Box key={item.name}>
                    <ImagePointView {...item} points={checkup?.xijoma?.[item.name as 'head']} />
                  </Box>
                ))}
              </CardBody>
            </Card>
            {checkup?.comment ? (
              <Card mt={3}>
                <CardBody>
                  <Text fontSize='xl' mb={3}>
                    {t('info')}: &nbsp;
                  </Text>
                  <Collapse startingHeight={20} in={show}>
                    <Text dangerouslySetInnerHTML={{ __html: checkup?.comment! }} />
                  </Collapse>
                  <Button size='sm' onClick={() => setShow(!show)} mt='1rem'>
                    {t(`show_${show ? 'less' : 'more'}`)}
                  </Button>
                </CardBody>
              </Card>
            ) : null}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ViewCheckup
