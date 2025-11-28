import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'next-i18next'
import {
  Box,
  Heading,
  SimpleGrid,
  Select,
  HStack,
  Input,
  FormLabel,
  FormControl,
  Flex,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { useAppSelector } from '@/store'
import { getStatistics } from '@/store/statistics'
import StatisticsCard from '@/components/StatisticsCard'
import { MdPeople, MdAssignment } from 'react-icons/md'

const Home = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [period, setPeriod] = useState<string>('month')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const { statistics, isLoading } = useAppSelector(state => state.statistics)

  useEffect(() => {
    dispatch(
      getStatistics({
        period,
        ...(startDate && endDate ? { startDate, endDate } : {}),
      })
    )
  }, [period, startDate, endDate, dispatch])

  const handlePeriodChange = (value: string) => {
    setPeriod(value)
    if (value !== 'custom') {
      setStartDate('')
      setEndDate('')
    }
  }

  return (
    <Box>
      <Heading mb={6}>{t('statistics')}</Heading>

      <Box mb={6}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <FormControl>
            <FormLabel>{t('period')}</FormLabel>
            <Select value={period} onChange={e => handlePeriodChange(e.target.value)}>
              <option value='week'>{t('week')}</option>
              <option value='month'>{t('month')}</option>
              <option value='year'>{t('year')}</option>
              <option value='custom'>{t('custom')}</option>
            </Select>
          </FormControl>

          {period === 'custom' && (
            <>
              <FormControl>
                <FormLabel>{t('start_date')}</FormLabel>
                <Input type='date' value={startDate} onChange={e => setStartDate(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>{t('end_date')}</FormLabel>
                <Input type='date' value={endDate} onChange={e => setEndDate(e.target.value)} />
              </FormControl>
            </>
          )}
        </SimpleGrid>
      </Box>

      {isLoading ? (
        <Flex alignItems='center' justifyContent='center' py={10}>
          <Spinner />
          <Text ml={3}>{t('loading')}...</Text>
        </Flex>
      ) : statistics ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <StatisticsCard
            title={t('total_clients')}
            value={statistics.totalClients}
            periodValue={statistics.periodClients}
            icon={<MdPeople size={24} />}
            colorScheme='blue'
          />
          <StatisticsCard
            title={t('total_checkups')}
            value={statistics.totalCheckups}
            periodValue={statistics.periodCheckups}
            icon={<MdAssignment size={24} />}
            colorScheme='green'
          />
          <StatisticsCard
            title={t('period_clients')}
            value={statistics.periodClients}
            icon={<MdPeople size={24} />}
            colorScheme='teal'
          />
          <StatisticsCard
            title={t('period_checkups')}
            value={statistics.periodCheckups}
            icon={<MdAssignment size={24} />}
            colorScheme='purple'
          />
        </SimpleGrid>
      ) : (
        <Text>{t('no_data')}</Text>
      )}
    </Box>
  )
}

export default Home
