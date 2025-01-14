import { FC, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import {
  Box,
  Grid,
  GridItem,
  useColorMode,
  FormLabel,
  Textarea,
  FormControl,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react'
import { TInputType, TTextareaType } from '@/types/input'

const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false })

interface IProps {
  desc: any
  setDesc: any
}

const AddEditCard: FC<IProps> = props => {
  const { desc, setDesc } = props
  const { colorMode } = useColorMode()
  const { t } = useTranslation()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const inputs: TTextareaType[] = [{ name: 'device' }, { name: 'drugs' }]

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto' // Avvalgi balandlikni tozalash
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px` // Yangi balandlikni o'rnatish
    }
  }

  return (
    <Box>
      <Grid
        templateColumns={{
          // xl: 'repeat(3, 1fr)',
          // lg: 'repeat(2, 1fr)',
          // md: 'repeat(3, 1fr)',
          sm: 'repeat(2, 1fr)',
          base: 'repeat(1, 1fr)',
        }}
        gap={4}
      >
        {inputs.map(item => (
          <GridItem key={item.name}>
            <FormControl isInvalid={!!errors?.[item.name]?.message}>
              <FormLabel htmlFor={item.name}>{t(item.label || item.name)}</FormLabel>
              <Textarea
                {...item}
                {...props}
                minRows={2}
                // maxRows={10}
                resize='none'
                id={item.name}
                as={TextareaAutosize}
                placeholder={t(item.placeholder || item.label || item.name)}
              />
              {errors?.[item.name]?.message ? (
                <FormErrorMessage>{t(errors?.[item.name]?.message as string)}</FormErrorMessage>
              ) : null}
            </FormControl>
            {/* <Textarea
              rows={2}
              {...item}
              {...props}
              resize='none'
              id={item.name}
              ref={textareaRef}
              onInput={handleInput}
              placeholder={t(item.placeholder || item.label || item.name)}
            /> */}
          </GridItem>
        ))}
      </Grid>
      <Grid columnGap={4} mt={4}>
        <GridItem>
          <FormLabel>{t('info')}</FormLabel>
          <Box
            bg={colorMode === 'light' ? 'white' : '#2D3748'}
            color={colorMode === 'light' ? '#1A202C' : 'white'}
            p='4'
            rounded='md'
            boxShadow='md'
          >
            <Editor
              toolbarClassName='rdw-editor-toolbar'
              wrapperClassName='rdw-editor-wrapper'
              editorClassName='rdw-editor-main'
              editorState={desc}
              onEditorStateChange={setDesc}
            />
          </Box>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default AddEditCard
