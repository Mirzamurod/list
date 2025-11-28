import type { FC } from 'react'
import type { Coordinate } from '@/types/checkup'

import { useEffect, useRef, useState } from 'react'
import { Box, Image } from '@chakra-ui/react'

interface IProps {
  image: string
  alt: string
  points?: Coordinate[]
}

const ImagePointView: FC<IProps> = props => {
  const { image, alt, points } = props
  const imageRef = useRef<HTMLImageElement>(null)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 })

  useEffect(() => {
    const updateImageSize = () => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect()
        setImageSize({
          width: rect.width,
          height: rect.height,
          naturalWidth: imageRef.current.naturalWidth,
          naturalHeight: imageRef.current.naturalHeight,
        })
      }
    }

    updateImageSize()
    window.addEventListener('resize', updateImageSize)
    const img = imageRef.current
    if (img) {
      img.addEventListener('load', updateImageSize)
    }

    return () => {
      window.removeEventListener('resize', updateImageSize)
      if (img) {
        img.removeEventListener('load', updateImageSize)
      }
    }
  }, [image])

  const getScaledPosition = (circle: Coordinate) => {
    if (imageSize.naturalWidth === 0 || imageSize.naturalHeight === 0 || imageSize.width === 0 || imageSize.height === 0) {
      return { x: circle.x, y: circle.y }
    }
    const scaleX = imageSize.width / imageSize.naturalWidth
    const scaleY = imageSize.height / imageSize.naturalHeight
    return {
      x: circle.x * scaleX,
      y: circle.y * scaleY,
    }
  }

  return (
    <Box sx={{ position: 'relative', display: 'inline-block', mb: 2, width: '100%' }}>
      {/* Rasm */}
      <Image
        ref={imageRef}
        alt={alt}
        src={image}
        loading='lazy'
        sx={{ display: 'block', maxWidth: '100%', height: 'auto', width: '100%' }}
      />

      {/* Aylanalar */}
      {points?.map((circle, index) => {
        const scaled = getScaledPosition(circle)
        return (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: `${scaled.y - 10}px`,
              left: `${scaled.x - 10}px`,
              width: '20px',
              height: '20px',
              border: '3px solid red',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          />
        )
      })}
    </Box>
  )
}

export default ImagePointView
