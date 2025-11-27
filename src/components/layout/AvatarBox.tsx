import type { UserDataType } from '@/types/user'

import { memo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'next-i18next'
import { MdOutlineMoreHoriz } from 'react-icons/md'
import {
  Avatar,
  AvatarBadge,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react'
import { deleteUser } from '@/store/user/login'

const AvatarBoxComponent = ({ collapse, user }: { collapse: boolean; user: UserDataType }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleLogout = useCallback(() => {
    dispatch(deleteUser())
  }, [dispatch])

  return (
    <Flex
      pt={2}
      gap={2}
      w='full'
      alignItems='center'
      justifyContent='space-between'
      flexDirection={collapse ? 'row' : 'column-reverse'}
    >
      {collapse ? (
        <Flex alignItems='center'>
          <Avatar size='sm' mr={3}>
            <AvatarBadge boxSize='1em' bg={`${user.block ? 'gray' : 'green'}.500`} />
          </Avatar>
          <Text fontSize='xl' fontWeight='bold' pb={0} lineHeight={0}>
            {user.name || user.phone}
          </Text>
        </Flex>
      ) : null}

      <Menu>
        <MenuButton
          as={IconButton}
          aria-label='Settings'
          icon={<MdOutlineMoreHoriz />}
          borderRadius='full'
          color='gray.400'
          variant='ghost'
          fontSize={20}
        />
        <MenuList>
          <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}

export const AvatarBox = memo(AvatarBoxComponent)
AvatarBox.displayName = 'AvatarBox'
