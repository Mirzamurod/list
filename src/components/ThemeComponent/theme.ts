import { ThemeConfig, extendTheme } from '@chakra-ui/react'
import DraftEditorStyles from '../DraftEditorStyles'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({ config, global: (props: any) => ({ ...DraftEditorStyles(props) }) })

export default theme
