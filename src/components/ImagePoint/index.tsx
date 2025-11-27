import type { MouseEvent, Ref } from 'react'
import type { ControllerRenderProps } from 'react-hook-form'
import type { Coordinate } from '@/types/checkup'

import { forwardRef } from 'react'
import { Box, Image } from '@chakra-ui/react'

interface IProps {
  image: string
  alt: string
}

const ImagePoint = forwardRef<Ref<null>, IProps & ControllerRenderProps>((props, ref) => {
  const { image, alt, value, onChange } = props

  const handleImageClick = (e: MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const radius = 10

    const existingIndex = value.findIndex((circle: Coordinate) => {
      const dx = circle.x - x
      const dy = circle.y - y
      const distance = Math.sqrt(dx * dx + dy * dy)
      return distance <= radius
    })

    if (existingIndex !== -1)
      onChange(value.filter((_: any, index: number) => index !== existingIndex))
    else onChange([...value, { x, y }])
  }

  const handleCircleHover = (existingIndex: number) => {
    if (existingIndex !== -1)
      onChange(value.filter((_: any, index: number) => index !== existingIndex))
  }

  return (
    <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
      {/* Rasm */}
      <Image
        src={image}
        alt={alt}
        loading='lazy'
        sx={{
          display: 'block',
          maxWidth: '100%',
          height: 'auto',
        }}
        onClick={handleImageClick}
      />

      {/* Aylanalar */}
      {value.map((circle: Coordinate, index: number) => (
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
          onClick={() => handleCircleHover(index)}
        />
      ))}
    </Box>
  )
})

export default ImagePoint
