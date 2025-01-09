import { createSlice } from '@reduxjs/toolkit'
import { list, users } from '@/store/apis'
import { IRegister } from '@/types/user'

const initialState: IRegister = { isLoading: false, success: false, error: null }

const register = createSlice({
  name: 'register',
  initialState,
  reducers: {
    onStart: state => {
      state.isLoading = true
      state.success = false
    },
    onSuccess: (state, { payload }) => {
      state.success = payload.success
      state.isLoading = false
    },
    onFail: (state, { payload }) => {
      state.isLoading = false
      state.error = payload?.response?.data?.messages
      state.success = payload?.response?.data?.success
    },
  },
})

export const addUser = (data: any) =>
  list({
    url: users,
    method: 'post',
    data,
    onStart: register.actions.onStart.type,
    onSuccess: register.actions.onSuccess.type,
    onFail: register.actions.onFail.type,
  })

export default register.reducer
