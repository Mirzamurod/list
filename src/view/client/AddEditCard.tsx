import { FC } from 'react'
import dynamic from 'next/dynamic'
import {
  Box,
  Grid,
  GridItem,
  InputGroup,
  Input as ChInput,
  useColorMode,
  InputLeftAddon,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import Input from '@/components/Input'
import { TInputType } from '@/types/input'
import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'

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
    formState: { errors },
  } = useFormContext()

  const inputs: TInputType[] = [
    { name: 'name', isRequired: true },
    { name: 'year', label: 'birthyear', isRequired: true },
    { name: 'address', isRequired: true },
    // { name: 'phone', isRequired: true },
  ]

  return (
    <Box>
      <Grid
        templateColumns={{
          xl: 'repeat(3, 1fr)',
          lg: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          sm: 'repeat(2, 1fr)',
          base: 'repeat(1, 1fr)',
        }}
        gap={4}
      >
        {inputs.map(item => (
          <GridItem key={item.name}>
            <Input {...item} />
          </GridItem>
        ))}
        <GridItem>
          <FormControl isInvalid={!!errors?.phone?.message} isRequired>
            <FormLabel htmlFor='phone'>{t('phone')}</FormLabel>
            <InputGroup>
              <InputLeftAddon>+998</InputLeftAddon>
              <ChInput {...register('phone')} type='number' placeholder={t('phone')} />
            </InputGroup>
            {errors?.phone?.message ? (
              <FormErrorMessage>{t(errors?.phone?.message as string)}</FormErrorMessage>
            ) : null}
          </FormControl>
        </GridItem>
      </Grid>
      <Grid columnGap={4} mt={4}>
        <GridItem>
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
