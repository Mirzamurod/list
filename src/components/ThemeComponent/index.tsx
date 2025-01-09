// React Import
import { ReactNode, useEffect } from 'react'

// Store

// chakra ui
import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react'
import theme from './theme'

const { ToastContainer } = createStandaloneToast()

const ThemeComponent = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (!localStorage.getItem('lang'))
      localStorage.setItem('lang', JSON.stringify({ lang: 'eng', name: 'Eng' }))
  }, [])

  return (
    <ChakraProvider
      theme={theme}
      toastOptions={{ defaultOptions: { isClosable: true, position: 'top-right' } }}
    >
      {children}
      <ToastContainer />
    </ChakraProvider>
  )
}

export default ThemeComponent
