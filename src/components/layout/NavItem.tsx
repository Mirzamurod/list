import type { FC } from 'react'
import type { TNavbar } from '@/types/navbar'

import { memo, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { ListIcon, Link as LinkChakra, Heading, Box, Badge, Text } from '@chakra-ui/react'

interface IProps {
  setIsOpen: (value: boolean) => void
  item: TNavbar
  collapse: boolean
}

const NavItemComponent: FC<IProps> = ({ item, collapse, setIsOpen }) => {
  const { label } = item
  const router = useRouter()
  const { t } = useTranslation()
  const isLinkItem = item.type === 'link'
  const linkHref = isLinkItem && 'link' in item ? item.link : ''
  const isActive = useMemo(() => {
    if (!isLinkItem || !linkHref) return false
    return router.pathname === linkHref || router.asPath === linkHref
  }, [isLinkItem, linkHref, router.asPath, router.pathname])

  if (isLinkItem) {
    const { icon, notifications, pathname, query, link } = item

    return (
      <Box display='flex' alignItems='center' my={1} justifyContent='center'>
        <LinkChakra
          // @ts-ignore
          href={{ pathname, query }}
          as={Link}
          gap={1}
          p={2}
          w='full'
          display='flex'
          borderRadius={6}
          alignItems='center'
          _hover={{ textDecoration: 'none', bgColor: '#8585853d', p: 2 }}
          fontWeight={isActive ? 'bold' : 'medium'}
          bgColor={isActive ? '#8585853d' : ''}
          justifyContent={!collapse ? 'center' : ''}
          onClick={() => setIsOpen(false)}
        >
          <ListIcon as={icon} fontSize={22} m='0' />
          {collapse && (
            <Text ml={3} noOfLines={1}>
              {t(label)}
            </Text>
          )}
        </LinkChakra>
        {collapse ? (
          notifications ? (
            <Badge borderRadius='full' colorScheme='yellow' w={6} textAlign='center'>
              {notifications}
            </Badge>
          ) : null
        ) : null}
      </Box>
    )
  }

  return (
    <Heading
      mt={5}
      mb={3}
      fontSize='sm'
      color='gray.400'
      fontWeight='medium'
      borderColor='gray.100'
      textTransform='uppercase'
      borderTopWidth={collapse ? 0 : 1}
    >
      <Text display={collapse ? 'flex' : 'none'}>{t(label)}</Text>
    </Heading>
  )
}

const NavItem = memo(NavItemComponent)
NavItem.displayName = 'NavItem'

export default NavItem
