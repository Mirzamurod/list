import type { FC } from 'react'

import { Card, CardBody, Text, VStack, HStack, Box } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

interface IProps {
  title: string
  value: number
  periodValue?: number
  icon?: React.ReactNode
  colorScheme?: string
}

const StatisticsCard: FC<IProps> = ({ title, value, periodValue, icon, colorScheme = 'blue' }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardBody>
        <VStack align='stretch' spacing={3}>
          <HStack justify='space-between' align='center'>
            <Text fontSize='sm' color='gray.500' fontWeight='medium'>
              {title}
            </Text>
            {icon && <Box color={`${colorScheme}.500`}>{icon}</Box>}
          </HStack>
          <VStack align='stretch' spacing={1}>
            <Text fontSize='2xl' fontWeight='bold' color={`${colorScheme}.600`}>
              {value.toLocaleString()}
            </Text>
            {periodValue !== undefined && (
              <Text fontSize='xs' color='gray.400'>
                {t('period')}: {periodValue.toLocaleString()}
              </Text>
            )}
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default StatisticsCard
