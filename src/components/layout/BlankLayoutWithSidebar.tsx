import type { FC } from 'react'
import type { IBlankLayoutWithSidebar } from '@/types/blankLayout'
import type { Language } from '@/types/language'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import i18next from 'i18next'
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import navbar from '@/navigation/vertical'
import NavItem from './NavItem'
import { AvatarBox } from './AvatarBox'
import { MdMenu, MdOutlineDarkMode, MdSunny } from 'react-icons/md'
import { useAppSelector } from '@/store'
import { useLanguage } from '@/context/LanguageContext'
import { CloseIcon } from '@chakra-ui/icons'
import themeConfig from '@/configs/themeConfig'

const languageOptions: Language[] = [
  { lang: 'uz', name: 'Uz' },
  { lang: 'ru', name: 'Ru' },
  { lang: 'eng', name: 'Eng' },
]

const BlankLayoutWithSidebar: FC<IBlankLayoutWithSidebar> = props => {
  const { children } = props
  const { colorMode, toggleColorMode } = useColorMode()
  const bgcolor = useColorModeValue('#fff', '#1a202c')
  const { language, setLanguage } = useLanguage()
  const [collapse, setCollapse] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)

  const { user } = useAppSelector(state => state.login)

  const navItems = useMemo(() => {
    if (!user?.role) return []
    return navbar[user.role] ?? []
  }, [user?.role])

  const selectLang = useCallback(
    ({ lang, name }: Language) => {
      i18next.changeLanguage(lang)
      setLanguage({ lang, name })
    },
    [setLanguage]
  )

  const changeMenu = useCallback(() => {
    if (windowWidth > 991) setCollapse(prev => !prev)
    else setIsOpen(prev => !prev)
  }, [windowWidth])

  const updateWindowWidth = useCallback(() => {
    const width = window.innerWidth
    setWindowWidth(width)
    if (width > 991) setIsOpen(false)
  }, [])

  useEffect(() => {
    updateWindowWidth()
    window.addEventListener('resize', updateWindowWidth)

    return () => window.removeEventListener('resize', updateWindowWidth)
  }, [updateWindowWidth])

  return (
    <HStack w='full' h='100vh' padding={5}>
      {/* Sidebar */}
      <Flex
        top={5}
        w='full'
        as='aside'
        bottom={5}
        zIndex={4}
        padding={6}
        border='1px'
        overflow='auto'
        bgColor={bgcolor}
        alignItems='start'
        flexDirection='column'
        maxW={collapse ? 350 : 100}
        transition='ease-in-out .2s'
        justifyContent='space-between'
        h={{ base: 'auto', lg: 'full' }}
        borderRadius={{ base: '6px', lg: '2xl' }}
        position={isOpen ? 'absolute' : 'inherit'}
        display={{ base: isOpen ? 'flex' : 'none', lg: 'flex' }}
      >
        <Box w='full'>
          {/* Logo */}
          <Flex
            gap={4}
            w='full'
            alignItems='center'
            justifyContent='space-between'
            flexDirection={collapse ? 'row' : 'column'}
          >
            <Box display='flex' alignItems='center' gap={2}>
              {/* <Icon as={TbPerfume} fontSize={30} color='#f5a41d' /> */}
              <Image src={themeConfig.icon} alt='logo' width={30} height={30} />
              {collapse && (
                <Text fontWeight='bold' fontSize={16}>
                  {themeConfig.app.name}
                </Text>
              )}
            </Box>
            <Box display={{ lg: 'none' }}>
              <IconButton
                variant='ghost'
                aria-label='exit'
                icon={<CloseIcon />}
                onClick={() => setIsOpen(!isOpen)}
              />
            </Box>
          </Flex>
          {/* Navigation */}
          <List w='full' my={3}>
            {navItems.map(item => (
              <ListItem key={item.label + item.type}>
                <NavItem item={item} collapse={collapse} setIsOpen={setIsOpen} />
              </ListItem>
            ))}
          </List>
        </Box>
        <AvatarBox collapse={collapse} user={user!} />
      </Flex>
      {/* Main */}
      <Box
        as='main'
        w='full'
        h='full'
        overflow='auto'
        position='relative'
        borderRadius={{ lg: '2xl' }}
        border={{ base: '0px', lg: '1px' }}
      >
        <Flex mx={{ base: 0, lg: 4 }} mt={{ base: 0, lg: 4 }} justifyContent='space-between'>
          <IconButton aria-label='Menu Collapse' icon={<MdMenu />} onClick={changeMenu} />
          <Box>
            <IconButton
              mr={3}
              aria-label='Change Theme'
              icon={colorMode === 'dark' ? <MdSunny /> : <MdOutlineDarkMode />}
              onClick={() => toggleColorMode()}
            />
            <Menu>
              <MenuButton as={Button}>{language.name}</MenuButton>
              <MenuList>
                {languageOptions.map(item => (
                  <MenuItem onClick={() => selectLang(item as Language)} key={item.lang}>
                    {item.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
        </Flex>
        <Box py={4} px={{ base: 0, lg: 4 }}>
          {children}
        </Box>
      </Box>
    </HStack>
  )
}

export default BlankLayoutWithSidebar
