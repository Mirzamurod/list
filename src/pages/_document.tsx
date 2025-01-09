import theme from '@/components/ThemeComponent/theme'
import { ColorModeScript } from '@chakra-ui/react'
import { Head, Html, Main, NextScript } from 'next/document'

const MyDocument = () => (
  <Html lang='en'>
    <Head />
    <body>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Main />
      <NextScript />
    </body>
  </Html>
)

export default MyDocument
