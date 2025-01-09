import { mode } from '@chakra-ui/theme-tools'

const DraftEditorStyles = (props: any) => ({
  '.rdw-editor-toolbar': {
    backgroundColor: mode('white', '#2D3748')(props), // Light va Dark rang mosligi
    border: `1px solid ${mode('#E2E8F0', '#4A5568')(props)}`, // Border rangi
    color: mode('#1A202C', 'white')(props), // Toolbar ichidagi text rangi
    borderRadius: '8px',
    marginBottom: '8px',
  },
  '.rdw-option-wrapper': {
    backgroundColor: mode('white', '#4A5568')(props), // Light va Dark rang mosligi
    color: mode('#1A202C', 'white')(props), // Option ichidagi text rangi
    border: `1px solid ${mode('#E2E8F0', '#4A5568')(props)}`, // Option border rangi
    '&:hover': {
      backgroundColor: mode('#EDF2F7', '#2D3748')(props), // Hover holatida fon rangi
    },
  },
  '.rdw-dropdown-wrapper': {
    backgroundColor: mode('white', '#2D3748')(props),
    border: `1px solid ${mode('#E2E8F0', '#4A5568')(props)}`,
    color: mode('#1A202C', 'white')(props),
  },
  '.rdw-dropdown-optionwrapper': {
    backgroundColor: mode('white', '#2D3748')(props),
    border: `1px solid ${mode('#E2E8F0', '#4A5568')(props)}`,
    color: mode('#1A202C', 'white')(props),
  },
  '.rdw-editor-main': {
    backgroundColor: mode('white', '#2D3748')(props),
    color: mode('#1A202C', 'white')(props),
    border: `1px solid ${mode('#E2E8F0', '#4A5568')(props)}`,
    borderRadius: '8px',
    padding: '16px',
    minHeight: '200px',
  },
})

export default DraftEditorStyles
