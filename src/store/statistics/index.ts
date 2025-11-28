import { createSlice } from '@reduxjs/toolkit'
import { list } from '@/store/apis'

export type StatisticsData = {
  totalClients: number
  totalCheckups: number
  periodClients: number
  periodCheckups: number
  period: string
  dateRange: { start: string; end: string } | null
}

type StatisticsState = {
  isLoading: boolean
  statistics: StatisticsData | null
  errors: null | string
  success: boolean
}

const initialState: StatisticsState = {
  isLoading: false,
  statistics: null,
  errors: null,
  success: false,
}

const statistics = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    onStart: state => {
      state.isLoading = true
      state.success = false
      state.errors = null
    },
    onSuccess: (state, { payload }) => {
      state.isLoading = false
      state.statistics = payload.data
      state.success = true
    },
    onFail: (state, { payload }) => {
      state.isLoading = false
      state.errors = payload?.message || 'Error loading statistics'
      state.success = false
    },
  },
})

export const getStatistics = (params?: { period?: string; startDate?: string; endDate?: string }) =>
  list({
    url: 'statistics',
    method: 'get',
    params,
    onStart: statistics.actions.onStart.type,
    onSuccess: statistics.actions.onSuccess.type,
    onFail: statistics.actions.onFail.type,
  })

export default statistics.reducer
