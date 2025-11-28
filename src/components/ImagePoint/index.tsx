import type { MouseEvent, Ref } from 'react'
import type { ControllerRenderProps } from 'react-hook-form'
import type { Coordinate } from '@/types/checkup'

import { forwardRef, useEffect, useRef, useState } from 'react'
import { Box, Image } from '@chakra-ui/react'

interface IProps {
  image: string
  alt: string
}

const ImagePoint = forwardRef<Ref<null>, IProps & ControllerRenderProps>((props, ref) => {
  const { image, alt, value, onChange } = props
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
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

  const handleImageClick = (e: MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current || imageSize.naturalWidth === 0 || imageSize.naturalHeight === 0) return

    const rect = imageRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    const radius = 10
    const scaleX = imageSize.width / imageSize.naturalWidth
    const scaleY = imageSize.height / imageSize.naturalHeight

    const existingIndex = value.findIndex((circle: Coordinate) => {
      const scaledX = circle.x * scaleX
      const scaledY = circle.y * scaleY
      const dx = scaledX - clickX
      const dy = scaledY - clickY
      const distance = Math.sqrt(dx * dx + dy * dy)
      return distance <= radius
    })

    if (existingIndex !== -1)
      onChange(value.filter((_: any, index: number) => index !== existingIndex))
    else {
      const normalizedX = clickX / scaleX
      const normalizedY = clickY / scaleY
      onChange([...value, { x: normalizedX, y: normalizedY }])
    }
  }

  const handleCircleHover = (existingIndex: number) => {
    if (existingIndex !== -1)
      onChange(value.filter((_: any, index: number) => index !== existingIndex))
  }

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
    <Box ref={containerRef} sx={{ position: 'relative', display: 'inline-block', mb: 2, width: '100%' }}>
      {/* Rasm */}
      <Image
        ref={imageRef}
        src={image}
        alt={alt}
        loading='lazy'
        sx={{
          display: 'block',
          maxWidth: '100%',
          height: 'auto',
          width: '100%',
        }}
        onClick={handleImageClick}
      />

      {/* Aylanalar */}
      {value.map((circle: Coordinate, index: number) => {
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
              pointerEvents: 'auto',
            }}
            onClick={() => handleCircleHover(index)}
          />
        )
      })}
    </Box>
  )
})

export default ImagePoint
