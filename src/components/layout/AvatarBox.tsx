import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { UserDataType } from '@/types/user'
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

export const AvatarBox = ({ collapse, user }: { collapse: boolean; user: UserDataType }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  return (
    <Flex
      w='full'
      pt={2}
      alignItems='center'
      justifyContent='space-between'
      gap={2}
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
          {/* <MenuItem as={Link} href='/settings'>
            {t('settings')}
          </MenuItem> */}
          <MenuItem onClick={() => dispatch(deleteUser())}>{t('logout')}</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}
