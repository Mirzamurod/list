import { FC } from 'react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'next-i18next'
import { Controller, useFormContext } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import {
  Box,
  Grid,
  GridItem,
  useColorMode,
  FormLabel,
  Textarea,
  FormControl,
  FormErrorMessage,
  Text,
  Image,
} from '@chakra-ui/react'
import { TTextareaType } from '@/types/input'
import ImagePoint from '@/components/ImagePoint'

const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false })

interface IProps {
  desc: any
  setDesc: any
}

const AddEditCard: FC<IProps> = props => {
  const { desc, setDesc } = props
  const { colorMode } = useColorMode()
  const { t } = useTranslation()
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext()

  const inputs: TTextareaType[] = [{ name: 'device' }, { name: 'drugs' }]

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
          </GridItem>
        ))}
      </Grid>
      <Grid mt={4}>
        <GridItem>
          <Text>{t('xijoma_points')}</Text>
          <Box
            p='4'
            mt={4}
            rounded='md'
            boxShadow='md'
            bg={colorMode === 'light' ? 'white' : '#2D3748'}
            color={colorMode === 'light' ? '#1A202C' : 'white'}
          >
            {[
              { image: '/images/xijoma_head_point.jpg', alt: 'head' },
              { image: '/images/xijoma_front_point.jpg', alt: 'front' },
              { image: '/images/xijoma_back_point.jpg', alt: 'back' },
              { image: '/images/xijoma_other_point.jpg', alt: 'hand_foot' },
            ].map(item => (
              <Box key={item.image}>
                <Text>{t(item.alt)}</Text>
                <Controller
                  control={control}
                  name=''
                  render={({ field }) => <ImagePoint {...item} />}
                />
              </Box>
            ))}
          </Box>
        </GridItem>
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
