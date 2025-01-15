import { FC, useState } from 'react'
import { Box, Image } from '@chakra-ui/react'

interface IProps {
  image: string
  alt: string
  points?: number[]
}

interface Circle {
  x: number
  y: number
}

const ImagePoint: FC<IProps> = props => {
  const { image, alt, points } = props
  const [circles, setCircles] = useState<Circle[]>([])

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()

    // Rasm ichida bosilgan joyni aniqlash
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const radius = 10 // Aylanalar radiusi (20px)

    // Mavjud aylana joylashganini aniqlash
    const existingIndex = circles.findIndex(circle => {
      const dx = circle.x - x // X koordinata farqi
      const dy = circle.y - y // Y koordinata farqi
      const distance = Math.sqrt(dx * dx + dy * dy) // Masofa hisoblash
      return distance <= radius // Radius ichida joylashgan aylana
    })

    if (existingIndex !== -1) {
      // Agar aylana mavjud bo'lsa, o'chiramiz
      setCircles(prev => prev.filter((_, index) => index !== existingIndex))
    } else {
      // Agar aylana mavjud bo'lmasa, qo'shamiz
      setCircles(prev => [...prev, { x, y }])
    }
  }

  const handleCircleHover = (existingIndex: number) => {
    console.log(`Aylana ${existingIndex} ustida hover qildingiz.`)
    if (existingIndex !== -1) {
      // Agar aylana mavjud bo'lsa, o'chiramiz
      setCircles(prev => prev.filter((_, index) => index !== existingIndex))
    }
  }

  return (
    <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
      {/* Rasm */}
      <Image
        src={image}
        alt={alt}
        sx={{
          display: 'block',
          maxWidth: '100%',
          height: 'auto',
        }}
        onClick={handleImageClick}
      />

      {/* Aylanalar */}
      {circles.map((circle, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: circle.y - 10, // Radiusni hisobga olamiz (top: y - radius)
            left: circle.x - 10, // Radiusni hisobga olamiz (left: x - radius)
            width: '20px', // Radiusni ikki marta kenglik
            height: '20px', // Radiusni ikki marta balandlik
            border: '3px solid red',
            borderRadius: '50%',
            // pointerEvents: 'none', // Aylanani bosib bo'lmaydi
            cursor: 'pointer',
          }}
          onClick={() => handleCircleHover(index)}
        />
      ))}
    </Box>
  )
}

export default ImagePoint
