import { FC } from 'react'
import { Box, Image } from '@chakra-ui/react'
import { Coordinate } from '@/types/checkup'

interface IProps {
  image: string
  alt: string
  points?: Coordinate[]
}

const ImagePointView: FC<IProps> = props => {
  const { image, alt, points } = props

  return (
    <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
      {/* Rasm */}
      <Image src={image} alt={alt} sx={{ display: 'block', maxWidth: '100%', height: 'auto' }} />

      {/* Aylanalar */}
      {points?.map((circle, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: circle.y - 10,
            left: circle.x - 10,
            width: '20px',
            height: '20px',
            border: '3px solid red',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
        />
      ))}
    </Box>
  )
}

export default ImagePointView
